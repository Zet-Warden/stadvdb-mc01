const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let connection;

const database = {
    connect: () => {
        connection = mysql.createConnection({
            host: process.env.DB_URL,
            port: process.env.DB_PORT,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.SCHEMA,
        });
        connection.connect();
    },
    query: (query, callback) => {
        connection.query(query, function (error, results, fields) {
            callback(error, results, fields);
        });
    },
    disconnect: () => connection.end(),
};

module.exports = database;
