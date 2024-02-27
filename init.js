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
  owner = "65dde8af6fa01cf8a76268f2";
  initData.data = initData.data.map((obj)=> ({...obj,owner: owner})); 
  //de-structing obj and adding one more key value pair to it
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB(); 