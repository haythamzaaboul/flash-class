import mysql from 'mysql2/promise';
import config from '../config/config.js';

export const dbPool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
    waitForConnections: true,
    connectionLimit: 10,// To be changed in production
    queueLimit: 0
});