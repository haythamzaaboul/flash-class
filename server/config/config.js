import dotenv from 'dotenv';
import { json } from 'express';


dotenv.config();

const config = {
    env : process.env.NODE_ENV || 'development',
    port : process.env.PORT || 3000, // Server port
    dbPort: process.env.DB_PORT || 3306,  // Database port
    dbHost : process.env.DB_HOST || 'localhost',
    dbUser : process.env.DB_USER,
    dbPassword : process.env.DB_PASSWORD,
    dbName : process.env.DB_NAME,
    jsonWebTokenAccessSecret : process.env.JSONACCESS_TOKEN,
    jsonWebTokenRefreshSecret : process.env.JSONREFRESH_TOKEN,
}

export default config;