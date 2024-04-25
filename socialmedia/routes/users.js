const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/socialmedia');

const userSchema = mongoose.Schema({
  email:String,
  username:String,
  password:String,
  picture:String,
  likes:{
    type:Array,
    default:[]
  }
    
  
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema)