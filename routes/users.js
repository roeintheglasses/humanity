const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validator = require('validator');
const passwordValidator = require('password-validator');

//Creating password validation schema 
var schema = new passwordValidator();
schema.is().min(6) // Minimum length 8
schema.is().max(20) // Maximum length 100
schema.has().uppercase() // Must have uppercase letters
schema.has().lowercase() // Must have lowercase letters
schema.has().digits() // Must have digits
schema.has().not().spaces() // Must not contain spaces

//User Model
const User = require('../models/user')

// Login
router.get('/login', (req, res) => {
    res.render('login');
})

//Register 
router.get('/register', (req, res) => {
    res.render('register');
})

//Register post request handler

router.post('/register', (req, res) => {
    console.log(req.body);
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    //Check if Email is valid
    if (!validator.isEmail(email)) {
        errors.push({
            msg: "Email is not valid."
        });
    }

    //Check passwords match 
    if (password != password2) {
        errors.push({
            msg: "Passwords do no match"
        });
    }

    var passwordErrorList = schema.validate(password, {
        list: true
    })

    //Check password min length  
    if (passwordErrorList.includes("min")) {
        errors.push({
            msg: "Password should be at least 6 characters."
        });
    }
    //Check password max length 
    if (passwordErrorList.includes("max")) {
        errors.push({
            msg: "Password can not be longer than 20 characters."
        });
    }
    //Check password has uppercase 
    if (passwordErrorList.includes("uppercase")) {
        errors.push({
            msg: "Password should contain at least one uppercase character."
        });
    }
    //Check password has lowercase 
    if (passwordErrorList.includes("lowercase")) {
        errors.push({
            msg: "Password should contain at least one lowercase character."
        });
    }
    //Check password has digits 
    if (passwordErrorList.includes("digits")) {
        errors.push({
            msg: "Password should contain at least one digit."
        });
    }
    //Check password for spaces 
    if (passwordErrorList.includes("spaces")) {
        errors.push({
            msg: "Password should not contain spaces."
        });
    }

    if (errors.length != 0) {
        console.log(errors)
        res.render('register', {
            errors,
            name,
            email
        });
    } else {

        //Validation Passed add to database
        User.findOne({
            email
        }).then(user => {
            //User exists in database
            if (user) {
                errors.push({
                    msg: "Email is already registered."
                });
                res.render('register', {
                    errors,
                    name,
                    email
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password: password
                });

                //Password Hashing
                bcrypt.genSalt(10, (err, salt) => {
                    if (err, null) throw err;

                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err, null) throw err;
                        //Setting password to hash
                        newUser.password = hash;

                        newUser.save().then(User => {
                            console.log('user added to the database.');
                            req.flash('successMsg', "You've been registered successfully!!")
                            res.redirect('/users/login');
                        }).catch(err => console.log(err));
                    });
                })
                console.log(newUser);
            }
        }).catch(err => console.log(err));

    }

});

// Login post request handler
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/game',
        failureRedirect: '/users/login',
        failureFlash: true
    })
);

//Logging out the user
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('successMsg', "You've been logged out successfully.");
    res.redirect('/users/login');
})


// Auth with google account
// router.get('google', (req, res) => {
//     //PassPort Handle Stuff
//     res.send('loggin in with google account');
// });


module.exports = router;