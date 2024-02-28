const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema"); 
const Listing = require("../models/listing");


module.exports.addReview = async(req,res,next)=>{
    let id = req.params.id;
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    else{
        let li = await Listing.findById(id);
        let newReview = new Review(req.body.review);
        newReview.author = res.locals.currUser._id;
        console.log(newReview);
        li.reviews.push(newReview);
        await newReview.save();
        await li.save();
        console.log("New Review Saved");
        req.flash("success","New Review Created");
        res.redirect(`/listings/${id}`);
    }
};

module.exports.deleteReview = async(req,res,next)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};