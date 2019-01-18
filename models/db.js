const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DBlandDB', { useNewUrlParser: true}, (err) => {
    if (!err) {console.log('MongoDB se conecto con exito!')}
    else {console.log('Error en la coneccion: ' + err)}
});

require('./cliente.model');
require('./user');