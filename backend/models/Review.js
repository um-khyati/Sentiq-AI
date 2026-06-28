const mongoose = require("mongoose");

/**
 * Review Schema
 *
 * Represents a single guest review, mirroring the fields already used
 * by the SentiqAI frontend (Reviews page, AI Insights page, Dashboard).
 */
const reviewSchema = new mongoose.Schema(
  {
    guest: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
      maxlength: [120, "Guest name cannot exceed 120 characters"],
    },
    room: {
      type: String,
      required: [true, "Room type is required"],
      trim: true,
      maxlength: [120, "Room type cannot exceed 120 characters"],
    },
    sentiment: {
      type: String,
      required: [true, "Sentiment is required"],
      enum: {
        values: ["Positive", "Negative", "Neutral"],
        message: "Sentiment must be one of: Positive, Negative, Neutral",
      },
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [0, "Score cannot be less than 0"],
      max: [100, "Score cannot be greater than 100"],
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: [2000, "Review text cannot exceed 2000 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

// Helpful index for the search endpoint
reviewSchema.index({ guest: "text", room: "text", text: "text" });

module.exports = mongoose.model("Review", reviewSchema);
