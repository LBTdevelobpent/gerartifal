const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clients', {useMongoClient: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;