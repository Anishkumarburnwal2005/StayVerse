const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controller/listing.js")

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(listingController.renderShowForm)
    .put(isLoggedIn, isOwner,  validateListing, wrapAsync(listingController.update));

// Index Route
router.get("/", listingController.index);

// Create Route
//router.post("/post", isLoggedIn,  validateListing, wrapAsync(listingController.create));
router.post("/post", upload.single('listing[image][url]'), (req, res) => {
    res.send(req.file);
})


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

// Delete Route
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;


// // Show Route
// router.get("/:id", listingController.renderShowForm);
// // Update Route
// router.put("/:id", isLoggedIn, isOwner,  validateListing, wrapAsync(listingController.update));