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

// NOTE: specific string routes ("/search", "/stats") must be declared
// BEFORE the dynamic "/:id" route, otherwise Express/Mongoose would try
// to interpret "search" or "stats" as an ObjectId and fail.
router.get("/search", searchReviews);
router.get("/stats", getReviewStats);

router.route("/").get(getReviews).post(createReview);

router.route("/:id").get(getReviewById).put(updateReview).delete(deleteReview);

module.exports = router;
