const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const database = require('./src/db.js')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.urlencoded({ extended:true }));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res)=>{
    res.render('formulario');
});

app.post('/login', async (req, res)=> {
    try{
        let login = req.body.login;
        let senha = req.body.senha;
        let users = await database.collection('usuarios').find().toArray();

        try {
            for(let i = 0; i < users.length; i++) {
                let nomeUsuario = users[i].name;
                let senhaUsuario = users[i].senha;
                
                if(login == nomeUsuario && senha == senhaUsuario){
                    return res.status(200).json({ Mensagem: `Você está logado como ${nomeUsuario[0].toUpperCase() + nomeUsuario.substr(1)}` });
                }
            }
            if (login != null || senha != null) {
                return res.status(401).redirect('/');
            }
         }catch(err) {
            return err;
        }
    }catch(err) {
        return res.send('Ocorreu um erro na autenticação');
    }
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`);
});