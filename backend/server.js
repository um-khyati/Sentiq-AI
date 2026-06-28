// Load environment variables from .env as the very first thing
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// --- Global middleware ---
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // allow the Next.js frontend to call this API
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

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

// --- Error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SentiqAI API server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

module.exports = app;
