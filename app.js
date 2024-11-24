const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")))

app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const  ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");

const listingRouters = require("./routes/route.js");
const reviewRouters = require("./routes/review.js");
const userRouters = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passPort = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");

const sessionOptions = {
    secret: "My pleasure",
    resave: false,
    saveUninitialized: true, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

main()
.then(() => {
    console.log("Database was connected")
})
.catch((err) => {
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderList");
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passPort.initialize());
app.use(passPort.session());
passPort.use(new LocalStartegy(User.authenticate()));

passPort.serializeUser(User.serializeUser());
passPort.deserializeUser(User.deserializeUser());

// app.get("/demoUser", async (req, res) => {
//     let fakeUser = new User({
//         email:"abc",
//         username: "ABC"
//     });
//     let newUser = await User.register(fakeUser, "helloworld")
//     res.send(newUser);
// })

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", listingRouters);
app.use("/listings/:id/reviews", reviewRouters);
app.use("/", userRouters);

app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found!!");
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went Wrong"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err});
    next(); 
})

app.listen(port, () => {
    console.log(`Server is listening on PORT ${port}`)
})


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa 2",
//         description: "By the home and ishq",
//         price: 12000,
//         location: "Asansol haha",
//         country: "Austrelia"
//     })

//     await sampleListing.save();
//     res.send("Successsful")
// })
