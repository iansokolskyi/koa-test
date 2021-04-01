const db = require('./db/db');
const validator = require('./validator');

async function profile(ctx) {
  const { userId } = ctx.request.params;
  const userResponse = await db.query(`SELECT * FROM "user" WHERE id = ${userId}`);
  const userInRedis = await ctx.redis.get(userId);

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

  const createUserResponse = await db.query(`INSERT INTO "user" (fname, lname, isActive) VALUES ('${body.fname}', '${body.lname}', ${body.active}) RETURNING *`);

  const user = { ...createUserResponse.rows[0] };

  await ctx.redis.set(user.id, JSON.stringify(user));

  ctx.status = 201;
  ctx.body = {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
  };
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
};
