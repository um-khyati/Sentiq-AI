const express = require("express");
const router = express.Router();

const { analyzeSentiment } = require("../controllers/aiController");
const { validate } = require("../middleware/validate");
const { aiSentimentSchema } = require("../validators/aiValidators");
const { aiLimiter } = require("../middleware/rateLimiter");

// POST /api/ai/sentiment — the Week 7 AI feature endpoint.
// Order: rate limit first (cheap check, blocks abuse before it touches
// validation or the paid/quota-limited Gemini call), then validate the
// payload shape, then the controller.
router.post("/sentiment", aiLimiter, validate(aiSentimentSchema), analyzeSentiment);

module.exports = router;
