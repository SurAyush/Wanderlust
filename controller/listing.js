const Listing = require("../models/listing");
const Review = require("../models/reviews");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema"); 
const {cloudinary} = require("../cloudConfig");



module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/listindex.ejs",{dt: allListing});
};

module.exports.renderNewListing = (req,res)=>{
    res.render("listing/newlist.ejs");
};

module.exports.showListing = async(req,res,next)=>{
    let {id} = req.params;
    let obj = await Listing.findById(id).populate("reviews");
    let own = await User.findById(obj.owner);
    if(!obj){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listing/listbyid.ejs",{el: obj,own: own});
};

module.exports.createListing = async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    else{
        let url = req.file.path;
        let filename = req.file.filename;
        let li = new Listing(req.body.listings);
        li.owner = req.user._id;
        li.image = {url,filename};
        await li.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    }
};

module.exports.renderEditListing = async (req,res)=>{
    let el = await Listing.findById(req.params.id);
    if(!el){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{el});
};

module.exports.updateListing = async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    else{
        let id = req.params.id;
        console.log(req.body);
        let li = await Listing.findOneAndUpdate({_id: id},req.body.listings,{runValidators: true});
        if(typeof req.file != "undefined"){
            let prevImg = li.image.url.slice(62,-4);
            await cloudinary.uploader.destroy(prevImg,(err,res)=>{
                console.log(err,res);
            });
            let url = req.file.path;
            let filename = req.file.filename;
            li.image = {url,filename};
            await li.save();
        }
        req.flash("success","Listing Edited");
        res.redirect(`/listings/${id}`);
    }
};

module.exports.destroyListing = async (req,res)=>{
    let id = req.params.id;
    let rev = await Listing.findById(id);
    let imgUrl = rev.image.url;
    let img = imgUrl.slice(62,-4);
    await cloudinary.uploader.destroy(img,(err,res)=>{
        console.log(err,res);
    });
    for (el of rev.reviews){
        await Review.findByIdAndDelete(el);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings"); 
};