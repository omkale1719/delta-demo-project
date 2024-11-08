const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingcontroler=require("../controler/user.js");

// Render signup form
router
.route("/signup")
.get(listingcontroler.signup)
.post( listingcontroler.signupfunctinality);// Handle signup form submission



router
.route("/login")
.get( listingcontroler.renderloginform)
.post(saveRedirectUrl, 
    passport.authenticate("local",{failureRedirect:"/login", failureFlash:false,}),
    listingcontroler.loginfunctionality);


router.get("/logout",listingcontroler.logout);

module.exports = router;
