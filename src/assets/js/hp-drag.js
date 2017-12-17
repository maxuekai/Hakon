'use strict';

// const path = global.require('path');
/**
 * 处理拖拽事件
 *
 * @param {function} cb
 */
export default function (cb) {
  // 取消默认行为
  document.addEventListener('drop', function (e) {
    e.preventDefault();
  }, false);
  document.addEventListener('dragLeave', function (e) {
    e.preventDefault();
  }, false);
  document.addEventListener('dragenter', function (e) {
    e.preventDefault();
  }, false);
  document.addEventListener('dragover', function (e) {
    e.preventDefault();
  }, false);

  let dropZone = document.querySelector('.drag-main');

  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.classList.add('drop-hover');
  }, false);

  dropZone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    // this.classList.remove('drop-hover');
  }, false);

  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    this.classList.remove('drop-hover');
    let p = document.querySelectorAll('.drag-log p');
    for (let i = 0; i < p.length; i++) {
      p[i].innerHTML = '';
    }
    let fileInfo = e.dataTransfer.files;
    cb(fileInfo);
  }, false);
}