/**
 * CORS helper for Vercel serverless functions.
 * Sets permissive CORS headers and handles OPTIONS preflight.
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @returns {boolean} true if this was a preflight request (caller should return early)
 */
export function runCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}
