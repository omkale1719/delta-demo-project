const User = require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.signup= (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupfunctinality =async (req, res) => {
    try {
        let { username, email, password } = req.body;

        // Create a new user object
        const newUser = new User({ email, username });

        // Register the new user with a password
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }

              // Flash success message and redirect to listing
        req.flash("success", "Welcome to Wenderlust");
        res.redirect("/listing");
        });
        
    } catch (e) {
        // Check for specific errors, such as user already existing
        if (e.name === "UserExistsError") {
            req.flash("success", "User already exists");
        } else {
            req.flash("success", "Something went wrong, please try again");
        }

        // Re-render the signup page if an error occurs
        res.render("users/signup.ejs");
    }
}


module.exports.renderloginform=(req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginfunctionality=async (req,res)=>{
    req.flash("success","welcome back to wenderlust !");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logout successfully");
        res.redirect("/listing");
    });
}