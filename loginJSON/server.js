const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('../public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('formulario');
});

app.post('/login', (req, res) => {
    var contas = JSON.parse(fs.readFileSync('./contas.json'));
    var login = req.body.login;
    var senha = req.body.senha;

    try {
        for(let i = 0; i < contas.length; i++) {
            let nomes =  contas[i].nome;
            let senhas =  contas[i].senha;

            if (login == nomes && senha == senhas) {
                return res.status(200).json({ Mensagem: 'Você está logado' });
            }
        }
        if (login != null || senha != null) {
           return res.status(401).redirect('/');
        }
    }catch (err) {
        return err;
    }
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`);
});