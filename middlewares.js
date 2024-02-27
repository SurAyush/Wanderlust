const Listing = require("./models/listing");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in for this operation");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    li = await Listing.findById(req.params.id);
    if(!(res.locals.currUser && res.locals.currUser._id.equals(li.owner[0]))){
        req.flash("error","You are not the listing owner");
        return res.redirect("/listings");
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {rid,id} = req.params;
    li = await Review.findById(rid);
    // console.log(res.locals.currUser._id);
    // console.log("owner",li.author[0]);
    if(!(res.locals.currUser && res.locals.currUser._id.equals(li.author))){
        req.flash("error","You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}