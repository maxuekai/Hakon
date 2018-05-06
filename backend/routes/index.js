const Router = require('koa-router');

const user = require('../controls/user');
const mod = require('../controls/modules');

const router = new Router();

router.post('/api/inline/user/register', user.register);

router.post('/api/inline/user/login', user.login);

router.post('/api/inline/user/checkLogin', user.checkLogin);

router.post('/api/inline/module/uploadCode', mod.uploadCode);

router.post('/api/inline/module/updateCode', mod.updateCode);

router.get('/api/inline/module/getAllModules', mod.getAllModules);

router.get('/api/inline/module/getModule', mod.getModule);

router.post('/api/inline/module/deleteModule', mod.deleteModule);

router.get('/api/inline/module/getAllCategory', mod.getAllCategory);

module.exports = router;
