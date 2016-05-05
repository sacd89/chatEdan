var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');

var contactoSchema = new Schema({
    nombre: String,	
    Usuario: {type: Schema.ObjectId, ref: "Usuario"}
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Contacto = mongoose.model("Contacto", contactoSchema);
