var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var expressValidator = require('express-validator');

router.get('/', function(req, res, next) {
  res.send('respond with a response');
});

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:"Login"});
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if(req.file) {
    console.log("uploading file");
    var profileImage = req.file.filename;
  } else{
    console.log("No File Uploaded");
    var profileImage = 'noimage.png'
  }

  req.checkBody('name','Name Field is required').notEmpty();

  //Check Errors
  var errors = req.validationErrors();

  if(errors){
    console.log('Errors');
  }else{
    console.log("No Errors");
  }
});

module.exports = router;
