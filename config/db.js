const mysql = require("mysql2");

const db = mysql.createPool({
    host: 'localhost',
    user: 'jezer',
    password: 'Jezer.Mysql.1991',
    database: 'opos',
    port: 3306
});

module.exports = db;