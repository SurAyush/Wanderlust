const express  = require("express");
const router = express.Router({ mergeParams: true});
const Review = require("../models/reviews");
const asyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema"); 
const Listing = require("../models/listing");

//reviews
//Post Route
router.post("/",asyncWrap(async(req,res,next)=>{
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



//delete review route
router.delete("/:rid",asyncWrap(async(req,res,next)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
