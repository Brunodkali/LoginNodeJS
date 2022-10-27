/*const mongoose = require('mongoose');
const express = require('express');
const app = express();

// teste login
app.post('/login', (req, res)=> {
    try{
        var name = req.body.login;
        var senha = req.body.senha;
        mongoose.connect('mongodb://127.0.0.1/teste', function(err, db){
            if(err){
                throw err;
            }
            db.collection('usuarios').find().toArray(function(err, result){
                if(err){
                    throw err;
                }
                console.log(result);
                var count = Object.keys(result).length;
                var i=0;
                for(i = 0; i<count; i++){
                    nomeUsuario = result[i].name;
                    senhaUsuario = result[i].senha;
                        if(nomeUsuario == name && senhaUsuario == senha){
                            //Logado com sucesso
                            req.session.login = name;
                        }else{
                            res.render('formulario');
                        }
                    }
                })
            })

    }catch(err) {
        res.send('Ocorreu um erro na autenticação');
    }
})

module.exports = { app };*/