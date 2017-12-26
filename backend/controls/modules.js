

const Mod  = require('../models/modules');

async function upload(ctx, next) {
  try{
    let data = ctx.request.query;
    new Mod({ 
      name: data.name, 
      html: data.html,
      css: data.css,
      js: data.js,
      category: data.category
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

async function getAllModules(ctx, next) {
  try{
    const mod = await Mod.find();
    ctx.body = {
      code: 200,
      txt: 'success',
      data: mod
    };
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err
    };
  }
}

async function getModule(ctx, next) {
  try{
    let data = ctx.request.query;
    const mod = await Mod.findOne({name: data.name});
    if(mod) {
      ctx.body = {
        code: 200,
        txt: 'success',
        dta: mod
      };
    }else {
      ctx.body = {
        code: 404,
        txt: 'no this module'
      };
    }
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err
    };
  }
}

module.exports = {
  upload: upload,
  getAllModules: getAllModules,
  getModule: getModule
};
