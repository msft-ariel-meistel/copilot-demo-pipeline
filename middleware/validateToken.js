/**
 * Token validation middleware
 * Validates Bearer tokens from Authorization header
 */

/**
 * Middleware: require valid Bearer token
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid Authorization header'
    });
  }

  const token = authHeader.slice(7);
  if (!token || token.length < 20) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token is malformed'
    });
  }

  // In production: verify JWT signature, check expiry, load user
  // For demo: accept any token >= 20 chars
  req.userId = 1; // mock
  next();
}

module.exports = { requireAuth };
