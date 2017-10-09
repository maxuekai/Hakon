'use strict';

const postcss = global.require('postcss');
const path = global.require('path');

export default function(basePath, isPc) {

	let opts = {
		stylesheetPath: path.join(basePath, '/dist/css/'),
		spritePath: './dist/img',
		basePath: basePath,
		spritesmith: {
			padding: 0,
			// algorithm: 'top-down'
		},
		filterBy: function(image) {
			// console.log(image);
			if(!~image.url.indexOf('/slice/')) {
				return Promise.reject();
			}
			return Promise.resolve();
		},
		groupBy: function(image) {
			let name = /\/slice\/([0-9.A-Za-z]+)\//.exec(image.url);
			if(!name){
				return Promise.reject(new Error('Not a shape image'));
			}
			return Promise.resolve(name[1]);
		},
		hooks: {
			onUpdateRule: function(rule, token, image) {
				['width', 'height'].forEach(function(prop){
					let value = image.coords[prop];
					if(image.retina) {
						value /= image.ratio;
					}
					rule.insertAfter(rule.last, postcss.decl({
						prop: prop,
						value: value + 'px'
					}));
				});

				let backgroundSize, backgroundPosition;

				if(!isPc) {

					let backgroundSizeX = (image.spriteWidth / image.coords.width) * 100,
						backgroundSizeY = (image.spriteHeight / image.coords.height) * 100,
						backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100,
						backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

					backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
					backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
					backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
					backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

					backgroundSize = postcss.decl({
						prop: 'background-size',
						value: backgroundSizeX + '% ' + backgroundSizeY + '%'
					});

					backgroundPosition = postcss.decl({
						prop: 'background-position',
						value: backgroundPositionX + '% ' + backgroundPositionY + '%'
					});

				}else {

					let backgroundPositionX = -image.coords.x,
						backgroundPositionY = -image.coords.y;

					backgroundSize = postcss.decl({
						prop: 'background-size',
						value: 'auto'
					});

					backgroundPosition = postcss.decl({
						prop: 'background-position',
						value: backgroundPositionX + 'px ' + backgroundPositionY + 'px'
					});

				}

				let backgroundImage = postcss.decl({
					prop: 'background-image',
					value: 'url(' + image.spriteUrl + ')'
				});

				let backgroundRepeat = postcss.decl({
					prop: 'background-repeat',
					value: 'no-repeat'
				});

				rule.insertAfter(token, backgroundImage);
				rule.insertAfter(backgroundImage, backgroundPosition);
				rule.insertAfter(backgroundPosition, backgroundSize);
				rule.insertAfter(backgroundPosition, backgroundRepeat);

				
			},
			onSaveSpritesheet: function(opts, spritesheet) {
				let filenameChunks = spritesheet.groups.concat(spritesheet.extension);
				if(filenameChunks.length > 1)
					return path.join(basePath, opts.spritePath, 'spr-' + filenameChunks[0] + '.' + filenameChunks[1]);
				else
					return path.join(basePath, opts.spritePath, 'spr' + '.' + filenameChunks[0]);
			}
		}
	};

	return opts;
	
}

