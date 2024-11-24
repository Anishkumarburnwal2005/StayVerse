const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/", (req, res) => {
    res.render("Users/Sign.ejs");
});

router.get("/Sign", (req, res) => {
    res.render("Users/form.ejs");
})

router.post("/signUp", wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        let registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to Wanderlust!")
        res.redirect("/listings");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/Sign")
    }
}))

router.get("/login", (req, res) => {
    res.render("Users/login.ejs");
})

router.post("/login",passport.authenticate("local",
    {failureRedirect: "/login",
    failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect("/listings");
})

module.exports = router;