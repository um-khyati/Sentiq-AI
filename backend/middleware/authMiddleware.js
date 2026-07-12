const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

/**
 * requireAuth (a.k.a. verifyToken)
 *
 * Reads the JWT from the `Authorization: Bearer <token>` header, verifies
 * it against JWT_SECRET, and attaches the corresponding user to `req.user`.
 * Any route that should only be reachable by logged-in users gets this
 * middleware applied before its controller.
 *
 * Usage: router.post("/", requireAuth, createReview);
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error(
      err.name === "TokenExpiredError"
        ? "Not authorized — token expired"
        : "Not authorized — invalid token"
    );
  }

  // Confirm the user still exists (e.g. wasn't deleted after the token was issued)
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Not authorized — user no longer exists");
  }

  req.user = user;
  next();
});

module.exports = { requireAuth };
