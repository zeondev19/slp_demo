import { getPool } from '../lib/db.js';
import { withAuth } from '../lib/auth.js';
import { runCors } from '../lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.user.id;
    const pool = getPool();

    const [savedFilters] = await pool.execute(
      `SELECT id, name, filters, created_at
       FROM slp_saved_filters
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    // Parse filters JSON
    const parsed = savedFilters.map((row) => ({
      ...row,
      filters: typeof row.filters === 'string' ? JSON.parse(row.filters) : row.filters,
    }));

    return res.status(200).json({ savedFilters: parsed });
  } catch (err) {
    console.error('Saved filters error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
