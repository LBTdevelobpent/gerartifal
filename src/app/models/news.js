const mongoose = require('../../database');

const newsSchema = new mongoose.Schema({

  date: {
    type: String,
    required: true,
  },

  archiName: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

});

const News = mongoose.model('News', newsSchema);
module.exports = News;
