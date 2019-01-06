//inportar modulos
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();


//carregar rotas
const indexRoute = require('./routes/index-route');

//converter o conteúdo para JSON com o bodyParser
app.use(bodyParser.json());
//codifica a url
app.use(bodyParser.urlencoded({
  extended: false
}));

//rota usada
app.use('/', indexRoute);

//preparar módulo para ser exportado
module.exports = app;
