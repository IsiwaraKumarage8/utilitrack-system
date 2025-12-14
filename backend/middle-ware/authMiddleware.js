const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    // Attach user data to request
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Middleware to authorize specific roles
 * @param {Array<string>} allowedRoles - Array of allowed user roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Insufficient permissions.'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
