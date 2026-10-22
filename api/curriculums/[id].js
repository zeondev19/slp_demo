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
      return res.status(400).json({ error: 'Curriculum ID is required.' });
    }

    const pool = getPool();

    // Fetch curriculum
    const [currRows] = await pool.execute(
      `SELECT id, title, description, domain, target, level, thumbnail_url, created_at, updated_at
       FROM slp_curriculums WHERE id = ? LIMIT 1`,
      [id]
    );

    if (currRows.length === 0) {
      return res.status(404).json({ error: 'Curriculum not found.' });
    }

    const curriculum = currRows[0];

    // Fetch steps with joined lesson data
    const [steps] = await pool.execute(
      `SELECT 
        cs.id AS step_id, cs.step_order, cs.notes,
        l.id AS lesson_id, l.title, l.description, l.domain, l.primary_skill,
        l.secondary_skill, l.target, l.level, l.activity_format, l.topic,
        l.duration_minutes, l.thumbnail_url, l.times_used
      FROM slp_curriculum_steps cs
      LEFT JOIN slp_lessons l ON l.id = cs.lesson_id
      WHERE cs.curriculum_id = ?
      ORDER BY cs.step_order ASC`,
      [id]
    );

    curriculum.steps = steps;

    return res.status(200).json({ curriculum });
  } catch (err) {
    console.error('Curriculum detail error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
