const passport = require('koa-passport');
const jwt = require('jwt-simple');

const { UserDB } = require('./models/UserDB');
const AWSS3 = require('../utils/uploadS3');

class UsersController {
  static async signIn(ctx, next) {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        ctx.body = user;
      } else {
        ctx.status = 400;
        if (err) {
          ctx.body = { error: err };
        }
      }
    })(ctx, next);
  }

  static async profile(ctx) {
    ctx.body = {
      user: ctx.state.user,
    };
  }

  static async createUser(ctx) {
    const {
      fname, lname, password, email, active,
    } = ctx.request.body;

    ctx.status = 201;
    ctx.body = (await UserDB.createUser(fname, lname, active, password, email)).getInfo();
  }

  static async refresh(ctx) {
    const token = ctx.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token, 'super_secret_refresh');

    if (decodedToken.expiresIn <= new Date().getTime()) {
      const error = new Error('Refresh token expired, please sign in into your account.');
      error.status = 400;

      throw error;
    }

    const user = await UserDB.getUserByEmail(decodedToken.email);

    const accessToken = {
      id: user.getId(),
      expiresIn: new Date().setTime(new Date().getTime() + 2000000),
    };
    const refreshToken = {
      email: user.email,
      expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    ctx.body = {
      accessToken: jwt.encode(accessToken, 'super_secret'),
      accessTokenExpirationDate: accessToken.expiresIn,
      refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
      refreshTokenExpirationDate: refreshToken.expiresIn,
    };
  }

  static async userList(ctx) {
    const users = (await UserDB.userList()).map((user) => user.getInfo());

    ctx.body = {
      users,
    };
  }

  static async updatePhoto(ctx) {
    const photoUrl = await AWSS3.uploadS3(ctx.request.body.photo, 'users', `photos_${ctx.state.user.email}`);

    await UserDB.updateUserPhoto(photoUrl, ctx.state.user.email);
    ctx.body = { photoUrl };
  }
}

module.exports = { UsersController };
