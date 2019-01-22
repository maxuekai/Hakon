/**
 * 模板操作
 */

const Mod  = require('../models/modules');

/**
 * 上传模板代码
 * @param {Object}} ctx 
 * @param {Object} next 
 */
async function uploadCode(ctx, next) {
  try{
    let data = ctx.request.body;
    await new Mod({ 
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
    return next();
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err.toString()
    };
  }
}

/**
 * 更新模板代码
 * @param {Object} ctx 
 */
async function updateCode(ctx) {
  try{
    ctx.status = 200;
    let data = ctx.request.body;
    await Mod.findById(data._id, (error, doc) => {
      if(error) {
        ctx.body = {
          code: 404,
          txt: 'not found module'
        };
      }
      doc.name = data.name;
      doc.html = data.html;
      doc.css = data.css;
      doc.js = data.js;
      doc.category = data.category;
      doc.save();
    });
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
 * 获取所有模板代码
 * @param {Object} ctx 
 */
async function getAllModules(ctx) {
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
      txt: err.toString()
    };
  }
}

/**
 * 获取某个模板代码
 * @param {Object} ctx 
 * @param {Object} next 
 */
async function getModule(ctx, next) {
  try{
    let data = ctx.request.query;
    const mod = await Mod.findOne({_id: data._id});
    if(mod) {
      ctx.body = {
        code: 200,
        txt: 'success',
        data: mod
      };
      return next();
    }else {
      ctx.body = {
        code: 404,
        txt: 'no this module'
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
 * 删除某个模板
 * @param {Object} ctx 
 * @param {Object} next 
 */
async function deleteModule(ctx, next) {
  try{
    let data = ctx.request.body;
    const mod = await Mod.remove({_id: data._id});
    if(mod) {
      ctx.body = {
        code: 200,
        txt: 'success',
        data: mod
      };
      return next();
    }else {
      ctx.body = {
        code: 404,
        txt: 'no this module'
      };
      return next();
    }
  }catch(err) {
    ctx.body = {
      code: 500,
      txt: err.toString()
    };
  }
}

/**
 * 获取所有的模板类别
 * @param {Object} ctx 
 */
async function getAllCategory(ctx) {
  try{
    const mod = await Mod.distinct('category');
    if(mod) {
      ctx.body = {
        code: 200,
        txt: 'success',
        data: mod
      };
    }else {
      ctx.body = {
        code: 404,
        txt: 'no category'
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
  uploadCode: uploadCode,
  updateCode: updateCode,
  getAllModules: getAllModules,
  getModule: getModule,
  deleteModule: deleteModule,
  getAllCategory: getAllCategory
};
