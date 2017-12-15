'use strict';

const postcss = global.require('postcss');
const sprites = global.require('postcss-sprites');
const path = global.require('path');
const fs = global.require('fs');
const imagemin = global.require('imagemin');
const imageminPngquant = global.require('imagemin-pngquant');
/**
 * 配置 sprite 信息
 *
 * @param {string} stylesheetPath
 * @param {object} mode:{spriteRemMode, imgQuant}
 * @param {function} cb
 * @param {function} error
 */
export default function (stylesheetPath, mode, cb, error) {
  let pathObj = path.parse(stylesheetPath);
  let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
  let opts = {
    stylesheetPath: path.join(basePath, '/dist/css/'),
    spritePath: './dist/img',
    basePath: basePath,
    spritesmith: {
      padding: 5
      // algorithm: 'top-down'
    },
    filterBy: image => {
      // console.log(image);
      if (!~image.url.indexOf('/slice/')) {
        return Promise.reject(new Error('error'));
      }
      return Promise.resolve();
    },
    groupBy: image => {
      let name = /\/slice\/([0-9.A-Za-z]+)\//.exec(image.url);
      if (!name) {
        return Promise.reject(new Error('Not a shape image'));
      }
      return Promise.resolve(name[1]);
    },
    hooks: {
      onUpdateRule: (rule, token, image) => {
        let backgroundSize, backgroundPosition;
        if (mode.spriteRemMode) {
          let backgroundPositionX = -(image.coords.x / 100);
          let backgroundPositionY = -(image.coords.y / 100);

          backgroundSize = postcss.decl({
            prop: 'background-size',
            value: `${(image.spriteWidth / 100)}rem auto`
          });

          backgroundPosition = postcss.decl({
            prop: 'background-position',
            value: `${backgroundPositionX}rem ${backgroundPositionY}rem`
          });
        } else {
          let backgroundPositionX = -image.coords.x;
          let backgroundPositionY = -image.coords.y;
          backgroundPosition = postcss.decl({
            prop: 'background-position',
            value: `${backgroundPositionX}px ${backgroundPositionY}px`
          });
        }

        let timestamp = new Date().getTime();
        let backgroundImage = postcss.decl({
          prop: 'background-image',
          value: `url(${image.spriteUrl}?${timestamp})`
        });

        let backgroundRepeat = postcss.decl({
          prop: 'background-repeat',
          value: 'no-repeat'
        });

        rule.insertAfter(token, backgroundImage);
        rule.insertAfter(backgroundImage, backgroundPosition);
        if (mode.spriteRemMode) {
          rule.insertAfter(backgroundPosition, backgroundSize);
        }
        rule.insertAfter(backgroundPosition, backgroundRepeat);
      },
      onSaveSpritesheet: (opts, spritesheet) => {
        let filenameChunks = spritesheet.groups.concat(spritesheet.extension);
        if (filenameChunks.length > 1) {
          return path.join(basePath, opts.spritePath, 'spr-' + filenameChunks[0] + '.' + filenameChunks[1]);
        } else {
          return path.join(basePath, opts.spritePath, 'spr' + '.' + filenameChunks[0]);
        }
      }
    }
  };

  fs.readFile(stylesheetPath, 'utf-8', (err, css) => {
    if (err) {
      error(err);
    } else {
      // 处理雪碧图
      postcss([sprites(opts)])
        .process(css, {
          from: stylesheetPath,
          to: basePath + '/dist/css/' + pathObj.base
        })
        .then(result => {
          if (mode.imgQuant) {
            // 压缩雪碧图
            imagemin([path.join(basePath, '/dist/img/spr*.png')], path.join(basePath, '/dist/img/'), {
              plugins: [
                imageminPngquant({
                  quality: '100'
                })
              ]
            }).then(() => {
              cb(result.css);
            });
          } else {
            cb(result.css);
          }
        });
    }
  });
}
