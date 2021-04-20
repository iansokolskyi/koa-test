const Router = require('koa-joi-router');
const passport = require('koa-passport');

const { UsersController } = require('./users.controller');
const UserValidator = require('./users.validator');

const router = new Router();

router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.profile);
router.get('/refresh/token', UsersController.refresh);
router.post('/', UserValidator.signUp, UsersController.createUser);
router.post('/sign-in', UserValidator.signIn, UsersController.signIn);
router.get('/', passport.authenticate('jwt', { session: false }), UsersController.userList);
router.put('/photo', passport.authenticate('jwt', { session: false }), UsersController.updatePhoto);

module.exports = router;
