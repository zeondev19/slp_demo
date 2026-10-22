import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    if (!process.env.MYSQL_HOST) {
      throw new Error('Database configuration missing: MYSQL_HOST is not set in environment variables.');
    }

    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 5000,
      ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}
