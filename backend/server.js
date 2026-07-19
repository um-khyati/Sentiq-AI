// Load environment variables from .env as the very first thing
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");

const connectDB = require("./config/db");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// --- Global middleware ---
// In production, only the configured CLIENT_URL may call this API. In
// development we fall back to the default Next.js dev origin (rather
// than "*") so a stray/misconfigured request doesn't silently succeed.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // no session — auth state lives in the JWT, not the server

// --- Health check / root route ---
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SentiqAI API is running",
  });
});

// --- API routes ---
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// --- Error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SentiqAI API server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

module.exports = app;
