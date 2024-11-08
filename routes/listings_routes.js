
const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js");
const { isLoggedin, isowner } = require("../middleware.js");
const listingcontroler = require("../controler/listing.js");
const multer = require(`multer`);
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


// Define all routes for `/New` in a single route chain
router.route("/new")
.get( isLoggedin, listingcontroler.rendernewform)
 .post( 
        upload.single(`listing[image]`),
        listingcontroler.newform,
    );




// Define all routes for `/:id` in a single route chain
router
    .route("/:id")
    .put( upload.single(`listing[image]`),
    isLoggedin,
     isowner, 
     listingcontroler.update
    ) // Update route
    .get(listingcontroler.
        showdetail) // Show detail route
    .delete(isLoggedin, 
        isowner, 
        listingcontroler.delete
    ); // Delete route

// Index route
router.get("/", listingcontroler.index);

// Render update route form
router.get("/:id/edit", isLoggedin, isowner, listingcontroler.renderupdateform);

module.exports = router;
