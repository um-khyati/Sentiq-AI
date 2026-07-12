const rateLimit = require("express-rate-limit");

/**
 * authLimiter
 *
 * Caps repeated hits on the auth endpoints (login/register) to slow down
 * brute-force / credential-stuffing attempts.
 *
 * Max 5 requests per IP per 15-minute window. Once exceeded, the caller
 * gets a 429 with a clear JSON error until the window resets.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts from this IP. Please try again in 15 minutes.",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = { authLimiter };
