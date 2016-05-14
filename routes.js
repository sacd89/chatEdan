var Usuario = require('./models/usuarios');
var Mensaje = require('./models/mensajes');

module.exports = function (app, passport, mongoose, io) {

  app.get("/", isLoggedIn, function (req, res) {
          res.render("index");
      });

      app.get('/login', function (req, res) {
          res.render('loginRegister');
      });

      app.post('/login', passport.authenticate('local-login', {
          successRedirect: '/',
          failureRedirect: '/loginRegister',
          failureFlash: true
      }));

      app.get('/logout', function (req, res) {
          req.logout();
          res.redirect('/loginRegister');
      });

      function isLoggedIn(req, res, next) {
          if (req.isAuthenticated()) {
              return next();
          }
          res.redirect('/loginRegister');
      }


  app.post('/mensaje/create', function (req, res) {
      var mensaje = new Mensaje({
          nombrePersona: req.body.nombrePersona,
          texto: req.body.texto
      });

      mensaje.save(function (err, obj) {
          console.log("Guardado exitosamente");
      });
  });

  app.post('/usuarios/create', function (req, res) {
    var usuario = new Usuario({
      nombre:req.body.name,
      usuario: req.body.user,
      password: req.body.password,
      correo: req.body.email,
    });
        //err tiene los errores que pueden pasar y obj el objeto a guardar.
        usuario.save(function (err, obj) {
            if (err) res.redirect("/", {obj: obj});
        });
        res.redirect("/home");
  });

  var getMessages = Mensaje.find({}).then(function successCallback(success) {
      return success;
  }, function errorCallback(error) {
      throw error;
  });

  io.on('connect', function (socket) {

      // console.log(getMessages());
      socket.emit('sendMessages', getMessages);

      socket.on('newMessage', function (data) {
          var mensajeNuevo = new Mensaje(data);
          mensajeNuevo.save(function (err, obj) {
              if (obj) {
                  io.sockets.emit('sendMessage',obj);
              }
          });
      });
  });

}
