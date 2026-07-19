const { z } = require("zod");

/**
 * Schema for POST /api/ai/sentiment.
 *
 * `text` is the only required field — `guest`/`room` are optional context
 * the model uses to phrase its summary, mirroring what the AI Insights
 * form on the frontend actually sends.
 */
const aiSentimentSchema = z.object({
  text: z
    .string({ required_error: "Review text is required" })
    .trim()
    .min(3, "Review text is too short to analyze")
    .max(2000, "Review text cannot exceed 2000 characters"),
  guest: z.string().trim().max(120, "Guest name cannot exceed 120 characters").optional(),
  room: z.string().trim().max(120, "Room type cannot exceed 120 characters").optional(),
});

module.exports = { aiSentimentSchema };
