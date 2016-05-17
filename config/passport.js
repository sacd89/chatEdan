var LocalStrategy = require('passport-local').Strategy;
var Usuario = require('../models/usuarios');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Usuario.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use("local-login", new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            Usuario.findOne({'local.email': email, 'local.password': password}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                return done(null, user);
            });
        }));
};
