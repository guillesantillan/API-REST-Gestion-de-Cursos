const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/signup', (req,res)=>{
    res.render("cliente/signup", {
        viewTitle : "Sign up"
    });
});
router.get('/login', (req,res)=>{
    res.render("cliente/login", {
        viewTitle : "Sign up"
    });
});

router.post('/signup', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password
    });
    User.findOne({email: user.email}).then(result => { 
        if(result == null){
            user.save().then(result => { 
                console.log(result);
                res.redirect('/user/login');
            }).catch(err => {
                if(err.name == 'ValidationError'){
                    handleValidationError(err, req.body);
                    res.render("cliente/signup", {
                        viewTitle: "Signup",
                        user: req.body
                    });
                }
                else
                    console.log('Error en el signup: ' + err);
            });
        } else{
            console.log(result);
            res.redirect('/user/signup');
        }
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/login', (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    User.findOne({email: user.email, password: user.password}).then(result => { 
        if(result != null){
            console.log(result);
            res.redirect('/cliente/list');
        } else{
            console.log(result);
            res.redirect('/user/login');
        }
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

function handleValidationError(err, body){
    for(field in err.errors){
        switch (err.errors[field].path){
            case 'email': 
                body['emailError'] = err.errors[field].message;
                break;
            case 'password': 
                body['passwordError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;