const user = require("../models/user.js");
const passport = require("passport");

module.exports.renderSignup = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.renderLogin = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err)
            return next(err);
        req.flash("success","You have successfully logged out");
        res.redirect("/listings");
    });
};

module.exports.signupUser = async(req,res,next)=>{
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
};

module.exports.loginUser = async(req,res)=>{
    let {username} = req.body;
    req.flash("success",`Welcome back ${username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};