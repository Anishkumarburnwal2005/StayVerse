if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
};

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.static(path.join(__dirname, "public"))); 

app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const mongoose = require("mongoose");

const listingRouters = require("./routes/listing.js");
const reviewRouters = require("./routes/review.js");
const userRouters = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passPort = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require('./models/listing.js');
const { Console } = require('console');

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("Databse was connected successfully");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

// app.get("/", (req, res) => {
//     res.send("Working Baby!");
// })

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



app.use(session(sessionOptions));
app.use(passPort.initialize());
app.use(passPort.session());
app.use(flash()); 

passPort.use(new LocalStrategy(User.authenticate()));
passPort.serializeUser(User.serializeUser());
passPort.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});

app.get("/listings/page/:category", wrapAsync(async(req, res) => {
    let {category:categListing} = req.params;
    let categoryListings = await Listing.find({category:categListing});
    if(categoryListings.length==0){
        req.flash("error", `Listings are not exist for ${categListing}!`);
        return res.redirect("/listings");
    }
    res.render("listings/categoryPage", {categoryListings});
}));

app.get("/listings/search", wrapAsync(async(req, res) => {
    let {search:locateListing} = req.query;
    if(locateListing ===""){
        const redirectUrl = req.headers.referer || "/listing";
        await req.flash("error", "Enter a valid location!");
        return res.redirect(`${redirectUrl}`);
    }
    let locationListings = await Listing.find({location:{ $regex: new RegExp(locateListing, "i")}});
   
    if(locationListings.length===0){
        const redirectUrl = req.headers.referer || "/listing";
        await req.flash("error", `Listings are not exist for ${locateListing}!`);
        return res.redirect(`${redirectUrl}`);
    }
    res.render("listings/locationPage", {locationListings});
}));

app.get("/showPhotos/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const redirectUrl = req.headers.referer || "/listing";
    res.render("listings/showPhotos.ejs", {listing, redirectUrl});
}));

app.get("/listing/privacy", (req, res) => {
    res.render("Users/privacy.ejs");
});

app.get("/listing/terms", (req, res) => {
    res.render("Users/terms.ejs");
});

app.use("/listings", listingRouters);
app.use("/listings/:id/reviews", reviewRouters);
app.use("/", userRouters);

app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found!!");
});

// Global error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("errPage/error.ejs", { message }); 
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on PORT ${port}`);
});