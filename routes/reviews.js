const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to `:id`
const Review = require('../models/reviews'); 
const Listing = require("../models/listing.js");
const listingcontroler=require("../controler/review.js");

router.post("/",listingcontroler.createreview );

module.exports = router;
