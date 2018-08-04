/**
 * 用户管理方法
 */

const User  = require('../models/user');
const md5 = require('md5');

/**
 * 登录
 * @param {Object} ctx 
 * @param {Object} next 
 */
async function login(ctx, next) {
  try {
    let data = ctx.request.body;
    const user =  await User.findOne({ name: data.name, password: md5(data.password) });
    if(user) {
      ctx.cookies.set('usr', data.name, {
        // domain: '127.0.0.1',
        // path: '/',
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: true  // 是否允许重写
      });
      ctx.cookies.set('pwd', md5(data.password), {
        // domain: '127.0.0.1',
        // path: '/',
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: true  // 是否允许重写
      });
      console.log(ctx.cookies.get('usr'),ctx.cookies.get('pwd'));
      ctx.body = {
        code: 200,
        txt: 'success',
        data: user
      };
    }else {
      ctx.body = {
        code: 404,
        txt: 'no one',
        ctx: ctx
      };
    }
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err.toString()
    };
  }
}

/**
 * 注册
 * @param {Object} ctx 
 * @param {Object} next 
 */
async function register(ctx, next) {
  try {
    let data = ctx.request.body;
    await new User({
      name: data.name,
      password: md5(data.password),
    }).save();
    console.log(data.name, data.password);
    ctx.cookies.set('usr', data.name, {
      // domain: '127.0.0.1',
      // path: '/',
      httpOnly: false,  // 是否只用于http请求中获取
      overwrite: true  // 是否允许重写
    });
    ctx.cookies.set('pwd', md5(data.password), {
      // domain: '127.0.0.1',
      // path: '/',
      httpOnly: false,  // 是否只用于http请求中获取
      overwrite: true  // 是否允许重写
    });
    console.log(ctx.cookies.get('usr'),ctx.cookies.get('pwd'));
    ctx.body = {
      code: 200,
      txt: 'success'
    };
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err.toString()
    };
  }
}

/**
 * 检查登录
 * @param {Object} ctx 
 * @param {Object} next 
 */
async function checkLogin(ctx, next){
  try {
    let usr = ctx.cookies.get('usr');
    let pwd = ctx.cookies.get('pwd');
    if(usr && pwd) {
      const user = await User.findOne({ name: usr, password: pwd });
      if(user) {
        ctx.body = {
          code: 200,
          txt: 'logined',
          data: user
        };
      }
    }else {
      ctx.body = {
        code: 404,
        txt: 'no login'
      };
    }
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err.toString()
    };
  }
}

module.exports = {
  login: login,
  register: register,
  checkLogin: checkLogin
};