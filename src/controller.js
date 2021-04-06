const crypto = require('crypto');
const passport = require('koa-passport');

const db = require('./db/db');
const validator = require('./validator');

async function profile(ctx) {
  const { userId } = ctx.request.params;
  const userResponse = await db.query(`SELECT * FROM "user" WHERE id = ${userId}`);

  if (!userResponse.rowCount) {
    ctx.throw(400, 'User doesn`t exist');
  }

  const user = userResponse.rows[0];
  ctx.body = {
    user,
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
  createUser,
  userList,
  signIn,
};
