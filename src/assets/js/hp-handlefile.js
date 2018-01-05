'use strict';

import sprites from './hp-css-sprite';
const fs = global.require('fs');
const path = global.require('path');
const postcss = global.require('postcss');
const imagemin = global.require('imagemin');
const imageminMozjpeg = global.require('imagemin-mozjpeg');
const imageminPngquant = global.require('imagemin-pngquant');
const imageminGifsicle = global.require('imagemin-gifsicle');
const autoprefixer = global.require('autoprefixer');
const atImport = global.require('postcss-import');
const cssnano = global.require('cssnano');
const cssnext = global.require('postcss-cssnext');

/**
 * 操作css
 *
 * @param {string} stylesheetPath
 * @param {object} mode:{spriteRemMode, imgQuant, plugins}
 * @param {function} cback
 * @param {function} cerr
 */
export function handleCss (stylesheetPath, mode, cback, cerr) {
  let pathObj = path.parse(stylesheetPath);
  let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
  existsFloder(basePath, path.join(basePath, '/dist/css/'));
  let plugins = [];
  mode.plugins.forEach((val) => {
    switch (val) {
      case 'cssnext':
        plugins.push(cssnext({
          features: {
            autoprefixer: false,
            rem: false
          }
        }));
        break;
      case 'autoprefixer':
        plugins.push(autoprefixer('last 6 versions'));
        break;
      case '@import':
        plugins.push(atImport);
        break;
      case 'cssnano':
        plugins.push(cssnano);
        break;
      default:
        break;
    }
  });

  let promise = new Promise((resolve, reject) => {
    sprites(stylesheetPath, mode, resolve, reject);
  });
  promise.then(css => {
    postcss(plugins)
      .process(css, {
        from: stylesheetPath,
        to: basePath + '/dist/css/' + pathObj.base
      })
      .then(result => {
        fs.writeFile(path.join(basePath, '/dist/css/', pathObj.base), result.css, 'utf8', (err) => {
          if (err) {
            cerr({txt: err.toString(), type: 'fail'});
          } else {
            console.log('hello');
            cback({txt: `成功处理：${stylesheetPath}`, type: 'succ'});
          }
        });
      });
  }, error => {
    cerr({txt: error.toString(), type: 'fail'});
  });
}

/**
 * 操作html
 *
 * @param {string} htmlPath
 * @param {function} cback
 * @param {function} cerr
 */
export function handleHtml (htmlPath, cback, cerr) {
  let pathObj = path.parse(htmlPath);
  let basePath = pathObj.dir;
  existsFloder(basePath, htmlPath);
  fs.readFile(htmlPath, function (err, data) {
    if (err) {
      cerr({txt: err.toString(), type: 'fail'});
    } else {
      let html = data;
      fs.writeFile(path.join(basePath, '/dist/', pathObj.base), html.toString(), function (err) {
        if (err) {
          cerr({txt: err.toString(), type: 'fail'});
        } else {
          cback({txt: `成功处理：${path.join(basePath, '/dist/', pathObj.base)}`, type: 'succ'});
        }
      });
    }
  });
}

/**
 * 操作图片
 *
 * @param {string} imagePath
 * @param {boolen} imgQuant
 * @param {function} cback
 * @param {function} cerr
 */
export function handleImage (imagePath, imgQuant, cback, cerr) {
  let pathObj = path.parse(imagePath);
  let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
  let outputPath = pathObj.dir.split(path.sep);
  outputPath.splice(-1, 0, 'dist');
  outputPath = outputPath.join(path.sep);
  // 创建本地文件夹
  existsFloder(basePath, outputPath);
  if (imgQuant) {
    imagemin([imagePath], path.join(outputPath), {
      plugins: [
        imageminMozjpeg({
          quality: '100'
        }),
        imageminGifsicle(),
        imageminPngquant({
          floyd: 1,
          quality: '100'
        })
      ]
    }).then(() => {
      cback({txt: `成功处理：${imagePath}`, type: 'succ'});
    });
  } else {
    let input = fs.createReadStream(imagePath);
    let output = fs.createWriteStream(path.join(outputPath, pathObj.base));
    input.on('data', function (d) {
      output.write(d);
    });
    input.on('error', function (err) {
      cerr({txt: err.toString(), type: 'fail'});
    });
    input.on('end', function () {
      output.end();
      cback({txt: `成功处理：${path.join(outputPath, pathObj.base)}`, type: 'succ'});
    });
  }
  // return [{txt: `成功处理：${imagePath}`, type: 'succ'}];
}

/**
 * 判断文件夹是否存在
 *
 *@param {string} basePath
 *@param {string} url
 */
function existsFloder (basePath, url) {
  fs.exists(path.join(basePath, '/dist/'), function (ext) {
    if (!ext) {
      fs.mkdir(path.join(basePath, '/dist/'), function (err) {
        if (!err) {
          fs.exists(url, function (ext) {
            if (!ext) {
              fs.mkdir(url, function (err) {
                if (err) console.error(err);
              });
            }
          });
        }
      });
    } else {
      fs.exists(url, function (ext) {
        if (!ext) {
          fs.mkdir(url, function (err) {
            if (err) console.error(err);
          });
        }
      });
    }
  });
}
