const express  = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true}));
app.engine("ejs",ejsmate);
app.use(methodOverride("_method"));

const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(mongo_url);
}

main().then(()=>{
    console.log("Accessing Database");
}).catch((err)=>{
    console.log(err);
});

//requiring routes
const listroute = require("./routes/listings.js");
const reviewroute = require("./routes/reviews.js");

app.listen(port,()=>{
    console.log("Listening to port "+port);
});

app.get("/",(req,res)=>{
    res.send("Root working fine");
});

app.use("/listings",listroute);
app.use("/listings/:id/reviews",reviewroute);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    let el = {status: status, message: message};
    res.status(status).render("listing/error.ejs",{el});
    next(err);
});