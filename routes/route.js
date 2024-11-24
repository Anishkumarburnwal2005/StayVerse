const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Joi = require("joi");
const { listingSchema} = require("../schema.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Index Route
router.get("/", async (req, res) => {
    let lists = await Listing.find({});
    res.render("listings/index.ejs", { lists });
});

// Show Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    if(!data){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { data });
});

// Create Route
router.post("/post", validateListing, wrapAsync(async (req, res, next) => {
    
    //     let {title, description, price, location, country, image} = req.body;
    //     let newListing = new Listing({
    //         title: title,
    //         price: price,
    //         image:image,
    //         description: description,
    //         location: location,
    //         country: country
    //     })
    
    //     newListing.save()
    //     .then(() => {
    //         console.log("Data was saved")
    //     })
    
    //     let newListing = req.body.listing;
    //     console.log(newListing)
    
    
    //     if(!req.body.listing){
    //         throw new ExpressError(400, "Send valid data for listing!!")
    //     }
    //     if(!req.body.title){
    //         throw new ExpressError(400, "Title was missing!!")
    //     }
    //     if(!req.body.listing){
    //         throw new ExpressError(400, "description was missing!!")
    //     }
    //     if(!req.body.Location){
    //         throw new ExpressError(400, "Location was missing!!")
    //     } //ETC
        
    //     let result = listingSchema.validate(req.body);
    //     console.log(result);
    //     if(result.error) {
    //         throw new ExpressError(400, result.error);
    //     }
    
    
    
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for edit does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect("/listings");
}));

// Delete Route
router.delete("/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findByIdAndDelete(id);
    console.log(result);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = router;