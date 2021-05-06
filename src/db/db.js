const { Pool } = require('pg');

class Database {
  constructor() {
    // this.config = {
    //   user: 'empty-user',
    //   host: 'localhost',
    //   database: 'nothing',
    //   password: 'testpass',
    //   port: 5432,
    // };

    this.config = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: 5432,
    };

    this.pool = new Pool(this.config);
  }

  query(sql) {
    return this.pool.query(sql);
  }

  close() {
    this.pool.end();
  }
}

module.exports = new Database();
