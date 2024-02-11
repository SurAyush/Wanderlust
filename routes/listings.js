const express  = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const asyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema"); 

router.get("/",(req,res)=>{
    Listing.find({}).then((response)=>{
        res.render("listing/listindex.ejs",{dt: response});
    }).catch((err)=>{
        console.log(err); 
    });
});

router.get("/new",(req,res)=>{
    res.render("listing/newlist.ejs");
});

router.get("/:id",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let obj = await Listing.findById(id).populate("reviews");
    if(!obj){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listing/listbyid.ejs",{el: obj});
}));

router.post("/",asyncWrap(async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    else{
        let li = new Listing(req.body.listings);
        await li.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    }
}));

router.get("/:id/edit",asyncWrap(async (req,res)=>{
    let el = await Listing.findById(req.params.id);
    if(!el){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{el});
}));

router.put("/:id",asyncWrap(async (req,res,next)=>{
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

router.delete("/:id",asyncWrap(async (req,res)=>{
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
