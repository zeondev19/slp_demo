import { getPool } from '../lib/db.js';
import { runCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Lesson ID is required.' });
    }

    const pool = getPool();

    const [rows] = await pool.execute(
      `SELECT 
        l.id, l.title, l.description, l.domain, l.primary_skill, l.secondary_skill,
        l.target, l.level, l.activity_format, l.topic, l.duration_minutes,
        l.thumbnail_url, l.teaching_script, l.genially_embed_url,
        l.materials, l.objectives, l.preparation_notes,
        l.times_used, l.created_at, l.updated_at
      FROM slp_lessons l
      WHERE l.id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found.' });
    }

    const lesson = rows[0];

    // Increment times_used
    await pool.execute(
      'UPDATE slp_lessons SET times_used = times_used + 1 WHERE id = ?',
      [id]
    );

    return res.status(200).json({ lesson });
  } catch (err) {
    console.error('Lesson detail error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
