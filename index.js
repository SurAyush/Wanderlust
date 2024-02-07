const express  = require("express");
const app = express();
const port = 8080;
const Listing = require("./models/listing");
const Review = require("./models/reviews");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const asyncWrap = require("./utils/asyncWrap");
const ExpressError = require("./utils/ExpressError");

const {listingSchema, reviewSchema} = require("./schema");  
//validation of schema

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true}));

app.engine("ejs",ejsmate);

app.use(methodOverride("_method"));



app.listen(port,()=>{
    console.log("Listening to port "+port);
});

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


app.get("/",(req,res)=>{
    res.send("Root working fine");
});
app.get("/listings",(req,res)=>{
    Listing.find({}).then((response)=>{
        res.render("listing/listindex.ejs",{dt: response});
    }).catch((err)=>{
        console.log(err); 
    });
});

app.get("/listings/new",(req,res)=>{
    res.render("listing/newlist.ejs");
});

app.get("/listings/:id",async(req,res,next)=>{
    let {id} = req.params;
    try{
        let obj = await Listing.findById(id).populate("reviews");
        res.render("listing/listbyid.ejs",{el: obj});
    }
    catch(err){
        next(new ExpressError(404,"INCORRECT ID"));
    }
});

app.post("/listings",asyncWrap(async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    else{
        let li = new Listing(req.body.listings);
        await li.save();
        res.redirect("/listings");
    }
}));

//reviews
//Post Route
app.post("/listings/:id/review",asyncWrap(async(req,res,next)=>{
    let id = req.params.id;
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    else{
        let li = await Listing.findById(id);
        let newReview = new Review(req.body.review);
        li.reviews.push(newReview);
        await newReview.save();
        await li.save();
        console.log("New Review Saved");
        res.redirect(`/listings/${id}`);
    }
}));

app.get("/listings/:id/edit",asyncWrap(async (req,res)=>{
    let el = await Listing.findById(req.params.id);
    res.render("listing/edit.ejs",{el});
}));

app.put("/listings/:id",asyncWrap(async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    else{
        let id = req.params.id;
        console.log(req.body);
        await Listing.findOneAndUpdate({_id: id},req.body.listings,{runValidators: true});
        res.redirect(`/listings/${id}`);
    }
}));

//delete review route
app.delete("/listings/:id/reviews/:rid",asyncWrap(async(req,res,next)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",asyncWrap(async (req,res)=>{
    let id = req.params.id;
    let rev = await Listing.findById(id);
    for (el of rev.reviews){
        await Review.findByIdAndDelete(el);
    }
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings"); 
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    let el = {status: status, message: message};
    res.status(status).render("listing/error.ejs",{el});
    next(err);
});