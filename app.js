require("dotenv").config();

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const ejsMate = require("ejs-mate");
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
const googleUsers = require("./routes/googleUser.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { Console } = require("console");
const dbUrl = process.env.ATLASDB_URL;

let GoogleStrategy = require("passport-google-oauth20").Strategy;

main()
  .then(() => {
    console.log("Databse was connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//     res.send("Working Baby!");
// })

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
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
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      //console.log(profile);
      let user = await User.findOne({ googleId: profile.id });
      try {
        if (!user) {
          user =
            (await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails?.[0]?.value || null,
              profilePic: profile.photos[0].value,
              profilenName: profile.name.givenName,
            })) || null;
        }

        console.log(user);
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err, user);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouters);
app.use("/listings/:id/reviews", reviewRouters);
app.use("/", userRouters);
app.use("/auth/google", googleUsers);

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
