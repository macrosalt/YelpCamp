var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//the same as require("../middleware/index")
var middleware = require("../middleware");

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
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, image:image, description:description, author:author};
    // push the newly created item to DB 
    Campground.create(newCampground,function(err,newlycreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    }
        );
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
router.put("/:id",middleware.checkUserOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
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