const mongoose = require('../../database');

const OpsubSchema = new mongoose.Schema({
  unique: {
    type: Boolean,
    default: true,
  },

  from: {
    type: Date,
  },

  until: {
    type: Date,
  },

});

const Opsub = mongoose.model('Opsub', OpsubSchema);
module.exports = Opsub;
