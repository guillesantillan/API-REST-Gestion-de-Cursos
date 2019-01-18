const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Cliente = mongoose.model('Cliente');

router.get('/', (req,res)=>{
    res.render("cliente/inicio", {
        viewTitle : "Ingresar Curso"
    });
});

module.exports = router;