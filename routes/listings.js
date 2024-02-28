const express  = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const {isLoggedIn, isOwner} = require("../middlewares");
const listingController = require("../controller/listing");

//Index Route
router.get("/",asyncWrap(listingController.index));

//New Listing Route
router.get("/new",isLoggedIn,listingController.renderNewListing);

//Show Route
router.get("/:id",asyncWrap(listingController.showListing));

//Create Route
router.post("/",isLoggedIn,asyncWrap(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.renderEditListing));

//Update Route
router.put("/:id",isLoggedIn,isOwner,asyncWrap(listingController.updateListing));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,asyncWrap(listingController.destroyListing));

module.exports = router;
