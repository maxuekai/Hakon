'use strict';

import dragDrop from './hp-drag';
import spriteCss from './hp-css-sprite';
import { handleCss, handleHtml, handleImage } from './hp-handlefile';
const sprites = global.require('postcss-sprites');
const path = global.require('path');
const autoprefixer = global.require('autoprefixer');
const atImport = global.require('postcss-import');
const cssnano = global.require('cssnano');
const cssnext = global.require('postcss-cssnext');

(function(){

	// 获取用户所选选项
	let options = localStorage.getItem('options');
	if(options) {
		options.split(',').forEach(function(index) {
			document.querySelectorAll('.option')[index].checked = true;
		});
	}

	let mode = pluginsAssemble();

	document.addEventListener('click', function(event){
		if(event.target.className == 'option') {
			mode = pluginsAssemble();
		}
	});

	dragDrop(function(file){

		
		let pathObj = path.parse(file[0].path);

		if(/css/.test(pathObj.ext)) {	// 传入 css 文件

			let basePath = pathObj.dir.split(path.sep).slice(0,-1).join(path.sep);
			let opts = spriteCss(basePath, mode.spriteMode);
			mode.plugins.unshift(sprites(opts));
			handleCss(file[0].path, mode.plugins);

		}else if(/html/.test(pathObj.ext)) {	// 传入 html 文件

			handleHtml(file[0].path);

		}else {

			handleImage(file, mode.imgQuant);

		}
		
	});

})();

/**
* 按需配置插件,并保存用户所选选项
*
*/
function pluginsAssemble() {

	let checkbox = document.querySelectorAll('.menu-options .option');
	let mode = {
		spriteMode: 'pc',
		imgQuant: false,
		plugins: []
	};
	let options = [];
	for(let i = 0; i < checkbox.length; i++) {
		if(checkbox[i].checked) {
			options.push(i);
			switch(checkbox[i].value) {
			case 'pc':
				mode.spriteMode = 'pc';
				break;
			case 'rem':
				mode.spriteMode = 'rem';
				break;
			case 'picnano':
				mode.imgQuant = true;
				break;
			case 'cssnext':
				mode.plugins.push(cssnext({
					features: {
						autoprefixer: false
					}
				}));
				break;
			case 'autoprefixer':
				mode.plugins.push(autoprefixer('last 6 versions'));
				break;
			case '@import':
				mode.plugins.push(atImport);
				break;
			case 'cssnano':
				mode.plugins.push(cssnano);
				break;
			default:
				break;
			}
		}
	}
	localStorage.setItem('options', options);
	return mode;

}