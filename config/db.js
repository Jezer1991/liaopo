const mysql = require("mysql2");

const db = mysql.createPool({
    host: 'roundhouse.proxy.rlwy.net',
    user: 'root',
    password: 'dADhfeCdDcEBc2fcEhf5BDggFH2ge3-3',
    database: 'railway',
    port: 17956
});

/*const db = mysql.createPool({
    host: 'localhost',
    user: 'jezer',
    password: 'Jezer.Mysql.1991',
    database: 'opos',
    port: 3306
});*/


module.exports = db;