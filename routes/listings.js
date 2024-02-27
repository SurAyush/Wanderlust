const express  = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema"); 
const {isLoggedIn, isOwner} = require("../middlewares");

//get collection of all listing page
router.get("/",(req,res)=>{
    Listing.find({}).then((response)=>{
        res.render("listing/listindex.ejs",{dt: response});
    }).catch((err)=>{
        console.log(err); 
    });
});

//get new listing page
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listing/newlist.ejs");
});

//get listing specific page
router.get("/:id",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let obj = await Listing.findById(id).populate("reviews");
    let own = await User.findById(obj.owner);
    if(!obj){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listing/listbyid.ejs",{el: obj,own: own});
}));

//posting new listing
router.post("/",isLoggedIn,asyncWrap(async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    else{
        let li = new Listing(req.body.listings);
        li.owner = req.user._id;
        await li.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    }
}));

//get edit page route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
    let el = await Listing.findById(req.params.id);
    if(!el){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{el});
}));

//edit the listing route
router.put("/:id",isLoggedIn,isOwner,asyncWrap(async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    else{
        let id = req.params.id;
        console.log(req.body);
        await Listing.findOneAndUpdate({_id: id},req.body.listings,{runValidators: true});
        req.flash("success","Listing Edited");
        res.redirect(`/listings/${id}`);
    }
}));


//delete the listing route
router.delete("/:id",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
    let id = req.params.id;
    let rev = await Listing.findById(id);
    for (el of rev.reviews){
        await Review.findByIdAndDelete(el);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings"); 
}));

module.exports = router;
