/**
 * testPrompts.js
 *
 * Runs the 3 prompt variations documented in PROMPTS.md (repo root)
 * against the same 3 sample guest reviews, using your real
 * GEMINI_API_KEY, and prints the results.
 *
 * This is what actually produced the "example input/output" tables in
 * PROMPTS.md — run it yourself and paste your own output in before
 * submitting, since results can vary slightly run to run.
 *
 * Usage (from backend/):
 *   node scripts/testPrompts.js
 */
require("dotenv").config();
const { generateContent } = require("../services/geminiService");

const SAMPLE_REVIEWS = [
  {
    label: "Clearly positive",
    guest: "Amara Okafor",
    room: "Deluxe King",
    text: "Staff were incredibly attentive and the room was spotless. Best homestay we've had in Uttarakhand — would come back in a heartbeat.",
  },
  {
    label: "Clearly negative",
    guest: "Rohan Mehta",
    room: "Standard Twin",
    text: "The room smelled musty, the hot water didn't work for two days, and nobody at the front desk seemed to care when we complained.",
  },
  {
    label: "Mixed / ambiguous",
    guest: "Priya Nair",
    room: "Mountain View Cottage",
    text: "The view was absolutely stunning and breakfast was great, but the wifi barely worked and it was hard to get any work done.",
  },
];

// --- Variant A: zero-shot, minimal instruction, no schema, no JSON mode ---
const variantA = {
  name: "A — Zero-shot, plain instruction",
  jsonMode: false,
  systemPrompt: "",
  buildUserPrompt: (r) =>
    `Classify the sentiment of this hotel guest review as Positive, Negative, or Neutral. Also give a confidence score from 0-100 and a one-sentence summary.\n\nReview: ${r.text}`,
};

// --- Variant B: role + strict JSON schema + rules (PRODUCTION CHOICE) ---
// Imported indirectly by re-declaring here so this script has no runtime
// dependency on aiController.js — kept identical to controllers/aiController.js on purpose.
const variantB = {
  name: "B — Role + strict JSON schema + rules (used in production)",
  jsonMode: true,
  systemPrompt: `You are SentiqAI's guest-feedback analyst for a small hospitality business (a hotel or homestay). You read one guest review at a time and decide its sentiment.

Always reply with a single valid JSON object and nothing else — no markdown, no code fences, no explanation outside the JSON. It must match exactly this shape:
{"sentiment": "Positive" | "Negative" | "Neutral", "confidence": <integer 0-100>, "summary": "<one or two sentence note for hotel staff>"}

Rules:
- "confidence" reflects how clearly the review leans toward that sentiment, not how positive or negative it is.
- "summary" must name the concrete thing that drove the sentiment (e.g. staff attentiveness, cleanliness, noise, food, value for money) so staff know what to act on.
- If the review is mixed, sarcastic, or doesn't clearly lean either way, use "Neutral".`,
  buildUserPrompt: (r) =>
    [
      `Guest: ${r.guest}`,
      `Room: ${r.room}`,
      `Review: """${r.text}"""`,
      "",
      "Classify this review's sentiment and respond with the JSON object only.",
    ].join("\n"),
};

// --- Variant C: reasoning-guided (weigh specific aspects), still JSON-only output ---
const variantC = {
  name: "C — Reasoning-guided (weigh aspects), JSON-only output",
  jsonMode: true,
  systemPrompt: `You are an experienced hotel guest-experience manager reading one guest review.

Before deciding, mentally weigh the specific aspects the guest mentions (staff, cleanliness, noise, food, value, location, wifi, etc.) and whether each is a positive or negative signal. Do NOT show this reasoning in your reply.

Respond with only this JSON object, nothing else:
{"sentiment": "Positive" | "Negative" | "Neutral", "confidence": <integer 0-100>, "summary": "<one or two sentence note for hotel staff>"}`,
  buildUserPrompt: (r) => `Review: """${r.text}"""`,
};

const VARIANTS = [variantA, variantB, variantC];

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "GEMINI_API_KEY is not set. Copy backend/.env.example to backend/.env and add your key first."
    );
    process.exit(1);
  }

  for (const review of SAMPLE_REVIEWS) {
    console.log(`\n${"=".repeat(70)}\nSAMPLE REVIEW — ${review.label}\n"${review.text}"\n${"=".repeat(70)}`);

    for (const variant of VARIANTS) {
      process.stdout.write(`\n[${variant.name}]\n`);
      try {
        const output = await generateContent({
          systemPrompt: variant.systemPrompt,
          userPrompt: variant.buildUserPrompt(review),
          temperature: 0.2,
          jsonMode: variant.jsonMode,
        });
        console.log(output.trim());
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
      }
    }
  }
}

run();
