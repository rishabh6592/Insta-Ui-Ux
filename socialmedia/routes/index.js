var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require("../config/multer");
const flash  = require("connect-flash");
const fs = require("fs");

passport.use(new localStrategy(userModel.authenticate()));




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
//new user register
router.get('/register', function(req, res, next) {
  res.render('index');
});
// profile route
router.get("/profile",IsLoggedln, async (req,res)=>{
  let user = await userModel.findOne({username: req.session.passport.user});
  res.render("profile",{user})
})
//
// login error middleware
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size is too large. Maximum limit is 1MB.' });
  }
  if (err.code === 'FILE_TYPE') {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG and PNG are allowed.' });
  }
  return res.status(500).json({ error: err.message });
});
//login route of passport

router.get('/login', function(req, res, next) {
  // console.log(req.flash('error'))
  res.render('login',{error:req.flash('error')});
});



//profile img upload route

router.post("/upload",IsLoggedln,upload.single('picture'), async(req,res)=>{
 let user = await userModel.findOne({username:req.session.passport.user})
 
 user.picture = req.file.filename

 
 await user.save();
 res.redirect("/profile")
})

//likes route
router.get("/like/:id",IsLoggedln,async(req,res,next)=>{
  let user = await userModel.findOne({_id: req.params.id})
  if(user.likes.indexOf(req.session.passport.user) === -1){
    user.likes.push(req.session.passport.user)
    await user.save();
    res.redirect("/profile");
  }
  else{
res.send("nho hoga kya kar lega")
  }
})


// user register ke liye
router.post("/register",(req,res,next)=>{
  const newUser = new userModel({
    username:req.body.username,
    email:req.body.email,
    picture:req.body.picture
  })
  userModel.register(newUser,req.body.password)
  .then((user)=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/profile")
    })
  })
  .catch((jo)=>{
    res.send(jo);
  })
});

// user login ke liye
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),(req,res,next)=>{});

//user Logout ke liye
router.get("/logout",(req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//for Middleware of IsLoggedln
function IsLoggedln(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/")
  }
}


module.exports = router;
