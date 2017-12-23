const Router = require('koa-router');

const user = require('../controls/user');

const router = new Router();

router.post('/register', function (ctx, next) {
  let data = ctx.request.query;
  user.register(data.name, data.pwd);
  ctx.body = {code: '200', txt: 'success'};
});

router.get('/login', function (ctx, next) {
  let data = ctx.request.query;
  user.login(data.name, data.pwd);
  ctx.body = {code:'200'};
});

module.exports = router;
