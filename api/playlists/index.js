import { getPool } from '../lib/db.js';
import { withAuth } from '../lib/auth.js';
import { runCors } from '../lib/cors.js';

async function handler(req, res) {
  if (runCors(req, res)) return;

  const userId = req.user.id;
  const pool = getPool();

  try {
    if (req.method === 'GET') {
      const [playlists] = await pool.execute(
        `SELECT 
          pl.id, pl.name, pl.description, pl.created_at, pl.updated_at,
          COUNT(pi.id) AS item_count
        FROM slp_playlists pl
        LEFT JOIN slp_playlist_items pi ON pi.playlist_id = pl.id
        WHERE pl.user_id = ?
        GROUP BY pl.id
        ORDER BY pl.updated_at DESC`,
        [userId]
      );

      return res.status(200).json({ playlists });
    }

    if (req.method === 'POST') {
      const { name, description } = req.body || {};

      if (!name) {
        return res.status(400).json({ error: 'Playlist name is required.' });
      }

      const [result] = await pool.execute(
        'INSERT INTO slp_playlists (user_id, name, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [userId, name, description || null]
      );

      return res.status(201).json({
        playlist: {
          id: result.insertId,
          name,
          description: description || null,
          item_count: 0,
        },
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Playlists error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withAuth(handler);
