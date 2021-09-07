//importing pg-promise
const pgpromise = require("pg-promise")();

//creating connection string
const connection = `postgresql://${process.env.USER}:${process.env.PASSWD}@${HOST}:5433/${process.env.DATABASE}`;

const db = pgp(connection);

module.exports = db;