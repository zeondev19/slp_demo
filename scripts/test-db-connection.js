import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k) process.env[k.trim()] = v.join('=').trim();
      }
    }
  }
}

loadEnv();

async function testConnection() {
  console.log('Testing connection to Rumahweb MySQL:');
  console.log('  Host:', process.env.MYSQL_HOST);
  console.log('  Port:', process.env.MYSQL_PORT || 3306);
  console.log('  User:', process.env.MYSQL_USER);
  console.log('  Database:', process.env.MYSQL_DATABASE);

  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      connectTimeout: 8000,
    });

    console.log('\n[SUCCESS] Connected to MySQL successfully!');

    const [rows] = await conn.execute('SELECT COUNT(*) AS total FROM slp_lessons');
    console.log(`[VERIFIED] Found ${rows[0].total} interactive lessons in the database!`);

    const [users] = await conn.execute('SELECT email, display_name FROM slp_users LIMIT 3');
    console.log('[USERS]:');
    users.forEach(u => console.log(`  - ${u.display_name} (${u.email})`));

    await conn.end();
  } catch (err) {
    console.error('\n[CONNECTION ERROR]:', err.message);
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.log('\nHINT: Rumahweb firewall might be blocking external connections.');
      console.log('Make sure you opened cPanel -> Remote MySQL and added "%" to the access list.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nHINT: Access denied. Please check your username and password in .env.');
    }
  }
}

testConnection();
