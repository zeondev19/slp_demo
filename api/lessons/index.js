import { getPool } from '../lib/db.js';
import { runCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      q,
      domain,
      target,
      level,
      activity_format,
      topic,
      sort = 'relevant',
      page = '1',
      limit = '20',
    } = req.query;

    const pool = getPool();
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    let whereClauses = [];
    let params = [];

    // Search query
    if (q) {
      whereClauses.push(
        '(l.title LIKE ? OR l.description LIKE ? OR l.primary_skill LIKE ? OR l.secondary_skill LIKE ? OR l.target LIKE ?)'
      );
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filters
    if (domain) {
      whereClauses.push('l.domain = ?');
      params.push(domain);
    }

    if (target) {
      whereClauses.push('l.target = ?');
      params.push(target);
    }

    if (level) {
      whereClauses.push('l.level = ?');
      params.push(level);
    }

    if (activity_format) {
      whereClauses.push('l.activity_format = ?');
      params.push(activity_format);
    }

    if (topic) {
      whereClauses.push('l.topic = ?');
      params.push(topic);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Sort
    let orderSQL;
    switch (sort) {
      case 'popular':
        orderSQL = 'ORDER BY l.times_used DESC, l.created_at DESC';
        break;
      case 'newest':
        orderSQL = 'ORDER BY l.created_at DESC';
        break;
      case 'relevant':
      default:
        orderSQL = q
          ? 'ORDER BY CASE WHEN l.title LIKE ? THEN 0 WHEN l.primary_skill LIKE ? THEN 1 ELSE 2 END, l.times_used DESC'
          : 'ORDER BY l.times_used DESC, l.created_at DESC';
        break;
    }

    // Add relevance sort params
    const sortParams = [];
    if (sort === 'relevant' && q) {
      const searchTerm = `%${q}%`;
      sortParams.push(searchTerm, searchTerm);
    }

    // Count total
    const countSQL = `SELECT COUNT(*) as total FROM slp_lessons l ${whereSQL}`;
    const [countResult] = await pool.execute(countSQL, params);
    const total = countResult[0].total;

    // Fetch lessons
    const dataSQL = `
      SELECT 
        l.id, l.title, l.description, l.domain, l.primary_skill, l.secondary_skill,
        l.target, l.level, l.activity_format, l.topic, l.duration_minutes,
        l.thumbnail_url, l.times_used, l.created_at
      FROM slp_lessons l
      ${whereSQL}
      ${orderSQL}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, ...sortParams, limitNum, offset];
    const [lessons] = await pool.execute(dataSQL, dataParams);

    return res.status(200).json({
      lessons,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('Lessons list error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
