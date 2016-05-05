var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre:String,
    usuario: String,
    password: String,
    correo: String,
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Usuario = mongoose.model("Usuario", usuarioSchema);
