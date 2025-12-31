const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.ownListings = async (req, res) => {
  let { id } = req.params;

  const allListings = await Listing.find({ owner: id });
  //console.log(allListings);
  res.render("Users/userListings.ejs", { allListings });
};

module.exports.userData = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  //console.log(user);
  res.render("Users/info.ejs", { user });
};

module.exports.authenticated = function (req, res) {
  return res.redirect("/listings/index"); // Authentication successful
};
