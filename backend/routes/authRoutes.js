const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const { registerUser, loginUser, googleCallback, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema, validate } = require("../validators/authValidators");

// --- Local email/password auth ---
// Order: rate limit first (cheap check, blocks abuse before it even
// touches validation/DB), then validate the payload shape, then the
// controller.
router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);

// --- Current user (used by the frontend route guard) ---
router.get("/me", requireAuth, getMe);

// --- Google OAuth ---
// Step 1: kick off the flow — redirects the browser to Google's consent screen.
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

// Step 2: Google redirects back here with the result. On failure, bounce
// back to the frontend login page with an error flag; on success, issue
// our JWT (see googleCallback) and redirect to the frontend.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=oauth_failed`,
  }),
  googleCallback
);

module.exports = router;
