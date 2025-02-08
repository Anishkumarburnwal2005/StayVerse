const User = require("../models/user.js");

module.exports.root =  (req, res) => {
    res.redirect("/listings");
};

module.exports.getSign =  (req, res) => {
    res.render("Users/signUp.ejs");
};

module.exports.postSign = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!")
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signUp")
    }
};

module.exports.getLogin = (req, res) => {
    res.render("Users/login.ejs");
};

module.exports.postLogin = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
};