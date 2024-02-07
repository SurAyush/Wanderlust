const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(mongo_url);
};
main().then(()=>{
  console.log("Accessing Database");
}).catch((err)=>{
  console.log(err);
});
const Listing = require("./models/listing");
const initData = require("./data.js");

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB(); 