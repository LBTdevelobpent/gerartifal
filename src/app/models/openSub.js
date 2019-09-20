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

  morning: {
    Violino: {
      type: Number,
    },
    Viola: {
      type: Number,
    },
    Cello: {
      type: Number,
    },
    Baixo_Acustico: {
      type: Number,
    },
    Tec_Vocal: {
      type: Number,
    },
    Musicalizacao: {
      type: Number,
    },
  },

  evening: {
    Violino: {
      type: Number,
    },
    Viola: {
      type: Number,
    },
    Cello: {
      type: Number,
    },
    Baixo_Acustico: {
      type: Number,
    },
    Tec_Vocal: {
      type: Number,
    },
    Musicalizacao: {
      type: Number,
    },
  },

});

const Opsub = mongoose.model('Opsub', OpsubSchema);
module.exports = Opsub;
