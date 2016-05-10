var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var log4js = require('log4js');
var logger = log4js.getLogger();

app.set("view engine", "pug");
app.use(express.static('public'));

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//El orden de carga es importante, esto solo es la llamada de los Schemas.
var usuarioSchema = require('./models/usuarios').Usuario;
var contactoSchema = require('./models/contactos').Contacto;
var mensajeSchema = require('./models/mensajes').Mensaje;

//Se modela cada variable con su Schema.
var Usuario = mongoose.model("Usuario", mensajeSchema);
var Contacto = mongoose.model("Contacto", mensajeSchema);
var Mensaje = mongoose.model("Mensaje", mensajeSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Servidor Web
var server = require("http").Server(app);
//Servidor de Web Sockets
var io = require("socket.io")(server);

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/login', function (req, res) {
    res.render('loginRegister');
});

app.get('/mensajes/all', function (req, res) {
    Mensaje.find({}).exec(function (err, mensajes) {
        if (err) {
            throw err;
        }
        return res.json(mensajes);
    })
});

app.post('/mensaje/create', function (req, res) {
    var mensaje = new Mensaje({
        texto: req.body.text/*,
        contacto: contacto._id*/
    });

    mensaje.save(function (err, obj) {
        console.log("mensaje guardado exitosamente");
    });
});

app.get('/contactos/all', function (req, res) {
    Contacto.find({}).exec(function (err, contactos) {
        if (err) {
            throw err;
        }
        Usuario.populate(contactos, {path: "usuarioContacto"},function(err, libros){
            return res.json(contactos);
        });
    })
});

app.post('contacto/agregar', function (req, res) {
    Usuario.find({
      "usuario": req.body.usuarioContacto
    }).then(function(data){
      if(data){
          var contacto = new Contacto(data);
          contacto.save(function (err, obj) {
              console.log("Contacto agregado exitosamente");
          });
      }else{
        console.log("El usuario no existe");
      }
      console.log("Si entra al metodo agregar contacto");
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
          if (err) res.redirect("/login", {obj: obj});
      });
      res.redirect("/");
});

/*app.post('/loginSuccess', function (req, res) {
  Usuario.find({"usuario" : req.body.user}).then(function(data){
    console.log(Usuario.usuario.password);
    if(data){
      if(usuarioSchema.password === req.body.password){
        res.redirect("/");
      }else{
        console.log("Contraseña mal");
      }
    }else{
      console.log("Usuario no existe");
    }
  });
});*/

var mensajes = [];

var contactos = [];

io.on('connect', function(socket){
  logger.info("Alguien se ha conectado.");
  //Carga datos al iniciar.
  socket.emit('enviarMensajes', mensajes);
  socket.emit('guardarContacto', contactos);

  //Escuchas que esperan un dato nuevo
  socket.on('mensajeNuevo', function(data){
    mensajes.push(data);
    io.sockets.emit('enviarMensajes', mensajes);
  });

  socket.on('contactoNuevo', function(data){
    contactos.push(data);
    io.sockets.emit('guardarContacto', contactos);
  });

});

server.listen(8080, function(){
  //TODO Logs.
});
