'use strict';

const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');


export default function(file) {
	
	console.log(file);
	fs.readFile(file, (err, css) => {
		postcss([ autoprefixer ])
			.process(css, { from: file, to: 'C:/Users/xuekaima/index.css' })
			.then(result => {
				fs.writeFile('C:/Users/xuekaima/index.css', result.css);
				if(result.map)
					fs.writeFile('C:/Users/xuekaima/index.css.map', result.map);
				// console.log(result);
			});
	});

}