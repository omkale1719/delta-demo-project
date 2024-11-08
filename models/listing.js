const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title: {
        type: String,
        required: true,  // Ensures title is required
        trim: true       // Removes whitespace from both sides of the string
    },
    description: {
        type: String,
        required: true,  // Ensures description is required
        trim: true
    },
    image: {
        url:String,
        filename:String,

      },
    // image: {
    //     filename: { type: String }, // Store the filename
    //     url: { type: String } // Store the actual URL
    // },
    price: {
        type: Number,
        required: true,  // Ensures price is required
        min: [0, 'Price cannot be negative'],  // Validates price is a positive number
    },
    location: {
        type: String,
        required: true,  // Ensures location is required
        trim: true
    },
    country: {
        type: String,
        required: true,  // Ensures country is required
        trim: true
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"reviews"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
