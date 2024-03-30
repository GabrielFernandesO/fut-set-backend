require('dotenv').config();

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: `${process.env.HOST_DB}`,
      port: process.env.PORT_DB,
      user: `${process.env.USER_DB}`,
      password: `${process.env.PASSWORD_DB}`,
      database: 'railway',
    },
  });

  module.exports = knex