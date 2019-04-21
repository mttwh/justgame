const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;


//Initialize app
const app = express();

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});


//check for db errors
db.on('error', function(err){
  console.log(err);
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


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
})

//route files
let users = require('./routes/users');
app.use('/users', users);

app.listen(port, () => console.log('Node server listening on port ' + port));

