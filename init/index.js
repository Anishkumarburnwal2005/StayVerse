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
    initData.data = initData.data.map((obj) => ({...obj, owner: "674722f1a84a2107d7d8f7e3"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();