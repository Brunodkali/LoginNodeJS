const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;
const db = mongoose.connection;
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(session({ secret:'batata' }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Banco de dados conectado'));

// Função para tratamento de dados provindos do front e busca no banco de dados
app.post('/login', (req, res)=> {
    try{
        let login = req.body.login;
        let senha = req.body.senha;

        mongoose.connect('mongodb://127.0.0.1/teste', async function(err, db){
            if(err){
                throw err;
            }
            let users = await db.collection('usuarios').find().toArray();
            
            try {
                for(let i = 0; i < users.length; i++) {
                    let nomeUsuario = users[i].name;
                    let senhaUsuario = users[i].senha;
                
                    if(login == nomeUsuario && senha == senhaUsuario){
                        return res.status(200).json({ Mensagem: 'Você está logado' });
                    }
                }
                if (login != null || senha != null) {
                    return res.status(401).redirect('/');
                }
            }catch(err) {
                return err;
            }
            
        });
    }catch(err) {
        return res.send('Ocorreu um erro na autenticação');
    }
});

app.get('/', (req, res)=>{
    res.render('formulario');
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`);
});