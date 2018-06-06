var express = require("express");
var path = require("path");
// var bodyParser =  require("body-parser");
// var nodemailer = require("nodemailer");

var app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res) => {
  console.log(path);
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/logs.html',(req,res) => {
  console.log(path);
  res.sendFile(__dirname + '/views/logs.html');
})

app.listen(2000, () => console.log("Loda Loda"));
console.log('Server is running on port 2000');
