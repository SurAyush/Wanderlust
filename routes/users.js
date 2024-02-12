const express  = require("express");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        let u1 = new user({
            email: email,
            username: username
        });
        await user.register(u1,password);
        req.flash("success","User registered successfully");
        res.redirect("/listings");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
});

//passport.autheticate is a middleware autheticator that autheticates the user
router.post("/login",passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),async(req,res)=>{
    let {username} = req.body;
    req.flash("success",`Welcome back ${username}!`);
    res.redirect("/listings");
});


module.exports = router;