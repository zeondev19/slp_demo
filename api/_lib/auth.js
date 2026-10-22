import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'slp-default-secret-change-me';
const TOKEN_EXPIRY = '7d';

/**
 * Generate a JWT token for a user.
 * @param {object} user - User object with at least id, email, display_name, role
 * @returns {string} JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      display_name: user.display_name || user.full_name,
      full_name: user.full_name || user.display_name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verify and decode the JWT from the Authorization header.
 * @param {object} req - HTTP request object
 * @returns {object|null} Decoded token payload or null
 */
export function verifyToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
