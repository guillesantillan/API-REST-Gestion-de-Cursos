const mongoose = require('mongoose');

var clienteSchema = new mongoose.Schema({
    anioDictado: { type:Number, required: 'Campo obligatorio'},
    duracion: {type: String, required: 'Campo obligatorio'},
    tema: {type: String, required: 'Campo obligatorio'},
    alumnos: {type: Array}
});

module.exports = mongoose.model('Cliente', clienteSchema);