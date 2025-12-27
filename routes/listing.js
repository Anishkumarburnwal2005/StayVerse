const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
//const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controller/listing.js");

//Home route
router.get("/", listingController.home);

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Index Route
router.get("/index", listingController.index);

// Create Route
router.post(
  "/post",
  isLoggedIn,
  upload.array("listing[image]", 5),
  validateListing,
  wrapAsync(listingController.create)
);

//Privacy route
router.get("/privacy", wrapAsync(listingController.privacy));

//Terms route
router.get("/terms", wrapAsync(listingController.terms));

//Search
router.get("/search", wrapAsync(listingController.search));

router
  .route("/:id")

  //Show route
  .get(listingController.renderShowForm)

  //Update route
  .put(
    isLoggedIn,
    isOwner,
    upload.array("listing[image]", 5),
    validateListing,
    wrapAsync(listingController.update)
  );

// Edit Route
router.get("/:id/location", wrapAsync(listingController.renderShowForm2));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

// Delete Route
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.delete)
);

//Category
router.get("/page/:category", wrapAsync(listingController.category));

module.exports = router;

// // Show Route
// router.get("/:id", listingController.renderShowForm);
// // Update Route
// router.put("/:id", isLoggedIn, isOwner,  validateListing, wrapAsync(listingController.update));
