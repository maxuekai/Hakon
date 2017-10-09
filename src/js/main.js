'use strict';

import dragDrop from './hp-drag';
import spriteCss from './hp-css-sprite';
import { handleCss, handleHtml, handleImage } from './hp-handlefile';
// const fs = global.require('fs');
// const postcss = global.require('postcss');
const sprites = global.require('postcss-sprites');
const path = global.require('path');
const autoprefixer = global.require('autoprefixer');
const cssnano = global.require('cssnano');

(function(){

	dragDrop(function(info){

		let isPc = false,
			plugins = [ autoprefixer, cssnano ],
			checkbox = document.querySelectorAll('input[type=checkbox]');

		for(let i = 0; i < checkbox.length; i++) {
			if(checkbox[i].checked) {
				let index;
				switch(checkbox[i].value) {
				case 'pc-module':
					isPc = true;
					break;
				case 'no-picnano':
					console.log('no-picnano');
					break;
				case 'no-autoprefixer':
					index = plugins.indexOf(autoprefixer);
					if(index){
						plugins.splice(index, 1);
					}
					break;
				case 'no-cssnano':
					index = plugins.indexOf(cssnano);
					if(index){
						plugins.splice(index, 1);
					}
					break;
				default:
					break;
				}
			}
		}
		console.log(info);
		let pathObj = path.parse(info[0].path);

		if(/css/.test(pathObj.ext)) {	// 传入 css 文件

			let basePath = pathObj.dir.split(path.sep).slice(0,-1).join(path.sep);
			let opts = spriteCss(basePath, isPc);
			plugins.push(sprites(opts));

			handleCss(info[0].path, plugins);

		}else if(/html/.test(pathObj.ext)) {	// 传入 html 文件

			handleHtml(info[0].path);

		}else {

			handleImage(info);

		}
		
	});

})();

/**
* 创建本地文件夹
*
* @param {string} basePath
*/
// function mkidrLocal(basePath) {
// 	fs.exists(path.join(basePath, '/dist/'), function(data) {
// 		if(!data) {
// 			fs.mkdir(path.join(basePath, '/dist/'), function(err){
// 				if(!err) {
// 					fs.mkdir(path.join(basePath, '/dist/img/'), function(err){
// 						if(err) console.log(err);
// 					});
// 					fs.mkdir(path.join(basePath, '/dist/css/'), function(err){
// 						if(err) console.log(err);
// 					});
// 				}
// 			});
// 		}
// 	});
// }