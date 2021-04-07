const crypto = require('crypto');
const passport = require('koa-passport');
const jwt = require('jwt-simple');

const db = require('./db/db');
const validator = require('./validator');
const { UserDB } = require('./models/user/User');

async function profile(ctx) {
  ctx.body = {
    user: ctx.state.user,
  };
}

async function refresh(ctx) {
  const token = ctx.headers.authorization.split(' ')[1];
  const decodedToken = jwt.decode(token, 'super_secret_refresh');

  if (decodedToken.expiresIn <= new Date().getTime()) {
    const error = new Error('Refresh token expired, please sign in into your account.');
    error.status = 400;

    throw error;
  }

  const user = await UserDB.getUserByEmail(decodedToken.email);

  const accessToken = {
    id: user.id,
    expiresIn: new Date().setTime(new Date().getTime() + 200000),
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

async function createUser(ctx) {
  const { body } = ctx.request;

  await validator.schema.validateAsync(body);

  // use salt stored in config
  body.password = crypto.pbkdf2Sync(body.password, 'salt', 100000, 64, 'sha256').toString('hex');

  const createUserResponse = await db.query(`INSERT INTO "user" (fname, lname, isActive, password, email) 
      VALUES ('${body.fname}', '${body.lname}', ${body.active}, '${body.password}', '${body.email}') RETURNING *`)
    .catch((err) => {
      if (err.constraint === 'user_email') throw new Error('User with the same email already exists');
      throw new Error(err.message);
    });

  const user = { ...createUserResponse.rows[0] };

  ctx.status = 201;
  ctx.body = {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
    email: user.email,
  };
}

async function signIn(ctx, next) {
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

async function userList(ctx) {
  const userListResponse = await db.query('SELECT * FROM "user"');

  const users = userListResponse.rows;

  ctx.body = {
    users,
  };
}

module.exports = {
  profile,
  refresh,
  createUser,
  userList,
  signIn,
};
