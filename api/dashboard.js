import { getPool } from './lib/db.js';
import { withAuth } from './lib/auth.js';
import { runCors } from './lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.user.id;
    const pool = getPool();

    // Recently used lessons (last 8)
    const [recentlyUsed] = await pool.execute(
      `SELECT 
        p.lesson_id, p.last_opened_at, p.times_opened, p.completed,
        l.title, l.description, l.domain, l.primary_skill, l.target,
        l.level, l.activity_format, l.duration_minutes, l.thumbnail_url
      FROM slp_user_progress p
      JOIN slp_lessons l ON l.id = p.lesson_id
      WHERE p.user_id = ?
      ORDER BY p.last_opened_at DESC
      LIMIT 8`,
      [userId]
    );

    // Continue lesson (the most recent one)
    const continueLesson = recentlyUsed.length > 0 ? recentlyUsed[0] : null;

    // User's folders/playlists
    const [folders] = await pool.execute(
      `SELECT 
        pl.id, pl.name, pl.description, pl.created_at,
        COUNT(pi.id) AS item_count
      FROM slp_playlists pl
      LEFT JOIN slp_playlist_items pi ON pi.playlist_id = pl.id
      WHERE pl.user_id = ?
      GROUP BY pl.id
      ORDER BY pl.created_at DESC`,
      [userId]
    );

    // Favorites (last 6)
    const [favorites] = await pool.execute(
      `SELECT 
        f.id AS favorite_id, f.created_at AS favorited_at,
        l.id AS lesson_id, l.title, l.description, l.domain, l.primary_skill,
        l.target, l.level, l.activity_format, l.duration_minutes, l.thumbnail_url
      FROM slp_favorites f
      JOIN slp_lessons l ON l.id = f.lesson_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
      LIMIT 6`,
      [userId]
    );

    // Newly added lessons (last 8)
    const [newlyAdded] = await pool.execute(
      `SELECT 
        id, title, description, domain, primary_skill, target,
        level, activity_format, duration_minutes, thumbnail_url, created_at
      FROM slp_lessons
      ORDER BY created_at DESC
      LIMIT 8`
    );

    // Saved filters
    const [savedFilters] = await pool.execute(
      `SELECT id, name, filters, created_at
       FROM slp_saved_filters
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      recentlyUsed,
      continueLesson,
      folders,
      favorites,
      newlyAdded,
      savedFilters,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
