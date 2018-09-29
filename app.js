var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comments"),
    bodyParser = require("body-parser"),
    flash      = require("connect-flash"),
    User        =require("./models/user"), 
    seedDB     = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

//hide the db of server, set environment variables
//when you use local db, it's fine to just explicitly to claim it
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect(process.env.DATABASEURL);


//seedDB();

//add css folder to the search route
app.use(express.static(__dirname + "/public"));

//use body-parser library to manipulate properties of req.body
app.use(bodyParser.urlencoded({extended: true}));

//set template partials filetype to dry the code
app.set("view engine","ejs");

//use connect-flash to make flashing message
//should locate in front of passport
app.use(flash()); 

//passport configuration
app.use(require("express-session")({
    secret: "This is the secret!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//update campgrounds needs method-override
app.use(methodOverride("_method"));

//referred method comes from passport-local
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware defined should contain next() to
//let following functions to handle different routes
app.use(function(req,res,next){
    //apply the login status to every page to change the navbar style
    res.locals.currentUser = req.user;
    //apply connect-flash message to every page
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The Yelpcamp is running!"); 
});