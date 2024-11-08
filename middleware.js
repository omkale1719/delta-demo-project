const Listing = require("./models/listing.js");

module.exports.isLoggedin=(req,res,next)=>{
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("success","you must be login ");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
}
next();
};

module.exports.isowner = async (req, res, next) => {
    let { _id } = req.params;
    let listing = await Listing.findById(_id);
    
    // Check if the current user is the owner
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("success", "You don't have permission to do that.");
        return res.redirect(`/${_id}`);
    }

    // If the user is the owner, proceed to the next middleware or route handler
    next();
};
