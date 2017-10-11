'use strict';

/**
* 展示文件处理过程信息
*
* @param {string} log
* @param {string} type
*/
export default function(log, type) {

	if(type == 'success') {
		document.querySelector('.drag-log .succ').innerHTML += log;
	}else if(type == 'fail') {
		document.querySelector('.drag-log .fail').innerHTML += log;
	}else {
		document.querySelector('.drag-log .normal').innerHTML += log;
	}

}