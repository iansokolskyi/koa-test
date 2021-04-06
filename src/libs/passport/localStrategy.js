const LocalStrategy = require('passport-local');

const { User } = require('../../models/user/User');

const opts = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
};

module.exports = new LocalStrategy(opts, (req, email, password, done) => {
  User.checkPassword(email, password).then((checkPasswordResponse) => {
    if (!checkPasswordResponse.flag) {
      return done(checkPasswordResponse.message, false);
    }

    return done(null, checkPasswordResponse.user);
  }).catch((err) => done(err.message, false));
});
