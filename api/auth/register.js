import { getPool } from '../lib/db.js';
import { generateToken } from '../lib/auth.js';
import { runCors } from '../lib/cors.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (runCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, full_name, role } = req.body || {};

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    const pool = getPool();

    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT id FROM slp_users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO slp_users (email, password_hash, full_name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [email, passwordHash, full_name, role || 'slp']
    );

    const user = {
      id: result.insertId,
      email,
      full_name,
      role: role || 'slp',
    };

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
