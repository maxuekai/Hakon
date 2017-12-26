

const User  = require('../models/user');

async function login(ctx, next) {
  try {
    let data = ctx.request.query;
    const user =  await User.findOne({ name: data.name, password: data.password });
    if(user) {
      ctx.body = {
        code: 200,
        txt: 'success',
        data: user
      };
    }else {
      ctx.body = {
        code: 404,
        txt: 'no one'
      };
    }
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err
    };
  }
}

async function register(ctx, next) {
  try {
    let data = ctx.reuqest.query;
    await new User({
      name: data.name,
      password: data.password,
    }).save();
    ctx.body = {
      code: 200,
      txt: 'success'
    };
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err
    };
  }
}

module.exports = {
  login: login,
  register: register
};