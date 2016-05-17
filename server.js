var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require("express-session");


var app = express();
var port = process.env.PORT || 8080;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use("/public", express.static(__dirname + "/public"));
app.use(session({
    secret: "d41d8cd98f00b204e9800998ecf8427e", //Es un hash que identifica  nuestra aplicacion de otras aplicaciones express
    resave: false,//Cada vez que se aga un request se tiene que guardar o rehacer la sesión
    saveUninitialized: false // Sirve para reinicializar la sesión cada vez que se hace un request
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);


//Se modela cada variable con su Schema.
var Usuario = require('./models/usuarios').Usuario;
var Mensaje = require('./models/mensajes').Mensaje;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

var server = require('http').Server(app);
var io = require("socket.io")(server);

require('./routes.js')(app, passport, mongoose, io);
require('./config/passport')(passport);

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/loginRegister', function (req, res) {
    res.render('loginRegister');
});


server.listen(port, function () {
    console.log("Escuchando en: " + port);
});
