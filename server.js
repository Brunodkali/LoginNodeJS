const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const axios = require('axios');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/login', (req, res) => {
    res.render('formulario');
});

app.post('/login', async (req, res) => {
    var contas = JSON.parse(fs.readFileSync('./contas.json'));
    var login = req.body.login;
    var senha = req.body.senha;

    for (let i in contas) {
        let conta = contas[i];

        try {
            if (login == conta.nome && senha == conta.senha) {
                res.status(200).json({ Mensagem: 'Você está logado' });
            }else {
                i++
            }
        }catch (err) {
            res.status(401).json({ Mensagem: 'Erro ao logar' });
            return err;
        }
    }
});

app.get('/teste', (req, res) => {
    const status = '405';
    res.cookie('status', status, { expires: new Date(Date.now() + 900000), httpOnly: true });
    res.send(req.cookies);
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`);
});