//importing pg-promise
const pgp = require("pg-promise")();

//creating connection string
const connection = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const db = pgp(connection);

module.exports = db;