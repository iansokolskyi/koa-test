const Router = require('koa-router');

const controllers = require('./controller');

const router = new Router();

router.get('user/:userId', controllers.profile);
router.post('user', controllers.createUser);

module.exports = {
  router,
};
