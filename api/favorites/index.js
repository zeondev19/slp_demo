import { getPool } from '../lib/db.js';
import { withAuth } from '../lib/auth.js';
import { runCors } from '../lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  const userId = req.user.id;
  const pool = getPool();

  try {
    if (req.method === 'GET') {
      const [favorites] = await pool.execute(
        `SELECT 
          f.id AS favorite_id, f.created_at AS favorited_at,
          l.id AS lesson_id, l.title, l.description, l.domain, l.primary_skill,
          l.secondary_skill, l.target, l.level, l.activity_format, l.topic,
          l.duration_minutes, l.thumbnail_url
        FROM slp_favorites f
        JOIN slp_lessons l ON l.id = f.lesson_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC`,
        [userId]
      );

      return res.status(200).json({ favorites });
    }

    if (req.method === 'POST') {
      const { lesson_id } = req.body || {};

      if (!lesson_id) {
        return res.status(400).json({ error: 'lesson_id is required.' });
      }

      // Check if already favorited → toggle (remove)
      const [existing] = await pool.execute(
        'SELECT id FROM slp_favorites WHERE user_id = ? AND lesson_id = ? LIMIT 1',
        [userId, lesson_id]
      );

      if (existing.length > 0) {
        await pool.execute(
          'DELETE FROM slp_favorites WHERE user_id = ? AND lesson_id = ?',
          [userId, lesson_id]
        );
        return res.status(200).json({ favorited: false, message: 'Removed from favorites.' });
      }

      // Insert new favorite
      await pool.execute(
        'INSERT INTO slp_favorites (user_id, lesson_id, created_at) VALUES (?, ?, NOW())',
        [userId, lesson_id]
      );

      return res.status(201).json({ favorited: true, message: 'Added to favorites.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Favorites error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
