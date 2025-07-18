const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: [
    {
      filename: {
        type: String,
        default: "default.img",
      },

      url: {
        type: String,
        default:
          "https://media.istockphoto.com/id/472899538/photo/downtown-cleveland-hotel-entrance-and-waiting-taxi-cab.webp?s=1024x1024&w=is&k=20&c=ryknwrnjVy-mkmHvN-6lG2my5hbpDn2h3AHa76_BX28=",
      },
    },
  ],

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: [`Point`],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Hotels",
      "Iconic cities",
      "Forest Retreats",
      "Lakefront",
      "Jungle Lodges",
      "Desert Stays",
      "Mountain",
      "Island",
      "Cabins",
      "Igloo",
      "Beach",
      "Farms",
      "Snow",
    ],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
