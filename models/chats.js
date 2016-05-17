var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');
var Mensaje = mongoose.model('Mensaje');

var chatSchema = new Schema({
    remitente: {type: Schema.ObjectId, ref: "Usuario"},
    destinatario: {type: Schema.ObjectId, ref: "Usuario"},
    mensajes: {type: Array, "default": []}
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
module.exports = mongoose.model("Chat", chatSchema);
