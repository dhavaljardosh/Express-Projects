var express = require('express');
var router = express.Router();
var app = express();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var User = require('../model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var util = require('util');

var expressValidator = require('express-validator');
router.use(expressValidator())

router.get('/', function(req, res, next) {
  res.send('respond with a response');
});

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: "Login"});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, function(err, user) {
    if (err)
      throw err;
    if (!user) {
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  })
}))

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  console.log("Started LODA");
  console.log(util.inspect(req));
  // console.log(email + "   "+req.body.email);
  // console.log(username + "   "+req.body.username);
  // console.log(password + "   "+req.body.password);
  // console.log(password2 + "   "+req.body.password2);

  console.log("Completed Loda");

  if (req.files[0]) {
    console.log("uploading file");
    var profileImage = req.files[0].filename;
    console.log("Here is the filename " + profileImage);
  } else {
    console.log("No File Uploaded");
    var profileImage = 'noimage.png'
  }

  req.checkBody('name', 'Name Field is required').notEmpty();
  req.checkBody('email', 'Email required').notEmpty();
  req.checkBody('email', 'email Field is required').isEmail();
  req.checkBody('username', 'username Field is required').notEmpty();
  req.checkBody('password', 'password Field is required').notEmpty();
  req.checkBody('password2', 'Password Not matching').equals(req.body.password);

  //Check Errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {errors: errors})
    console.log(util.inspect(errors));
  } else {

    console.log("No ERRORS");

    var newUser = new User({name: name, email: email, username: username, password: password, profileimage: profileImage});

    User.createUser(newUser, function(err, user) {
      if (err) {
        throw err;
      }
      console.log(user);
    });

    req.flash('success', "You're Registered and can Login");

    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success','Logout Success 😀');
  res.redirect('/users/login');
})

module.exports = router;
