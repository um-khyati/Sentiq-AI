const express = require("express");
const router = express.Router();
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
  getReviewStats,
} = require("../controllers/reviewController");
const { requireAuth } = require("../middleware/authMiddleware");

// NOTE: specific string routes ("/search", "/stats") must be declared
// BEFORE the dynamic "/:id" route, otherwise Express/Mongoose would try
// to interpret "search" or "stats" as an ObjectId and fail.
router.get("/search", searchReviews);
router.get("/stats", getReviewStats);

// Reads stay public (dashboard/reviews list can be browsed), but writes
// require a valid JWT — this is what makes "protected API routes" real:
// hitting these without a token returns 401.
router.route("/").get(getReviews).post(requireAuth, createReview);

router
  .route("/:id")
  .get(getReviewById)
  .put(requireAuth, updateReview)
  .delete(requireAuth, deleteReview);

module.exports = router;
