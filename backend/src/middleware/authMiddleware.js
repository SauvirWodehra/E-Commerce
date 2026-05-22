/**
 * Auth Middleware
 * 
 * Verifies JWT tokens from the Authorization header.
 * Attaches decoded user to req.user if valid.
 * Returns 401 for missing/invalid tokens.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'amazon_clone_jwt_secret_key_2026_sde_assignment';

/**
 * Middleware: requires a valid JWT.
 * Usage: router.get('/protected', authMiddleware, handler)
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
  }
};

/**
 * Middleware: optionally attaches user if token is present (non-blocking).
 * Useful for routes that work both with and without auth.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      // Invalid token — continue without user
    }
  }

  next();
};

module.exports = { authMiddleware, optionalAuth };
