const Listing = require("../models/listing.js");

// const mapToken = process.env.MAP_TOKEN;
// console.log(mapToken);

//console.log(process.env.MAP_TOKEN);


async function getCoordinates(address) {
    try {
        const response = await fetch(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${process.env.MAP_TOKEN}`
        );
        const data = await response.json();

        if (data.features.length === 0) {
            throw new Error("Location not found!");
        }

        return data.features[0].geometry; // [longitude, latitude]
    } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
    }
}

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
    
    if(req.files){
        // const url = req.file.path;
        // const filename = req.file.filename;
        newListing.image = req.files.map(file => ({
            filename: file.filename,
            url: file.path
        }));    
    }
    else{
        const url = "https://media.audleytravel.com/-/media/images/home/europe/uk/overview-letterboxes/istock_509915554_uk_antrim_coast_3000x1000.jpg?q=79&w=1920&h=685";
        const filename = "listingImg";
        newListing.image = {filename, url};
    }

    try {
        const address = newListing.location; // Form से लिया गया Address
        const geometry = await getCoordinates(address);

        if (!geometry) {
            req.flash("error", "Invalid address! Please enter a valid location.");
            return res.redirect("/listings/new");
        }

        //const [longitude, latitude] = coordinates;
        //console.log(longitude, "....", latitude);
        newListing.geometry=geometry;

    } catch (err) {
        console.error(err);
        req.flash("error", "Geocoding failed!");
        res.redirect("/listings/new");
    }

    const updatedListing = await newListing.save();
    console.log(updatedListing);
    req.flash("success", "New Listing Created!");
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

    if(req.files && req.files.length>0){
        // let {path, filename} = req.file;
        // listing.image.url = path;
        // listing.image.filename = filename;
        listing.image = req.files.map(file => ({
            filename: file.filename,
            url: file.path
        }));
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