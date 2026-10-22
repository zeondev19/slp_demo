import { getPool } from '../lib/db.js';
import { runCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();

    const [curriculums] = await pool.execute(
      `SELECT 
        c.id, c.title, c.description, c.domain, c.target, c.level,
        c.thumbnail_url, c.created_at,
        COUNT(cs.id) AS lesson_count
      FROM slp_curriculums c
      LEFT JOIN slp_curriculum_steps cs ON cs.curriculum_id = c.id
      GROUP BY c.id
      ORDER BY c.title ASC`
    );

    return res.status(200).json({ curriculums });
  } catch (err) {
    console.error('Curriculums list error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
