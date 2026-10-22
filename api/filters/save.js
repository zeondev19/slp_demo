import { getPool } from '../lib/db.js';
import { withAuth } from '../lib/auth.js';
import { runCors } from '../lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.user.id;
    const { name, filters } = req.body || {};

    if (!name || !filters) {
      return res.status(400).json({ error: 'name and filters are required.' });
    }

    const pool = getPool();

    const filtersJSON = typeof filters === 'string' ? filters : JSON.stringify(filters);

    const [result] = await pool.execute(
      'INSERT INTO slp_saved_filters (user_id, name, filters, created_at) VALUES (?, ?, ?, NOW())',
      [userId, name, filtersJSON]
    );

    return res.status(201).json({
      savedFilter: {
        id: result.insertId,
        name,
        filters: typeof filters === 'string' ? JSON.parse(filters) : filters,
      },
    });
  } catch (err) {
    console.error('Save filter error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
