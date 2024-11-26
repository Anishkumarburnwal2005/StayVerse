const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let lists = await Listing.find({});
    res.render("listings/index.ejs", { lists });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
}; 

module.exports.renderShowForm = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!data){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { data });
}

module.exports.create = async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for edit does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findByIdAndDelete(id);
    console.log(result);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};



    
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
    
    
    