var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Mensaje = mongoose.model('Mensaje');

var contactoSchema = new Schema({
    nombre: String,
    usuario: String,
    mensajes: [{type: Schema.ObjectId, ref: "Mensaje"}]
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Contacto = mongoose.model("Contacto", contactoSchema);
