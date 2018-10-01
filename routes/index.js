var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

//REST
//home page
router.get("/",function(req,res){
    res.render("landing");
});

//================
//Authentication routes
//================
// show the register form
router.get("/register",function(req,res){
    res.render("register");
});

// add register info to db
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    //user.register() is imported from passport-local-mongoose
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            //err comes from passport, string about error message
            return res.render("register",{"error":err.message});
        }
        //log in newly signed up account
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp! " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",function(req,res){
    res.render("login");
});


//log out logic
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","You have logged out!");
    res.redirect("/campgrounds");
})

//deal with login logic
//app.post("/route",middleware,callback);
//methods from passport-local
//retrieve info about req.body.username, req.body.password
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back to YelpCamp!"
}),function(req,res){
});



module.exports = router;