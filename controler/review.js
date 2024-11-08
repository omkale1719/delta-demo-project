const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createreview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.Review);

    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();

    let allListings = await Listing.find({});
    res.render("Listing/index.ejs", { allListings });
}