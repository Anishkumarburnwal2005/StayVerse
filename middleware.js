module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.path, "..", req.orignalUrl);
    console.log(req);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.orignalUrl;
        req.flash("error", "You must be logged in to create listing!")
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}