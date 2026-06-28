const Review = require("../models/Review");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all reviews (optionally filtered by sentiment/room via query params)
 * @route   GET /api/reviews
 * @access  Public
 */
const getReviews = asyncHandler(async (req, res) => {
  const filter = {};
  const { sentiment, room } = req.query;

  if (sentiment) filter.sentiment = sentiment;
  if (room) filter.room = room;

  const reviews = await Review.find(filter).sort({ date: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    Get a single review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Public
 */
const createReview = asyncHandler(async (req, res) => {
  const { guest, room, sentiment, score, text, date } = req.body;

  const review = await Review.create({ guest, room, sentiment, score, text, date });

  res.status(201).json({ success: true, data: review });
});

/**
 * @desc    Update an existing review
 * @route   PUT /api/reviews/:id
 * @access  Public
 */
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  const { guest, room, sentiment, score, text, date } = req.body;

  if (guest !== undefined) review.guest = guest;
  if (room !== undefined) review.room = room;
  if (sentiment !== undefined) review.sentiment = sentiment;
  if (score !== undefined) review.score = score;
  if (text !== undefined) review.text = text;
  if (date !== undefined) review.date = date;

  const updatedReview = await review.save();

  res.status(200).json({ success: true, data: updatedReview });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Public
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  await review.deleteOne();

  res.status(200).json({ success: true, data: { id: req.params.id } });
});

/**
 * @desc    Search/filter reviews by guest name, room, sentiment, or review text
 * @route   GET /api/reviews/search?q=keyword
 * @access  Public
 *
 * This is the "additional endpoint" required by the assignment, distinct
 * from the standard CRUD operations above.
 */
const searchReviews = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    res.status(400);
    throw new Error("A search query (?q=) is required");
  }

  const regex = new RegExp(q.trim(), "i"); // case-insensitive partial match

  const reviews = await Review.find({
    $or: [{ guest: regex }, { room: regex }, { sentiment: regex }, { text: regex }],
  }).sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    query: q,
    data: reviews,
  });
});

/**
 * @desc    Get aggregated review statistics (used by the Dashboard page)
 * @route   GET /api/reviews/stats
 * @access  Public
 */
const getReviewStats = asyncHandler(async (req, res) => {
  const total = await Review.countDocuments();
  const positive = await Review.countDocuments({ sentiment: "Positive" });
  const negative = await Review.countDocuments({ sentiment: "Negative" });
  const neutral = await Review.countDocuments({ sentiment: "Neutral" });

  res.status(200).json({
    success: true,
    data: { total, positive, negative, neutral },
  });
});

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
  getReviewStats,
};
