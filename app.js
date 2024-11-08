if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// मॉड्यूल्स आणि रूट्स इम्पोर्ट करा
const list = require("./routes/listings_routes.js");
const review_routes = require("./routes/reviews.js");
const user_route = require("./routes/user.js");
const User = require("./models/user.js");

// सेटअप
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

// MongoDB कनेक्शन
const dbUrl = process.env.AtlasDb_Url;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

// सेशन आणि कूकी सेटअप
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECREAT,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in MongoDB session store:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECREAT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// पासपोर्ट सेटअप
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// फ्लॅश आणि युजर इन्फो सेटअप
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.curruser = req.user;
    next();
});

// रूट्स सेटअप
app.use("/", list); // मुख्य रूटसाठी लिस्टिंग रूट वापरा
app.use("/listings/:id/reviews", review_routes);
app.use("/", user_route);

// सर्वात शेवटी सर्व्हर चालवा
app.listen(3003, () => {
    console.log("Server started on port 3003");
});
