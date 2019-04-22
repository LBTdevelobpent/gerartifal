// Esse Script é para se conectar ao banco
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clients', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;


