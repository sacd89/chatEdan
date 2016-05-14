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

    //Local
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            //async
            //findOne no se lanzara a menos de que se devuelvan datos
            process.nextTick(function () {
                //Buscar un usuario cuyo nombre sea igual que el del formulario
                //Checando si el usuario tratando de accesar ya existe
                Usuario.findOne({'local.email': email}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Usuario ya tomado'));
                    } else {
                        // console.log(req.body);
                        //Si no existe un usuario con ese nombre, crear usuario
                        var usuarioNuevo = new Usuario();
                        usuarioNuevo.local.email = email;
                        usuarioNuevo.local.password = usuarioNuevo.generateHash(password);

                        usuarioNuevo.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, usuarioNuevo);
                        });
                    }
                });
            });
        }));

    passport.use("local-login", new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            Usuario.findOne({'local.email': email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Contraseña equivocada'));
                }
                return done(null, user);
            });
        }));
};
