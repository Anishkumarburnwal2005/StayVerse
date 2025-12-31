const express = require("express");
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const googleController = require("../controller/googleUser");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleController.authenticated
);

router.get("/ownListings/:id", wrapAsync(googleController.ownListings));

router.get("/info/:id", wrapAsync(googleController.userData));

module.exports = router;
