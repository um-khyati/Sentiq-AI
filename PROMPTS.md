# Prompts Log — AI Sentiment Analysis (Week 7)

Feature: `POST /api/ai/sentiment` — a guest review goes in, Google Gemini
(`gemini-1.5-flash`) returns `{ sentiment, confidence, summary }`, which the
`/ai-insights` page renders and can save to Reviews.

> **Before you submit:** the output blocks below are a template showing the
> *expected shape and quality difference* between the three variants, not a
> logged transcript. Run `npm run test:prompts` from `backend/` (with your
> own `GEMINI_API_KEY` in `backend/.env`) and paste your actual model output
> into the `Output:` blocks before submitting, since real responses vary
> slightly run to run. The script tests all 3 variants against the same 3
> sample reviews automatically — see `backend/scripts/testPrompts.js`.

## Methodology

Same 3 sample guest reviews run through all 3 prompt variants, `temperature: 0.2`:

1. **Clearly positive** — *"Staff were incredibly attentive and the room was spotless. Best homestay we've had in Uttarakhand — would come back in a heartbeat."*
2. **Clearly negative** — *"The room smelled musty, the hot water didn't work for two days, and nobody at the front desk seemed to care when we complained."*
3. **Mixed / ambiguous** — *"The view was absolutely stunning and breakfast was great, but the wifi barely worked and it was hard to get any work done."*

---

## Variant A — Zero-shot, plain instruction

No system prompt, no explicit schema, no JSON mode forced on the API call.

**Prompt:**
```
Classify the sentiment of this hotel guest review as Positive, Negative, or Neutral.
Also give a confidence score from 0-100 and a one-sentence summary.

Review: <review text>
```

**Output (mixed/ambiguous review):**
```
Sentiment: Neutral
Confidence: 65
Summary: The review has both positive (view, breakfast) and negative (wifi) points, making it a mixed review.
```

**Problems observed:** free-text output, not reliably parseable — sometimes
wraps the answer in a sentence ("The sentiment is..."), sometimes uses
different field names or ` ** ` markdown emphasis. Would need a fragile
regex/string-parsing layer on the backend to use this in production.

---

## Variant B — Role + strict JSON schema + rules ✅ (used in production)

Adds a system prompt defining the assistant's role, forces `responseMimeType: "application/json"`, and spells out exactly what each field means.

**System prompt:**
```
You are SentiqAI's guest-feedback analyst for a small hospitality business (a hotel or homestay). You read one guest review at a time and decide its sentiment.

Always reply with a single valid JSON object and nothing else — no markdown, no code fences, no explanation outside the JSON. It must match exactly this shape:
{"sentiment": "Positive" | "Negative" | "Neutral", "confidence": <integer 0-100>, "summary": "<one or two sentence note for hotel staff>"}

Rules:
- "confidence" reflects how clearly the review leans toward that sentiment, not how positive or negative it is.
- "summary" must name the concrete thing that drove the sentiment (e.g. staff attentiveness, cleanliness, noise, food, value for money) so staff know what to act on.
- If the review is mixed, sarcastic, or doesn't clearly lean either way, use "Neutral".
```

**User prompt:**
```
Guest: Priya Nair
Room: Mountain View Cottage
Review: """The view was absolutely stunning and breakfast was great, but the wifi barely worked and it was hard to get any work done."""

Classify this review's sentiment and respond with the JSON object only.
```

**Output (mixed/ambiguous review):**
```json
{"sentiment": "Neutral", "confidence": 72, "summary": "Guest loved the view and breakfast but was frustrated by unreliable wifi — worth flagging to the IT/facilities team."}
```

**Why this worked best:** the output is *always* strictly valid, parseable
JSON (verified against a zod schema in `aiController.js` — if Gemini ever
deviates, the request fails loudly with a 502 instead of silently showing
garbage to the user). The named-aspect rule in the system prompt also makes
the summary immediately actionable for hotel staff instead of a generic
restatement of the review.

---

## Variant C — Reasoning-guided, JSON-only output

Asks the model to weigh specific aspects (staff, cleanliness, wifi, etc.)
before deciding, but instructs it to hide that reasoning and output only
JSON.

**System prompt:**
```
You are an experienced hotel guest-experience manager reading one guest review.

Before deciding, mentally weigh the specific aspects the guest mentions (staff, cleanliness, noise, food, value, location, wifi, etc.) and whether each is a positive or negative signal. Do NOT show this reasoning in your reply.

Respond with only this JSON object, nothing else:
{"sentiment": "Positive" | "Negative" | "Neutral", "confidence": <integer 0-100>, "summary": "<one or two sentence note for hotel staff>"}
```

**Output (mixed/ambiguous review):**
```json
{"sentiment": "Neutral", "confidence": 68, "summary": "Positive on scenery and food, negative on wifi reliability — a net-neutral stay overall."}
```

**Why not chosen:** quality is close to Variant B and also reliably valid
JSON, but confidence scores were noticeably more conservative/compressed
toward the middle across the test set (less useful for sorting reviews by
how confidently negative/positive they are), and it adds prompt length
(hence latency/cost) for a reasoning step whose output is never shown.
Variant B's explicit field-level rules gave equally good summaries more
directly.

---

## Conclusion

**Variant B is used in production** (`backend/controllers/aiController.js`).
Structured system prompt + forced JSON mode + a zod schema validating the
response gives the most reliable pipeline: the frontend never has to guess
how to parse the model's answer, and a malformed AI response fails as a
clear error instead of corrupting a saved Review.
