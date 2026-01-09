const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.ownListings = async (req, res) => {
  let { id } = req.params;

  const allListings = await Listing.find({ owner: id });
  if (allListings && allListings.length <= 0) {
    req.flash("error", "No Listing is created yet!!");
    res.redirect(`/auth/google/info/${id}`);
  }
  res.render("Users/userListings.ejs", { allListings });
};

module.exports.userData = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  //console.log(user);
  res.render("Users/info.ejs", { user });
};

module.exports.authenticated = function (req, res) {
  req.flash("success", "Welcome back to StayVerse!");
  return res.redirect("/listings/index"); // Authentication successful
};
