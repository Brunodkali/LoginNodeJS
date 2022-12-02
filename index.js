const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 5000;
const db = mongoose.connection;
var path = require('path');

app.use(session({ secret:'batata' }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

db.on('error', (err)=> console.log(err));
db.once('open', ()=> console.log('Banco de dados conectado'));

// Função para tratamento de dados provindos do front e busca no banco de dados
app.post('/login', (req, res)=> {
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
                console.log(result);
                var count = Object.keys(result).length;
                var i = 0;

                for(i = 0; i < count; i++){
                    nomeUsuario = result[i].name;
                    senhaUsuario = result[i].senha;
                    
                    if(nomeUsuario == login && senhaUsuario == senha){
                        req.session.login = login;
                        res.render('logado');
                    }else{
                        res.render('formulario');
                    }
                    break;
                }
            });
        });
    }catch(err) {
        res.send('Ocorreu um erro na autenticação');
    }
});

app.get('/', (req, res)=>{
    if (req.session.login) {
        res.render('logado');
    } else {
        res.render('formulario');   
    }
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`);
});