'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/users');

module.exports = function() {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({
                email: email
            }, function(err, user) {

                if (err){
                    return done(err);
                }

                if (user) {
                    return done(null, false, { message: 'That email is already taken.'});
                } else {

                    // create the user
                    var newUser = new User();
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.firstname = req.body.firstname,
                    newUser.lastname = req.body.lastname

                    // save the user
                    newUser.save(function(err) {
                        if (err){
                            return done(err);
                        }
                        newUser.password = undefined;
                        req.user = newUser;
                        return done(null, newUser, { message: 'User has been sinup successfully.'});
                    });
                }

            });

        });

    }));

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        User.findOne({
            email: email
        }, function(err, user) {
            
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Unknown user.'});
            }

            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Oops! Wrong password.'});
            }

            user.last_seen = new Date();
            user.save();
            return done(null, user);
        });

    }));

};
