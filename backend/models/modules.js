

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema({
  name: {
    type: String
  },
  html: {
    type: String
  },
  css: {
    type: String
  },
  category: {
    type: String,
    default: 'common'
  }
});

module.exports = mongoose.model('Modules', Schema);