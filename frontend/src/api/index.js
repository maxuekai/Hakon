/**
 * ajax 请求方法
 * 参数为传值数据
 */
import axios from 'axios';

const URL = 'http://127.0.0.1:3600';

axios.defaults.baseURL = URL;
axios.defaults.withCredentials = true;

/**
 * 登录
 * @param {string} name
 * @param {string} password
 */
export function login (name, password) {
  return axios.post('/api/inline/user/login', {
    name: name,
    password: password
  });
}

/**
 * 注册
 * @param {string} name
 * @param {string} password
 */
export function register (name, password) {
  return axios.post('/api/inline/user/register', {
    name: name,
    password: password
  });
}

/**
 * 检查登录状态,用于自动登录
 */
export function checkLogin () {
  return axios.post('/api/inline/user/checkLogin');
}

/**
 * 上传代码
 * @param {string} name
 * @param {string} html
 * @param {string} css
 * @param {string} js
 * @param {string} category
 * @param {string} author
 */
export function uploadCode (name, html, css, js, category, author) {
  return axios.post('/api/inline/module/uploadCode', {
    name: name,
    html: html,
    css: css,
    js: js,
    category: category,
    author: author
  });
}

/**
 * 更新代码
 * @param {string} _id
 * @param {string} name
 * @param {string} html
 * @param {string} css
 * @param {string} js
 * @param {string} category
 */
export function updateCode (_id, name, html, css, js, category) {
  return axios.post('/api/inline/module/updateCode', {
    _id: _id,
    name: name,
    html: html,
    css: css,
    js: js,
    category: category
  });
}

/**
 * 获取所有的模块代码
 */
export function getAllModules () {
  return axios.get('/api/inline/module/getAllModules');
}

/**
 * 获取某个模块代码
 * @param {string} _id
 */
export function getModule (_id) {
  return axios.get(`/api/inline/module/getModule?_id=${_id}`);
}

/**
 * 删除某个模块代码
 * @param {string} _id
 */
export function deleteModule (_id) {
  return axios.post('/api/inline/module/deleteModule', {
    _id: _id
  });
}

/**
 * 获取所有类别
 */
export function getAllCategory () {
  return axios.get('/api/inline/module/getAllCategory');
}
