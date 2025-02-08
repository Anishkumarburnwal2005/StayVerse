const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
}; 

module.exports.renderShowForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.create = async(req, res) => {
   
    //console.log(url, "...", filename);
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if(req.file){
        const url = req.file.path;
        const filename = req.file.filename;
        newListing.image = {filename, url};
        //console.log(newListing);
    }else{
        const url = "https://media.audleytravel.com/-/media/images/home/europe/uk/overview-letterboxes/istock_509915554_uk_antrim_coast_3000x1000.jpg?q=79&w=1920&h=685";
        const filename = "listingImg";
        newListing.image = {filename, url};
    }
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
    res.render("listings/edit.ejs", {listing});
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    //console.log(path, "...", filename);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

    if(typeof req.file !== "undefined"){
        let {path, filename} = req.file;
        listing.image.url = path;
        listing.image.filename = filename;
        await listing.save();
    }
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
    
    
    