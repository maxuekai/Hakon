'use strict';

const postcss = global.require('postcss');
const path = global.require('path');
/**
 * 配置 sprite 信息
 *
 * @param {string} stylesheetPath
 * @param {object} mode:{spriteRemMode, imgQuant}
 * @param {function} cb
 * @param {function} error
 */
function sprite (stylesheetPath, mode) {
  let pathObj = path.parse(stylesheetPath);
  let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
  let opts = {
    stylesheetPath: path.join(basePath, '/dist/css/'),
    spritePath: './dist/img',
    basePath: basePath,
    spritesmith: {
      padding: 2
    },
    filterBy: image => {
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

  return opts;
};
export default sprite;
