var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');

var mensajeSchema = new Schema({
    nombrePersona:{type: Schema.ObjectId, ref: "Usuario"},
    texto: String
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Mensaje = mongoose.model("Mensaje", mensajeSchema);
