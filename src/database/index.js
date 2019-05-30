// Esse Script é para se conectar ao banco
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:gerartifal@cluster0-iod80.mongodb.net/clients?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
