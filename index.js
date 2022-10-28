// Requires
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var path = require('path');

// Variávies globais
const port = 5000;
const app = express();
const db = mongoose.connection;

// Tratamento de conexão com banco de dados
db.on('error', (err)=> console.log(err));
db.once('open', ()=> console.log('Banco de dados conectado'));

// Uses e sets que serão usados no back-end
app.use(session({secret:'batata'}));
app.use(bodyParser.urlencoded({extended:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));


// Tratamento de dados provindos do front e busca no banco de dados
app.post('/', (req, res)=> {
    try{
        var login = req.body.login;
        var senha = req.body.senha;
        // Conexão com banco
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
                // Conmparação com usuário provindo do front com banco de dados
                    nomeUsuario = result[i].name;
                    senhaUsuario = result[i].senha;
                    if(nomeUsuario == login && senhaUsuario == senha){
                        //Logado com sucesso
                        console.log(count);
                        req.session.login = login;
                        res.render('logado');
                    }else{
                        res.render('formulario');
                        console.log('error ali');
                    }
                    break;
                    }
                });
            });

    }catch(err) {
        res.send('Ocorreu um erro na autenticação');
    }
});

// Check se existe Session no front-end ou não
app.get('/', (req, res)=>{
    if (req.session.login) {
        res.render('logado');
    } else {
        res.render('formulario');   
    }
});

app.listen(port, ()=>{
    console.log('Servidor rodando');
});
