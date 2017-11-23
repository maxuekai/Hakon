'use strict';

import dragDrop from './hp-drag';
import { handleCss, handleHtml, handleImage } from './hp-handlefile';
const path = global.require('path');
const autoprefixer = global.require('autoprefixer');
const atImport = global.require('postcss-import');
const cssnano = global.require('cssnano');
const cssnext = global.require('postcss-cssnext');

(function() {

	// 获取用户所选选项
	let options = localStorage.getItem('options');
	if (options) {
		options.split(',').forEach(function(index) {
			document.querySelectorAll('.option')[index].checked = true;
		});
	}

	let mode = pluginsAssemble();

	document.addEventListener('click', function(event) {
		if (event.target.className == 'option') {
			mode = pluginsAssemble();
		}
	});

	// 处理拖拽事件
	dragDrop(function(file) {

		for(let i = 0; i < file.length; i++) {
			let pathObj = path.parse(file[i].path);
			console.log(pathObj);
			if (/css/.test(pathObj.ext)) { // 传入 css 文件
    
				handleCss(file[i].path, mode);
    
			} else if (/html/.test(pathObj.ext)) { // 传入 html 文件
    
				handleHtml(file[i].path);
    
			} else if(/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(pathObj.ext)) {
    
				handleImage(file, mode.imgQuant);
				return;
    
			}
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
	for (let i = 0; i < checkbox.length; i++) {
		if (checkbox[i].checked) {
			options.push(i);
			switch (checkbox[i].value) {
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
						autoprefixer: false,
						rem: false
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