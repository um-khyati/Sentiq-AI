const { z } = require("zod");
const asyncHandler = require("../middleware/asyncHandler");
const { generateContent, AIServiceError } = require("../services/geminiService");

/**
 * The exact JSON shape required back from the model. An LLM's output
 * isn't guaranteed the way a DB query's is, so if Gemini ever returns
 * something that doesn't match this (malformed JSON, missing field,
 * out-of-range confidence, an invented sentiment label) we treat it as
 * an upstream failure rather than forwarding garbage to the frontend.
 */
const aiResultSchema = z.object({
  sentiment: z.enum(["Positive", "Negative", "Neutral"]),
  confidence: z.number().min(0).max(100),
  summary: z.string().min(1).max(500),
});

/**
 * System prompt — this is "Variant B" from PROMPTS.md (role + strict
 * JSON schema + explicit rules), chosen after testing against the two
 * alternatives documented there. See PROMPTS.md at the repo root for
 * the full comparison and example outputs.
 */
const SYSTEM_PROMPT = `You are SentiqAI's guest-feedback analyst for a small hospitality business (a hotel or homestay). You read one guest review at a time and decide its sentiment.

Always reply with a single valid JSON object and nothing else — no markdown, no code fences, no explanation outside the JSON. It must match exactly this shape:
{"sentiment": "Positive" | "Negative" | "Neutral", "confidence": <integer 0-100>, "summary": "<one or two sentence note for hotel staff>"}

Rules:
- "confidence" reflects how clearly the review leans toward that sentiment, not how positive or negative it is.
- "summary" must name the concrete thing that drove the sentiment (e.g. staff attentiveness, cleanliness, noise, food, value for money) so staff know what to act on.
- If the review is mixed, sarcastic, or doesn't clearly lean either way, use "Neutral".`;

function buildUserPrompt({ guest, room, text }) {
  return [
    `Guest: ${guest?.trim() || "Unknown guest"}`,
    `Room: ${room?.trim() || "Unspecified"}`,
    `Review: """${text.trim()}"""`,
    "",
    "Classify this review's sentiment and respond with the JSON object only.",
  ].join("\n");
}

/**
 * @desc    Analyze the sentiment of a guest review using Google Gemini
 * @route   POST /api/ai/sentiment
 * @access  Public (rate-limited — see middleware/rateLimiter.js aiLimiter)
 */
const analyzeSentiment = asyncHandler(async (req, res) => {
  const { text, guest, room } = req.body;

  const rawText = await generateContent({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt({ guest, room, text }),
    temperature: 0.2,
  });

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new AIServiceError("AI provider returned a response that wasn't valid JSON.", 502);
  }

  const result = aiResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new AIServiceError("AI provider returned an unexpected response shape.", 502);
  }

  res.status(200).json({ success: true, data: result.data });
});

module.exports = { analyzeSentiment, SYSTEM_PROMPT, buildUserPrompt };
