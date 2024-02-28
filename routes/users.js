const express  = require("express");
const router = express.Router();
const passport = require("passport");
const asyncWrap = require("../utils/asyncWrap");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controller/user.js");

//signup page
router.get("/signup",userController.renderSignup);

//login page
router.get("/login",userController.renderLogin);

//logout user
router.get("/logout",userController.logoutUser);

//sign up user
router.post("/signup",asyncWrap(userController.signupUser));

//passport.autheticate is a middleware autheticator that autheticates the user
//login in user
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),asyncWrap(userController.loginUser));



module.exports = router;