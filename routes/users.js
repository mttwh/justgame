const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const flash = require('connect-flash');
const app = express();
const expressValidator = require('express-validator');
router.use(expressValidator());


let User = require('../models/user');


router.get('/register', function(req, res){
    res.sendFile(path.join(__dirname + '/../public/register.html'));
});

//Register User
router.post('/register', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordConfirmation', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.sendFile(path.join(__dirname + '/../public/register.html'));
    } else {
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err, req){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        //req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});


//Login route
router.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '/../public/login.html'));
})

//Login process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        //failureFlash: true
    })(req, res, next);
});

module.exports = router;