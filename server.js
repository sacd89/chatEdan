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

//El orden de carga de los models es importante.
var Mensaje = require('./models/mensajes').Mensaje;
var Contacto = require('./models/contactos').Contacto;
var Usuario = require('./models/usuarios').Usuario;

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
        texto: req.body.text
    });

    mensaje.save(function (err, obj) {
        console.log("Guardado exitosamente");
    });
});

app.post('/contacto/create', function (req, res) {
    var contacto = new Contacto({
        usuario: req.body.usuario
    });

    mensaje.save(function (err, obj) {
        console.log("Guardado exitosamente");
    });
});

var mensajes = [
  {
    id: 1,
    text: "Mensaje 1",
    emisor: "Daniela"
  }
];

io.on('connect', function(socket){
  logger.info("Alguien se ha conectado.");
  socket.emit('enviarMensajes', mensajes);
  socket.on('mensajeNuevo', function(data){
    mensajes.push(data);
    io.sockets.emit('enviarMensajes', mensajes);
  });
});

server.listen(8080, function(){
  //TODO Logs.
});
