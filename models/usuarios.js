var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre:String,
    usuario: String,
    local: {
        email: {type: String},
        password: {
            type: String
            // , validate: {
            //     validator: function (p) {
            //         return this.confirmarPassword === p;
            //     }, message: "Las contraseñas no son iguales"
            // }
        }
    },
    contactos: {type: Array, "default": []}
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
module.exports = mongoose.model("Usuario", usuarioSchema);
