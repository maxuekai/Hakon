'use strict';

import dragDrop from './hp-drag';
import spriteCss from './hp-css-sprite';
import { handleCss, handleHtml, handleImage } from './hp-handlefile';
// const fs = global.require('fs');
// const postcss = global.require('postcss');
const sprites = global.require('postcss-sprites');
const path = global.require('path');
const autoprefixer = global.require('autoprefixer');
const atImport = global.require('postcss-import');
const cssnano = global.require('cssnano');

(function(){

	dragDrop(function(info){

		let spriteMode = '',
			plugins = [ atImport, autoprefixer, cssnano ],
			checkbox = document.querySelectorAll('.menu-options input[type=checkbox]');

		for(let i = 0; i < checkbox.length; i++) {
			if(checkbox[i].checked) {
				let index;
				switch(checkbox[i].value) {
				case 'pc':
					spriteMode = 'pc';
					break;
				case 'rem':
					spriteMode = 'rem';
					break;
				case 'no-picnano':
					console.log('no-picnano');
					break;
				case 'no-autoprefixer':
					index = plugins.indexOf(autoprefixer);
					break;
				case 'no-cssnano':
					index = plugins.indexOf(cssnano);
					break;
				case '@import':
					index = plugins.indexOf(atImport);
					break;
				default:
					index = null;
					break;
				}
				if(index >= 0){
					plugins.splice(index, 1);
				}
			}
		}

		let pathObj = path.parse(info[0].path);

		if(/css/.test(pathObj.ext)) {	// 传入 css 文件

			let basePath = pathObj.dir.split(path.sep).slice(0,-1).join(path.sep);
			let opts = spriteCss(basePath, spriteMode);
			plugins.unshift(sprites(opts));
			handleCss(info[0].path, plugins);

		}else if(/html/.test(pathObj.ext)) {	// 传入 html 文件

			handleHtml(info[0].path);

		}else {

			handleImage(info);

		}
		
	});

})();
