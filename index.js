const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = 3000;
var path = require('path');
const app = express();

app.use(session({secret:'batata'}));
app.use(bodyParser.urlencoded({extended:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.post('/', (req, res)=> {
    try{
        var login = req.body.login;
        var senha = req.body.senha;
        mongoose.connect('mongodb://127.0.0.1/teste', function(err, db){
            if(err){
                throw err;
            }
            db.collection('usuarios').find().toArray(function(err, result){
                if(err){
                    throw err;
                }
                var count = Object.keys(result).length;
                var i=0;
                for(i = 0; i<count; i++){
                    nomeUsuario = result[i].name;
                    senhaUsuario = result[i].senha;
                        if(nomeUsuario == login && senhaUsuario == senha){
                            //Logado com sucesso
                            req.session.logado = login;
                            res.render('logado');
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

app.get('/', (req, res)=>{
    if (req.session.logado) {
        res.render('logado');
    } else {
        res.render('formulario');
    }
});


app.listen(port, ()=>{
    console.log('Servidor rodando');
});
