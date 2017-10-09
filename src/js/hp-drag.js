'use strict';

// const path = global.require('path');

export default function(cb) {

	// 取消默认行为
	document.addEventListener('drop', function(e){
		e.preventDefault();
	}, false);
	document.addEventListener('dragLeave', function(e){
		e.preventDefault();
	}, false);
	document.addEventListener('dragenter', function(e){
		e.preventDefault();
	}, false);
	document.addEventListener('dragover', function(e){
		e.preventDefault();
	}, false);

	let dropZone = document.querySelector('.drag-main');

	dropZone.addEventListener('dragover', function(e){
		e.preventDefault();
		this.classList.add('drop-hover');
	}, false);

	dropZone.addEventListener('dragleave', function(e){
		e.preventDefault();
		this.classList.remove('drop-hover');
	}, false);

	dropZone.addEventListener('drop', function(e){
		e.preventDefault();
		this.classList.remove('drop-hover');
		let fileInfo = e.dataTransfer.files;
		cb(fileInfo);
	}, false);

}

/**
* 处理文件信息
*
* @param {Object} fileInfo
*/
// function handleFile(fileInfo, cb) {
// 	cb();
// }