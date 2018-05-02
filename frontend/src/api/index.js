
import axios from 'axios';

const URL = 'http://127.0.0.1:3600';

axios.defaults.baseURL = URL;
axios.defaults.withCredentials = true;

export function login (name, password) {
  return axios.post('/api/inline/user/login', {
    name: name,
    password: password
  });
}

export function register (name, password) {
  return axios.post('/api/inline/user/register', {
    name: name,
    password: password
  });
}

export function checkLogin () {
  return axios.post('/api/inline/user/checkLogin');
}

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

export function getAllModules () {
  return axios.get('/api/inline/module/getAllModules');
}

export function getModule (_id) {
  return axios.get(`/api/inline/module/getModule?_id=${_id}`);
}

export function deleteModule (_id) {
  return axios.post('/api/inline/module/deleteModule', {
    _id: _id
  });
}

export function getAllCategory () {
  return axios.get('/api/inline/module/getAllCategory');
}
