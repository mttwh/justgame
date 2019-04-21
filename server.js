const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
const config = require('./config/database');



mongoose.connect(config.database);
let db = mongoose.connection;


//Initialize app
const app = express();
//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

app.use(flash());

//check for db errors
db.on('error', function(err){
  console.log(err);
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Express Session Middleware
app.use(session({
  secret: 'good password',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

let port = process.env.PORT;

let User = require('./models/user');

app.use(express.static('public'));

if (port == null || port == "") {
  port = 8000;
}

//Home route
app.get('/', function(req, res){
  User.find({}, function(err, users){
    if(err){
      console.log(err);
    } else {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    }
  });
});

//Passport Config
require('./config/passport')(passport);
//Middleware
app.use(passport.initialize());
app.use(passport.session());

//route files
let users = require('./routes/users');
app.use('/users', users);

app.listen(port, () => console.log('Node server listening on port ' + port));

