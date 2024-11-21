const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() => {
    console.log("Success")
})
.catch((err) => {
    console.log(err)
})

 async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderList");
}


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();