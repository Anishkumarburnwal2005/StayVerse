const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  username: {
    type: String,
  },

  profilenName: {
    type: String,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  profilePic: {
    type: String,
    default:
      "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
  },

  about: {
    type: String,
  },

  gender: {
    type: String,
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
