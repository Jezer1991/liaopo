const mysql = require("mysql2");

const db = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: '6A2Ga3d562315H1GD5hcfDcdaGhFH-De',
    database: 'railway',
    port: 37108
});

module.exports = db;