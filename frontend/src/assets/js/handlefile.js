'use strict';

import spriteOpt from './sprite';
const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const imagemin = require('imagemin');
const imageminMozjpeg = global.require('imagemin-mozjpeg');
const imageminPngquant = global.require('imagemin-pngquant');
const imageminGifsicle = global.require('imagemin-gifsicle');
const autoprefixer = global.require('autoprefixer');
const atImport = global.require('postcss-import');
const cssnano = global.require('cssnano');
const cssnext = global.require('postcss-cssnext');
const sprites = global.require('postcss-sprites');

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
  let targetPath = `${path.resolve(pathObj.dir, '../dist/css')}/${pathObj.base}`;
  let plugins = [sprites(spriteOpt(stylesheetPath, mode))];
  mode.plugins.forEach((val) => {
    switch (val) {
      case 'cssnext':
        plugins.push(cssnext({
          features: {
            colorHexAlpha: false,
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
        plugins.push(cssnano({
          reduceIdents: false,
          safe: true
        }));
        break;
      default:
        break;
    }
  });

  fs.readFile(stylesheetPath, 'utf-8', (err, css) => {
    if (err) {
      cerr({txt: err.toString(), type: 'fail'});
    } else {
      postcss(plugins)
        .process(css, {
          from: stylesheetPath,
          to: targetPath
        })
        .then(result => {
          fs.ensureFile(targetPath)
            .then(() => {
              fs.writeFile(targetPath, result.css, 'utf8', err => {
                if (err) {
                  cerr({txt: err.toString(), type: 'fail'});
                } else {
                  cback({txt: `成功处理：${stylesheetPath}`, type: 'succ'});
                }
              });
            })
            .catch(err => {
              cerr({txt: err.toString(), type: 'fail'});
            });
        });
    }
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
  let targetPath = `${path.resolve(pathObj.dir, 'dist')}\\${pathObj.base}`;
  fs.readFile(htmlPath, function (err, data) {
    if (err) {
      cerr({txt: err.toString(), type: 'fail'});
    } else {
      fs.ensureFile(targetPath)
        .then(() => {
          fs.writeFile(targetPath, data.toString(), function (err) {
            if (err) {
              cerr({txt: err.toString(), type: 'fail'});
            } else {
              cback({txt: `成功处理：${targetPath}`, type: 'succ'});
            }
          });
        })
        .catch(err => {
          cerr({txt: err.toString(), type: 'fail'});
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
  let targetArr = pathObj.dir.split(path.sep);
  targetArr.splice(-1, 0, 'dist');
  let targetPath = `${targetArr.join(path.sep)}${path.sep}${pathObj.base}`;
  fs.ensureFile(targetPath)
    .then(() => {
      if (imgQuant) {
        imagemin([imagePath], targetPath, {
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
        let output = fs.createWriteStream(targetPath);
        input.on('data', function (d) {
          output.write(d);
        });
        input.on('error', function (err) {
          cerr({txt: err.toString(), type: 'fail'});
        });
        input.on('end', function () {
          output.end();
          cback({txt: `成功处理：${targetPath}`, type: 'succ'});
        });
      }
    })
    .catch(err => {
      cerr({txt: err.toString(), type: 'fail'});
    });
}
