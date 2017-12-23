

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema({
  name: {
    type: String
  },
  password:{
    type: String
  }
});

module.exports = mongoose.model('User', Schema);