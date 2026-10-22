import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'slp-default-secret-change-me';
const TOKEN_EXPIRY = '7d';

/**
 * Generate a JWT token for a user.
 * @param {object} user - User object with at least id, email, full_name, role
 * @returns {string} JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
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
  const authHeader = req.headers.authorization || req.headers.Authorization;
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

/**
 * Higher-order function that wraps a handler with auth check.
 * Returns 401 if no valid token is found.
 * Attaches decoded user to req.user.
 * @param {function} handler - async (req, res) handler
 * @returns {function} Wrapped handler
 */
export function withAuth(handler) {
  return async (req, res) => {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    req.user = user;
    return handler(req, res);
  };
}
