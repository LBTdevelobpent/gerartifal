// Esse Script é para se conectar ao banco
const mongoose = require('mongoose');

mongoose.connect('mongodb://usuario_gerart:S4Sr{Fp-59@kamino.mongodb.umbler.com:35621/db_gerart2', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
