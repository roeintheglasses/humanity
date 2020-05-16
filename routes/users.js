const router = require('express').Router();
const bcrypt = require('bcryptjs');

//User Model
const user = require('../models/user')

// Login
router.get('/login', (req, res) => {
    res.render('login');
})

// Logout
router.get('/logout', (req, res) => {
    //PassPort Handle Stuff 
    res.send('logging out');
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

    //Check passwords match 
    if (password != password2) {
        errors.push({
            msg: "Passwords do no match"
        });
    }
    //Check password length  
    if (password.length < 6) {
        errors.push({
            msg: "Password should be at least 6 characters"
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
        user.findOne({
            email
        }).then(userexists => {
            //User exists in database
            if (userexists) {
                errors.push({
                    msg: "Email is already registered."
                })
                res.render('register', {
                    errors,
                    name,
                    email
                });
            } else {
                const newUser = new user({
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

                        newUser.save().then(user => {
                            console.log('user added to the database.');
                            res.redirect('/users/login');
                        }).catch(err => console.log(err));
                    })
                })
                console.log(newUser);
            }
        }).catch(err => console.log(err));

    }

})



// Auth with google account
router.get('google', (req, res) => {
    //PassPort Handle Stuff
    res.send('loggin in with google account');
})


module.exports = router;