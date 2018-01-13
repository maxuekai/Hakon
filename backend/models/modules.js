

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
  js: {
    type: String
  },
  category: {
    type: String,
    default: 'common'
  },
  author: {
    type: String
  }
});

module.exports = mongoose.model('Modules', Schema);