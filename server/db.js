const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
let connection;
let pool;

/* const database = {
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
}; */

const database = {
    connect: () => {
        pool = mysql.createPool({
            connectionLimit: 10,
            host: process.env.DB_URL,
            port: process.env.DB_PORT,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.SCHEMA,
        });
    },
    query: (query, callback) => {
        pool.query(query, (error, results, fields) => {
            console.log('pooled');
            callback(error, results, fields);
        });
    },
    disconnect: () => connection.end(),
};

module.exports = database;
