

const User  = require('../models/user');

async function login(name, pwd) {
  const user = await User.findOne({ name: name, password: pwd });
  console.log(user);
}

async function register(name, pwd) {
  await new User({
    name: name,
    password: pwd,
  }).save();
  console.log('success');
}

module.exports = {
  login: login,
  register: register
};