const express  = require("express");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err)
            return next(err);
        req.flash("success","You have successfully logged out");
        res.redirect("/listings");
    });
});

router.post("/signup",async(req,res,next)=>{
    try{
        let {username, email, password} = req.body;
        let u1 = new user({
            email: email,
            username: username
        });
        const registeredUser = await user.register(u1,password);
        req.login(registeredUser,(err)=>{
            if(err)
                return next(err);
            req.flash("success","User registered successfully");
            res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
});

//passport.autheticate is a middleware autheticator that autheticates the user
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),async(req,res)=>{
    let {username} = req.body;
    req.flash("success",`Welcome back ${username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});



module.exports = router;