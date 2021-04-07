const Router = require('koa-router');
const passport = require('koa-passport');

const controllers = require('./controller');

const router = new Router();

router.get('profile', passport.authenticate('jwt', { session: false }), controllers.profile);
router.get('refresh', controllers.refresh);
router.post('user', controllers.createUser);
router.post('sign-in', controllers.signIn);
router.get('users', controllers.userList);

module.exports = {
  router,
};
