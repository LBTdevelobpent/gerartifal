//inportar modulos
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

//conectar com o banco
mongoose.connect('connection string');

//carregar rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

//converter o conteúdo para JSON com o bodyParser
app.use(bodyParser.json());
//codifica a url
app.use(bodyParser.urlencoded({
  extended: false
}));

//rota usada
app.use('/', indexRoute);
app.use('/product', productRoute);

//preparar módulo para ser exportado
module.exports = app;
