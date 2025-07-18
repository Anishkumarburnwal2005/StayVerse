const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router.get("/", userController.root);

router
  .route("/signUp")
  .get(userController.getSign) //signUp
  .post(wrapAsync(userController.postSign)); //signUp

router
  .route("/login")
  .get(userController.getLogin) //Login
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLogin
  ); //login

router.get("/logout", userController.logout);

module.exports = router;

// router.get("/signUp", userController.getSign);
// router.post("/signUp", wrapAsync(userController.postSign));
// router.get("/login", userController.getLogin)
// router.post("/login",saveRedirectUrl, passport.authenticate("local",
//     {failureRedirect: "/login",
//     failureFlash: true
//     }
// ),
//     userController.postLogin
// );
