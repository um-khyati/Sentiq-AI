/**
 * geminiService
 *
 * Thin wrapper around Google Gemini's `generateContent` REST endpoint.
 * All HTTP/timeout/error-shape concerns for talking to the AI provider
 * live here, so controllers only have to think about prompts and
 * business logic — see backend/controllers/aiController.js.
 *
 * Docs: https://ai.google.dev/gemini-api/docs/get-started
 */

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-1.5-flash";
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Error type for anything that goes wrong talking to the AI provider.
 * Carries an HTTP statusCode so backend/middleware/errorMiddleware.js can
 * forward the *right* status to the frontend (e.g. 429 on rate limit,
 * 504 on timeout) instead of a blanket 500.
 */
class AIServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "AIServiceError";
    this.statusCode = statusCode;
  }
}

/**
 * Calls Gemini with a system + user prompt and returns the raw text of
 * the model's reply (expected to be a JSON string — see aiController.js,
 * which sets generationConfig.responseMimeType to "application/json").
 *
 * @param {Object} params
 * @param {string} params.systemPrompt — role/instructions/output-schema
 * @param {string} params.userPrompt — the actual review + context
 * @param {number} [params.temperature=0.2] — low = more consistent classification
 * @param {boolean} [params.jsonMode=true] — set generationConfig.responseMimeType to force valid JSON
 * @returns {Promise<string>} raw text returned by the model
 */
async function generateContent({ systemPrompt, userPrompt, temperature = 0.2, jsonMode = true }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AIServiceError(
      "AI service is not configured — GEMINI_API_KEY is missing on the server.",
      500
    );
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  // Gemini has no client-side SDK guarantee on latency, so we enforce our
  // own timeout rather than let a slow/hung request block the request
  // indefinitely — this is the "what happens if it times out" handling
  // the Week 7 brief asks for.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new AIServiceError("The AI provider took too long to respond. Please try again.", 504);
    }
    throw new AIServiceError("Could not reach the AI provider. Check your network connection.", 502);
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 429) {
    throw new AIServiceError("AI provider rate limit reached. Please wait a moment and try again.", 429);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || "";
    } catch (_) {
      // Error body wasn't JSON (or was empty) — fall back to the generic message below.
    }
    throw new AIServiceError(`AI provider returned an error${detail ? `: ${detail}` : ""}.`, 502);
  }

  const data = await response.json();

  // A prompt blocked by Gemini's safety filters comes back as a 200 with
  // no candidates rather than an error — treat that as a failure too.
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new AIServiceError("AI provider returned an empty response.", 502);
  }

  return text;
}

module.exports = { generateContent, AIServiceError };
