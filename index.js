const express  = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const sessionOptions = {
    secret: "mysupseccode123",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + (1000*60*24*7),
        maxAge: Date.now() + (1000*60*24*7),
        httpOnly: true
    }
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true}));
app.engine("ejs",ejsmate);
app.use(methodOverride("_method"));

const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(mongo_url);
}

main().then(()=>{
    console.log("Accessing Database");
}).catch((err)=>{
    console.log(err);
});

app.use(session(sessionOptions));
app.use(flash());

// using passport package to authenticate
// use passport middlewares after session only (passport needs express sessions to keep track)

app.use(passport.initialize());   //to initialize passport before every call
app.use(passport.session());    //to keep track of the session, if user is logged in, we don't ask to re-login in the same session

passport.use(new LocalStrategy(user.authenticate()));   //for authentication of users via passport-local

passport.serializeUser(user.serializeUser());       //to store info related to the user in the session
passport.deserializeUser(user.deserializeUser());   //to remove info related to the user in the session

//saving flash message in res.locals
app.use((req,res,next)=>{
    res.locals.sucmsg = req.flash("success");
    res.locals.errmsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// demo user route (for testing purposes)
// app.get("/demouser",async (req,res)=>{
//     let u1 = new user({
//         email: "abc@hotmail.com",
//         username: "abc"
//     });     //we don't add password here

//     let registeredUser = await user.register(u1,"hello123");        //hello123 is the password
//     res.send(registeredUser);
// });



//requiring routes
const listroute = require("./routes/listings.js");
const reviewroute = require("./routes/reviews.js");
const userroute = require("./routes/users.js");

app.listen(port,()=>{
    console.log("Listening to port "+port);
});

app.get("/",(req,res)=>{
    res.send("Root working fine");
});

app.use("/listings",listroute);
app.use("/listings/:id/reviews",reviewroute);
app.use("/",userroute);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    let el = {status: status, message: message};
    res.status(status).render("listing/error.ejs",{el});
    next(err);
});