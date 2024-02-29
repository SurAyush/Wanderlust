if (process.env.NODE_ENV != "production"){      //if code is not at production stage
    require('dotenv').config();
}


const express  = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const {isLoggedIn, isOwner} = require("../middlewares");
const listingController = require("../controller/listing");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});

//Index Route
//Create Route
router
.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,upload.single("listings[image]"),asyncWrap(listingController.createListing));

//New Listing Route
router.get("/new",isLoggedIn,listingController.renderNewListing);

//Show Route
//Delete Route
//Update Route
router
.route("/:id")
.get(asyncWrap(listingController.showListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing))
.put(isLoggedIn,isOwner,upload.single("listings[image]"),asyncWrap(listingController.updateListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.renderEditListing));

module.exports = router;
