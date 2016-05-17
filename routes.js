var Usuario = require('./models/usuarios');
var Mensaje = require('./models/mensajes');
var Chat = require('./models/chats');

module.exports = function (app, passport, mongoose, io) {

  app.get("/", isLoggedIn, function (req, res) {
      console.log(req);
          res.render("index", {user: req.user});
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

  app.post('/contacto/agregar', function (req, res) {
    console.log(req.body);
      Usuario.findOne({"_id": mongoose.Types.ObjectId(req.body.idDestinatario)})
      .exec(function(err, data){
        if(err){
          //TODO: errorHandler
        }
        if(data){
          Usuario.update(
            {"_id": mongoose.Types.ObjectId(req.body.idUsuario)},
            {$push: {contactos: {$each: [data]}}},
            {upsert: true}, function (err) {
            if (err) {
                console.log("Aaaaa")
            } else {
              return res.send("Tu contacto ha sido agregado.");
            }
        });
        }
      });
  });

  app.get('/findUsuarios', function(req, res){
    Usuario.find({}).exec(function(err, data){
      if(err){
        //TODO mandar error
      }else{
        res.json(data);
      }
    });
  });

  app.get('/findContactos/:idUsuario', function(req, res){
    Usuario.findOne({"_id": req.params.idUsuario}).exec(function(err, data){
      if(err){
        //TODO mandar error
      }else{
        if(data.contactos) res.json(data.contactos);
      }
    });
  });

  app.get('/getChat/:idRemitente/:idDestinatario', function(req, res){
    Chat.findOne({"remitente": mongoose.Types.ObjectId(req.params.idRemitente),
    "destinatario": mongoose.Types.ObjectId(req.params.idDestinatario)})
    .exec(function(err, data){
      if(err){
        //TODO tu mama
      }
      if(data){
        res.json(data);
      }else{
        Chat.findOne({"destinatario": mongoose.Types.ObjectId(req.params.idRemitente),
        "remitente": mongoose.Types.ObjectId(req.params.idDestinatario)})
        .exec(function(err, data){
          if(err){
            //TODO tu mama
          }
          if(data){
            res.json(data);
          }else{
            var chat = new Chat({
              remitente: mongoose.Types.ObjectId(req.params.idRemitente),
              destinatario: mongoose.Types.ObjectId(req.params.idDestinatario),
              mensajes: []
            });
            chat.save(function (err, obj) {
              res.json(chat);
            });
          }
        });
      }
    });
  });

  app.post('/usuarios/create', function (req, res) {
    var usuario = new Usuario({
      nombre:req.body.name,
      usuario: req.body.user,
      local: {email: req.body.email,
      password: req.body.password}
    });
        //err tiene los errores que pueden pasar y obj el objeto a guardar.
        usuario.save(function (err, obj) {
            if (err){
              res.redirect("/loginRegister", {obj: obj});
            }
                    });
        res.redirect("/");
  });

  var getMessages = Mensaje.find({}).then(function successCallback(success) {
      return success;
  }, function errorCallback(error) {
      throw error;
  });

  io.on('connect', function (socket) {

      // console.log(getMessages());
      socket.emit('sendMessages', getMessages);

      socket.on('newMessage', function (data, chat) {
          console.log("entre a newMessage");
          var mensajeNuevo = new Mensaje(data);
          Chat.update(
            {"_id": mongoose.Types.ObjectId(chat._id)},
            {$push: {mensajes: {$each: [mensajeNuevo]}}},
            {upsert: true}, function (err) {
            if (err) {
                console.log("Aaaaa")
            } else {
                io.emit('sendMessage');
            }
        });
      });
  });

}
