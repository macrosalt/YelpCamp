var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Get all the methods we need to use during authentication
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);