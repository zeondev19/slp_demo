import { getPool } from '../../lib/db.js';
import { withAuth } from '../../lib/auth.js';
import { runCors } from '../../lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  const userId = req.user.id;
  const { id, itemId } = req.query;
  const pool = getPool();

  if (!id) {
    return res.status(400).json({ error: 'Playlist ID is required.' });
  }

  try {
    // Verify playlist ownership
    const [ownerCheck] = await pool.execute(
      'SELECT id FROM slp_playlists WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );

    if (ownerCheck.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    if (req.method === 'POST') {
      const { lesson_id, position } = req.body || {};

      if (!lesson_id) {
        return res.status(400).json({ error: 'lesson_id is required.' });
      }

      // Check if lesson already in playlist
      const [existing] = await pool.execute(
        'SELECT id FROM slp_playlist_items WHERE playlist_id = ? AND lesson_id = ? LIMIT 1',
        [id, lesson_id]
      );

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Lesson is already in this playlist.' });
      }

      // Get next position if not provided
      let pos = position;
      if (pos === undefined || pos === null) {
        const [maxPos] = await pool.execute(
          'SELECT COALESCE(MAX(position), 0) + 1 AS next_pos FROM slp_playlist_items WHERE playlist_id = ?',
          [id]
        );
        pos = maxPos[0].next_pos;
      }

      const [result] = await pool.execute(
        'INSERT INTO slp_playlist_items (playlist_id, lesson_id, position, added_at) VALUES (?, ?, ?, NOW())',
        [id, lesson_id, pos]
      );

      // Update playlist timestamp
      await pool.execute('UPDATE slp_playlists SET updated_at = NOW() WHERE id = ?', [id]);

      return res.status(201).json({
        item: {
          id: result.insertId,
          playlist_id: parseInt(id),
          lesson_id: parseInt(lesson_id),
          position: pos,
        },
      });
    }

    if (req.method === 'DELETE') {
      if (!itemId) {
        return res.status(400).json({ error: 'itemId query parameter is required.' });
      }

      const [deleteResult] = await pool.execute(
        'DELETE FROM slp_playlist_items WHERE id = ? AND playlist_id = ?',
        [itemId, id]
      );

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ error: 'Playlist item not found.' });
      }

      // Update playlist timestamp
      await pool.execute('UPDATE slp_playlists SET updated_at = NOW() WHERE id = ?', [id]);

      return res.status(200).json({ message: 'Item removed from playlist.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Playlist items error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
