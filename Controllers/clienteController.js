const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Cliente = mongoose.model('Cliente');

router.get('/', (req,res)=>{
    res.render("cliente/addOrEdit", {
        viewTitle : "Nuevo Curso"
    });
});

router.post('/', (req,res) => {
    updateRegistro(req, res);
    });

    router.get('/nuevoCurso', (req,res)=>{
        res.render("cliente/nuevoCurso", {
            viewTitle : "Nuevo Curso"
        });
    });

    router.post('/nuevoCurso', (req, res) => {
        insertRegistro(req,res);
    });

    router.get('/filtro', (req,res)=>{
        res.render("cliente/filtro", {
            viewTitle : "Cursos"
        });
    });

    router.post('/filtro', (req, res) => {
        if(req.body.duracion == ""){
            Cliente.find({anioDictado: req.body.anioDictado}, (err, docs) => {
                if(!err) {
                    res.json(docs);
                }
                else {
                    console.log('Error en buscar lista de clientes: ' + err);
                }
            })
        } else {
            Cliente.find({anioDictado: req.body.anioDictado, duracion: req.body.duracion}, (err, docs) => {
                if(!err) {
                    res.json(docs);
                }
                else {
                    console.log('Error en buscar lista de clientes: ' + err);
                }
            })
        }
    })

    function insertRegistro(req, res) {
        var cliente = new Cliente();
        cliente.anioDictado = req.body.anioDictado;
        cliente.duracion = req.body.duracion;
        cliente.tema = req.body.tema;
        
        cliente.save((err, doc) => {
            if(!err)
                res.redirect('/cliente/list');
            else {
                if(err.name == 'ValidationError'){
                    handleValidationError(err, req.body);
                    res.render("cliente/addOrEdit", {
                        viewTitle: "Insert Cliente",
                        cliente: req.body
                    });
                }
                else
                    console.log('Error en la insercion: ' + err);
            }
        });
    }

function updateRegistro(req, res){
    var elem = new Cliente();
    elem._id = req.body._id;
    elem.anioDictado = req.body.anioDictado;
    elem.duracion = req.body.duracion;
    elem.tema = req.body.tema;
    if(req.body.nombre != ""){
        elem.alumnos.push({nombre: req.body.nombre, apellido: req.body.apellido, DNI: req.body.DNI, direccion: req.body.direccion, nota: req.body.nota});
        Cliente.findByIdAndUpdate(elem._id, {anioDictado: elem.anioDictado,
            duracion: elem.duracion,
            tema: elem.tema,
            $push: {alumnos: {nombre: req.body.nombre, apellido: req.body.apellido, DNI: req.body.DNI, direccion: req.body.direccion, nota: req.body.nota}}}, 
        (err, doc) => {
                    if (!err) {res.redirect('cliente/list'); }
                    else {
                    if(err.name == 'ValidationError'){
                    handleValidationError(err, req.body);
                    res.render("cliente/addOrEdit", {
                    viewTitle: 'Modificar Cliente',
                    cliente: req.body
                    });
                    }
                    else console.log('Error durante el update: ' + err);
                    }
                    });
    }else {
        Cliente.findByIdAndUpdate(elem._id, {anioDictado: elem.anioDictado,
            duracion: elem.duracion,
            tema: elem.tema}, 
        (err, doc) => {
if (!err) {res.redirect('cliente/list'); }
else {
if(err.name == 'ValidationError'){
handleValidationError(err, req.body);
res.render("cliente/addOrEdit", {
viewTitle: 'Modificar Cliente',
cliente: req.body
});
}
else console.log('Error durante el update: ' + err);
}
});
    }
}

router.get('/list', (req, res) => {
    Cliente.find((err, docs) => {
        if(!err) {
            res.render("cliente/list", {list: docs});
        }
        else {
            console.log('Error en buscar lista de clientes: ' + err);
        }
    })
})

router.get('/alumnos/:id', (req, res) => {
    
    Cliente.findById(req.params.id, (err, doc) => {
        if(!err) {
            res.json(doc.alumnos);
        }
    });
});



function handleValidationError(err, body){
    for(field in err.errors){
        switch (err.errors[field].path){
            case 'anioDictado': 
                body['anioDictadoError'] = err.errors[field].message;
                break;
            case 'duracion': 
                body['duracionError'] = err.errors[field].message;
                break;
            case 'tema': 
                body['temaError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Cliente.findById(req.params.id, (err, doc) => {
        if(!err) {
            res.render("cliente/addOrEdit", {
                viewTitle: "Modificar Curso",
                cliente: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Cliente.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) {
            res.redirect('/cliente/list');
        }
        else { console.log('Error eliminando un cliente: ' + err); }
    });
});

router.get('/alumnosCurso/:id', (req, res) => {
    Cliente.findById(req.params.id, (err, doc) => {
        res.json(doc.alumnos);
    });
});

router.get('/mejorAlumno/:id', (req, res) => {
    Cliente.aggregate([
        {$unwind: "$alumnos"},
        {$match: {"_id": mongoose.Types.ObjectId(req.params.id)} },
        {$sort: {"alumnos.nota": -1}},
        {$limit: 1},
        {$project: {"_id": 0, alumnos: 1}}
], (err, doc) => {
        if(!err) {
            res.json(doc);
        }
    });
});

module.exports = router;