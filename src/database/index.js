// Esse Script é para se conectar ao banco
const mongoose = require('mongoose');

mongoose.connect('mongodb://usergerart:OK(Up8A{latj5@kamino.mongodb.umbler.com:49700/db_gerart', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
