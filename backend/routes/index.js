const Router = require('koa-router');

const user = require('../controls/user');
const mod = require('../controls/modules');

const router = new Router();

router.post('/api/inline/user/register', user.register);

router.post('/api/inline/user/login', user.login);

router.post('/api/inline/module/uploadCode', mod.upload);

router.get('/api/inline/module/getAllModules', mod.getAllModules);

router.get('/api/inline/module/getModule', mod.getModule);

module.exports = router;
