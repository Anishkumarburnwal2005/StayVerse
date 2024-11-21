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

const Routers = require("./routes/route.js");
const Reviews = require("./routes/review.js");

const session = require("express-session");
const flash = require("connect-flash");
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
    console.log("Success")
})
.catch((err) => {
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderList");
}

app.get("/", (req, res) => {
    res.redirect("/");
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", Routers);
app.use("/listings/:id/reviews", Reviews);

app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found!!")
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went Wrong"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err});
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
