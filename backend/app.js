const Koa = require('koa');
const cors = require('koa2-cors');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const mongoose = require('mongoose');
const router = require('./routes');
const app = new Koa();

app.use(cors({
  origin: 'http://127.0.0.1:8080',
  headers: '*',
  Methods: '*'
}));
app.use(bodyparser());
app.use(logger());
app.use(router.routes());

mongoose.connect('mongodb://127.0.0.1:27017/hakon');
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;