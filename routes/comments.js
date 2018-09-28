var express = require("express");
//since route prefix has been extracted to deal with beforehand
//we should use mergeParams to get the missing ID which we need to use
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
//the same as require("../middleware/index")
var middleware = require("../middleware");

//======
//comment routes
//======
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundcamp){
        if(err)
        {
            console.log(err);
        }else{
            res.render("comments/new",{campground:foundcamp});
        }
    });
    
});

//check the login state to protect the url
router.post("/",middleware.isLoggedIn,function(req,res){
    //find the campground, create new comment, link it with campground
    //and then redirect to show the whole campground
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong...");
                    console.log(err);
                }else{
                    //add user's info to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    req.flash("success","New comment added!");
                    res.redirect("/campgrounds/"+foundCamp._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            //here req.params.id refers to the campground id part of url
            //which is extracted as the prefix in app.js
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }
    });
    
});

//comment update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//comment destroy
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
        
    });
});


module.exports = router;