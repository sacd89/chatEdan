var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Contacto = mongoose.model('Contacto');

var mensajeSchema = new Schema({
    texto: String/*,
    contacto: {type: Schema.ObjectId, ref: "Contacto"}*/
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Mensaje = mongoose.model("Mensaje", mensajeSchema);
