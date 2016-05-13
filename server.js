var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');


var app = express();
var port = process.env.PORT || 8080;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use("/public", express.static(__dirname + "/public"));

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//El orden de carga es importante, esto solo es la llamada de los Schemas.
var usuarioSchema = require('./models/usuarios').Usuario;
var mensajeSchema = require('./models/mensajes').Mensaje;

//Se modela cada variable con su Schema.
var Usuario = mongoose.model("Usuario", mensajeSchema);
var Mensaje = mongoose.model("Mensaje", mensajeSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

var server = require('http').Server(app);
var io = require("socket.io")(server);

app.get('/', function (req, res) {
    res.render('index');
});

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
          if (err) res.redirect("/login", {obj: obj});
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

    socket.on('newMessage', function (data) {
        var mensajeNuevo = new Mensaje(data);
        mensajeNuevo.save(function (err, obj) {
            if (obj) {
                io.sockets.emit('sendMessage',obj);
            }
        });
    });
});

server.listen(port, function () {
    console.log("Escuchando en: " + port);
});
