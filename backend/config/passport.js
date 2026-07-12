const crypto = require("crypto");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

/**
 * Google OAuth2 strategy.
 *
 * We run this stateless (no express-session / passport.session()) since
 * the app already uses JWTs for auth — the callback route below issues
 * our own JWT once Google confirms the user's identity, so we never
 * need to keep a login session on the server.
 *
 * Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_CALLBACK_URL
 * in .env (see .env.example). Get these from the Google Cloud Console:
 * https://console.cloud.google.com/apis/credentials
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(new Error("Google account did not return an email address"), null);
        }

        // If someone already registered locally with this email, link the
        // Google identity to that existing account instead of erroring out.
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || "Google User",
            email,
            // Users signing in via Google never use a password, so we
            // generate a random one purely to satisfy the schema — it's
            // never exposed and can't be used to log in via /auth/login
            // in any meaningful way since the attacker would need it AND
            // there's nothing to gain from guessing it.
            password: crypto.randomBytes(32).toString("hex"),
            authProvider: "google",
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (user.authProvider === "local") user.authProvider = "local"; // keep as-is, just link the id
          await user.save({ validateBeforeSave: false });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
