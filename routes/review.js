const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Joi = require("joi");
const {reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
    
    let {error} = reviewSchema.validate(req.body);

    if(error) {
        throw new ExpressError(400, error);
    }else{
        next();
    }

}


//Review
//Post Review Route

router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success", "New Review Created!")
   res.redirect(`/listings/${listing._id}`)
}));

router.delete("/:reviewId", wrapAsync( async (req, res) => {
   let { id, reviewId} = req.params;
   let listing = await Listing.findById(req.params.id);

   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review Deleted!")
   res.redirect(`/listings/${listing._id}`)
}))


module.exports = router;
