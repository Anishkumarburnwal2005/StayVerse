const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controller/review.js");

//Review
//Post Review Route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.post));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.delete)
);
// listing._id
module.exports = router;
