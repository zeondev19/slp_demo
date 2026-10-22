import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  // If PHP Bridge is configured, route queries over HTTPS to avoid firewall blocks
  if (process.env.MYSQL_BRIDGE_URL) {
    return {
      async execute(sql, params = []) {
        const secret = process.env.MYSQL_BRIDGE_SECRET || 'slp-curriculum-secure-bridge-2026';
        const bridgeUrl = process.env.MYSQL_BRIDGE_URL.trim();

        const res = await fetch(bridgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Bridge-Secret': secret,
          },
          body: JSON.stringify({ sql, params }),
        });

        const rawText = await res.text().catch(() => '');
        let data;
        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error(`Bridge response invalid (${res.status}): ${rawText.slice(0, 150)}`);
        }

        if (!res.ok || data.status === 'error') {
          throw new Error(data.error || data.message || `Database query error via bridge (${res.status})`);
        }

        const meta = {
          insertId: data.insertId || 0,
          affectedRows: data.affectedRows || 0,
        };

        return [data.rows || [], meta];
      },
    };
  }

  // Fallback to direct TCP connection
  if (!pool) {
    if (!process.env.MYSQL_HOST) {
      throw new Error('Database configuration missing: Neither MYSQL_BRIDGE_URL nor MYSQL_HOST is set.');
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
