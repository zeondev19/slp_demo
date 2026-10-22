import { getPool } from '../lib/db.js';
import { withAuth } from '../lib/auth.js';
import { runCors } from '../lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  const userId = req.user.id;
  const { id } = req.query;
  const pool = getPool();

  if (!id) {
    return res.status(400).json({ error: 'Playlist ID is required.' });
  }

  try {
    // Verify ownership
    const [ownerCheck] = await pool.execute(
      'SELECT id FROM slp_playlists WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );

    if (ownerCheck.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    if (req.method === 'GET') {
      // Fetch playlist details
      const [plRows] = await pool.execute(
        'SELECT id, name, description, created_at, updated_at FROM slp_playlists WHERE id = ?',
        [id]
      );

      // Fetch items with lesson data
      const [items] = await pool.execute(
        `SELECT 
          pi.id AS item_id, pi.position, pi.added_at,
          l.id AS lesson_id, l.title, l.description, l.domain, l.primary_skill,
          l.target, l.level, l.activity_format, l.duration_minutes, l.thumbnail_url
        FROM slp_playlist_items pi
        JOIN slp_lessons l ON l.id = pi.lesson_id
        WHERE pi.playlist_id = ?
        ORDER BY pi.position ASC, pi.added_at ASC`,
        [id]
      );

      return res.status(200).json({
        playlist: { ...plRows[0], items },
      });
    }

    if (req.method === 'PUT') {
      const { name, description } = req.body || {};

      if (!name) {
        return res.status(400).json({ error: 'Playlist name is required.' });
      }

      await pool.execute(
        'UPDATE slp_playlists SET name = ?, description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
        [name, description || null, id, userId]
      );

      return res.status(200).json({ message: 'Playlist updated.' });
    }

    if (req.method === 'DELETE') {
      // Delete items first, then playlist
      await pool.execute('DELETE FROM slp_playlist_items WHERE playlist_id = ?', [id]);
      await pool.execute('DELETE FROM slp_playlists WHERE id = ? AND user_id = ?', [id, userId]);

      return res.status(200).json({ message: 'Playlist deleted.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Playlist detail error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
