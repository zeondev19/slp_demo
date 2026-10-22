import { getPool } from './lib/db.js';
import { withAuth } from './lib/auth.js';
import { runCors } from './lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.user.id;
    const { lesson_id } = req.body || {};

    if (!lesson_id) {
      return res.status(400).json({ error: 'lesson_id is required.' });
    }

    const pool = getPool();

    // Check if progress record exists
    const [existing] = await pool.execute(
      'SELECT id, times_opened FROM slp_user_progress WHERE user_id = ? AND lesson_id = ? LIMIT 1',
      [userId, lesson_id]
    );

    if (existing.length > 0) {
      // Update existing record
      await pool.execute(
        'UPDATE slp_user_progress SET last_opened_at = NOW(), times_opened = times_opened + 1 WHERE id = ?',
        [existing[0].id]
      );

      return res.status(200).json({
        message: 'Progress updated.',
        times_opened: existing[0].times_opened + 1,
      });
    }

    // Insert new progress record
    await pool.execute(
      'INSERT INTO slp_user_progress (user_id, lesson_id, last_opened_at, times_opened, completed, created_at) VALUES (?, ?, NOW(), 1, 0, NOW())',
      [userId, lesson_id]
    );

    return res.status(201).json({
      message: 'Progress recorded.',
      times_opened: 1,
    });
  } catch (err) {
    console.error('Progress error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
