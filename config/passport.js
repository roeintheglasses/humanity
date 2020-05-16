const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Loading the user model 
const User = require('../models/user.js');

module.exports = function(passport) {
    passport.use(
        new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, (email, password, done) => {
            //Matching user
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    console.log('user not found')
                    return done(null, false, {
                        message: 'Email is not registered.'
                    });
                }

                //Matching Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log('password match');
                        return done(null, user)
                    } else {
                        console.log('password incorrect')
                        return done(null, false, {
                            message: 'Incorrect Password'
                        })
                    }
                })
            }).catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });



}