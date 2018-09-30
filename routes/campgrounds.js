var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//the same as require("../middleware/index")
var middleware = require("../middleware");
//add geocoder to support googlemap
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/",function(req,res){
        // retrieve data from DB
        Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            //express set its webpage prefix as "/views/"
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

//login before save the campground
//add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  //retrive map info
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//login before add a new campground
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//to avoid interfere with "/new", must be added afterwards
router.get("/:id",function(req,res){
    //in the campground, comments is object, use populate() to extract info
    //still, campground has orginal attributes, name, image, description
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground:foundCamp});
        }
    });
});

router.get("/:id/edit",middleware.checkUserOwnership,function(req, res) {
            Campground.findById(req.params.id,function(err,foundCamp){
                    res.render("campgrounds/edit",{campground:foundCamp});
    });
});

//update the specific campground in DB
router.put("/:id", middleware.checkUserOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//destroy campground route
router.delete("/:id",middleware.checkUserOwnership,function (req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});





module.exports = router;