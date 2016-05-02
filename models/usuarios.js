var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Contacto = mongoose.model('Contacto');

var usuarioSchema = new Schema({
    nombre:String,
    usuario: String,
    password: String,
    correo: String,
    contactos: [{type: Schema.ObjectId, ref: "Contacto"}]
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Usuario = mongoose.model("Usuario", usuarioSchema);
