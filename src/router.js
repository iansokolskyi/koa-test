const Router = require('koa-router');

const controllers = require('./controller');

const router = new Router();

router.get('user/:userId', controllers.profile);
router.post('user', controllers.createUser);
router.post('sign-in', controllers.signIn);
router.get('users', controllers.userList);

module.exports = {
  router,
};
