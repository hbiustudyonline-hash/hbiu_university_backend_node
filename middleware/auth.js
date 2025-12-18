const { verifyToken } = require('../utils/auth');
const { errorResponse } = require('../utils/response');
const { User } = require('../models');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return errorResponse(res, 'No user found with this token', 404);
    }

    // Check if user is active
    if (user.status !== 'active') {
      return errorResponse(res, 'User account is not active', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 'Not authorized to access this route', 401);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }
        });
        
        if (user && user.status === 'active') {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
};