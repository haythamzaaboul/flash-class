// server/loaders/mysqlLoader.js
import { dbPool } from '../DB/db.js';

export async function initMySql() {
  try {
    const connection = await dbPool.getConnection();
    console.log('Connected to MySQL database!');
    connection.release();
  } catch (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
}
export default initMySql();