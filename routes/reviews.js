const express  = require("express");
const router = express.Router({ mergeParams: true});
const asyncWrap = require("../utils/asyncWrap");
const { isLoggedIn, isAuthor } = require("../middlewares");
const reviewController = require("../controller/review");

//Add Reveiw
router.post("/",isLoggedIn,asyncWrap(reviewController.addReview));



//Delete Review
router.delete("/:rid",isLoggedIn,isAuthor,asyncWrap(reviewController.deleteReview));

module.exports = router;
