// all the middlewares are here
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middlewareObj = {};

middlewareObj.checkUserOwnership = function(req,res,next){
    //check if user log in
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(err,foundCamp){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                //check if user is the author
                //campground.author.id is a mongoose object. we need to use mongoose method to compare
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have the permission to do that!");
                    res.redirect("back");
                }
                
            }
        });
    } else{
        req.flash("error","You need to log in first!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership=function(req,res,next){
    //check if user log in
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Something went wrong...");
                res.redirect("back");
            }else{
                //check if user is the author
                //comment.author.id is a mongoose object. we need to use mongoose method to compare
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have the permission to do that!");
                    res.redirect("back");
                }
                
            }
        });
    } else{
        req.flash("error","You need to log in first!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req,res,next){
    //define a middleware to do the logic of checking the login state
    if(req.isAuthenticated()){
        return next();
    }
    //one-time message related with the key
    req.flash("error","You need to log in first!");
    res.redirect("/login");
};

module.exports = middlewareObj;