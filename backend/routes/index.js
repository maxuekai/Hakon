const Router = require('koa-router');

const user = require('../controls/user');
const mod = require('../controls/modules');

const router = new Router();

router.post('/register', user.register);

router.post('/login', user.login);

router.post('/uploadCode', mod.upload);

router.get('/getAllModules', mod.getAllModules);

router.get('/getModule', mod.getModule);

module.exports = router;
