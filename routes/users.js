const express  = require("express");
const router = express.Router();
const passport = require("passport");
const asyncWrap = require("../utils/asyncWrap");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controller/user.js");

//signup page
//sign up user
router
.route("/signup")
.get(userController.renderSignup)
.post(asyncWrap(userController.signupUser));


//login page
//login in user
//passport.autheticate is a middleware autheticator that autheticates the user
router
.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),asyncWrap(userController.loginUser));


//logout user
router.get("/logout",userController.logoutUser);


module.exports = router;