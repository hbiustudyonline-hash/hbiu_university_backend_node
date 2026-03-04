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
      console.log('🔑 Token found in Authorization header');
    }

    // Check if token exists
    if (!token) {
      console.error('❌ No token provided');
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    console.log('🔍 Verifying token...');
    // Verify token
    const decoded = verifyToken(token);
    console.log('✅ Token verified, decoded:', { id: decoded.id, email: decoded.email });

    // Get user from token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      console.error('❌ No user found with ID:', decoded.id);
      return errorResponse(res, 'No user found with this token', 404);
    }

    console.log('👤 User found:', { id: user.id, email: user.email, role: user.role, status: user.status });

    // Check if user is active
    if (user.status !== 'active') {
      console.error('❌ User account is not active:', user.status);
      return errorResponse(res, 'User account is not active', 401);
    }

    req.user = user;
    console.log('✅ Authentication successful');
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 'Not authorized to access this route', 401);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('🔐 Authorization check:');
    console.log('  - Required roles:', roles);
    console.log('  - User role:', req.user?.role);
    console.log('  - User:', { id: req.user?.id, email: req.user?.email, role: req.user?.role });
    
    if (!roles.includes(req.user.role)) {
      console.error(`❌ Authorization FAILED: User role '${req.user.role}' not in allowed roles:`, roles);
      return errorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }
    
    console.log('✅ Authorization PASSED');
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