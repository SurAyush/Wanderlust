const express  = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const {isLoggedIn, isOwner} = require("../middlewares");
const listingController = require("../controller/listing");

//Index Route
//Create Route
router
.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,asyncWrap(listingController.createListing));

//New Listing Route
router.get("/new",isLoggedIn,listingController.renderNewListing);

//Show Route
//Delete Route
//Update Route
router
.route("/:id")
.get(asyncWrap(listingController.showListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing))
.put(isLoggedIn,isOwner,asyncWrap(listingController.updateListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.renderEditListing));

module.exports = router;
