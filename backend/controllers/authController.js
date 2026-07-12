const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * Generates a signed JWT for a given user id.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

/**
 * @desc    Register a new user (backs the Signup page)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are all required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with that email already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    },
  });
});

/**
 * @desc    Authenticate a user and return a token (backs the Login page)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // password has `select: false` on the schema, so it must be requested explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    },
  });
});

/**
 * @desc    Google OAuth callback — passport has already verified the user
 *          (see backend/config/passport.js) and attached it to req.user.
 *          We issue our own JWT and hand the browser back to the
 *          frontend, which picks the token up from the URL.
 * @route   GET /api/auth/google/callback
 * @access  Public (reached only after Google's consent screen)
 */
const googleCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
});

/**
 * @desc    Return the currently authenticated user. Used by the frontend
 *          route guard / OAuth callback page to confirm a token is valid
 *          and fetch the profile it belongs to.
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: { id: req.user._id, name: req.user.name, email: req.user.email },
    },
  });
});

module.exports = { registerUser, loginUser, googleCallback, getMe };
