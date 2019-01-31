const mongoose = require('../../database');

// Criação do Schema do usuario
const subcribeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  age: {
    type: Number,
    required: true,
  },

  cpf: {
    type: Number,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Exportação do Schema do Usuario
const subcribe = mongoose.model('subcribe', subcribeSchema);
module.exports = subcribe;
