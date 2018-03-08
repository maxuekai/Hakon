

const Mod  = require('../models/modules');

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

async function updateCode(ctx, next) {
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
      txt: err.toString()
    };
  }
}

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

async function getAllCategory(ctx, next) {
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
