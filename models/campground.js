var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   price: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         //make data related, embed reference of comments
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);