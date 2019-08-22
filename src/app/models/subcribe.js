const mongoose = require('../../database');

// Criação do Schema de Incrição
const subcribeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  cpf: {
    type: Number,
    required: true,
  },
  curso: {
    type: String,
    require: true,
  },
  turno: {
    type: String,
    require: true,
  },
  hasInstrument: {
    type: String,
    require: true,
  },
  memberCommunity: {
    type: String,
    require: true,
  },
  birthState: {
    type: String,
    require: true,
  },
  birthCity: {
    type: String,
    require: true,
  },
  rg: {
    type: String,
    require: true,
  },
  orgaoEmissor: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  cep: {
    type: Number,
    require: true,
  },
  deficiency: {
    type: String,
    require: true,
  },
  schoolingDegree: {
    type: String,
    require: true,
  },
  howDiscovered: {
    type: String,
    require: true,
  },
  whyWants: {
    type: String,
    require: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId, // Relação com a coleção de usuarios
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
