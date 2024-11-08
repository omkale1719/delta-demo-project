const { model } = require("mongoose");
const Listing = require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
   res.render("Listing/index.ejs",{allListings});
}

module.exports.rendernewform=(req,res)=>{
    res.render("new.ejs"); }

    module.exports.newform = async (req, res, next) => {
        
        if (!req.file) {
            req.flash("success", "File upload failed. Please try again.");
            return res.redirect("/new");
        }

        let url=req.file.path;
        let filename=req.file.filename;
        console.log(url, "...", filename);
        try {
            if (!req.body.listing) {
                throw new Error("Send valid data for listing");
            }
            const newlisting = new Listing(req.body.listing);
            newlisting.owner = req.user._id;
            newlisting.image={url,filename};
            await newlisting.save();
            req.flash("success", "नवीन लिस्टिंग तयार केले आहे!");
            res.redirect("/");
        } catch (error) {
            next(error); // एरर हँडलिंग मिडलवेअरकडे एरर पास करा
        }
    };
    

 module.exports.renderupdateform=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    req.flash("success","the info is edited!");
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250");
    res.render("Listing/edit.ejs",{listing,originalimageurl});
}

module.exports.update=async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
        }
    req.flash("success","Edited succesfully!");
res.redirect(`/${id}`);
// res.send("scucess");
}

module.exports.showdetail=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("Listing/show.ejs",{listing});
}

module.exports.delete=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","info is deleted!");
    res.redirect("/");
}