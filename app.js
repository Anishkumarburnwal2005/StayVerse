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
const mongoose = require("mongoose");

const listingRouters = require("./routes/listing.js");
const reviewRouters = require("./routes/review.js");
const userRouters = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passPort = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const sessionOptions = {
    secret: "My pleasure",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// Database connection
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wonderList");
        console.log("Database was connected");
    } catch (err) {
        console.log("Database connection failed:", err.message);
    }
}

main();

// app.get("/", (req, res) => {
//     res.send("Working Baby!");
// })

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