const mysql = require('mysql2');
const config = require('./config');

const db = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    port: config.DB_PORT,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE
});

module.exports = db;