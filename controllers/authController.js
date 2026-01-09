const { User, College } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { successResponse, errorResponse, asyncHandler } = require('../utils/response');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, studentId, phoneNumber, collegeId } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return errorResponse(res, 'User already exists with this email', 400);
  }

  // Check if studentId exists (if provided)
  if (studentId) {
    const existingStudentId = await User.findOne({ where: { studentId } });
    if (existingStudentId) {
      return errorResponse(res, 'Student ID already exists', 400);
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || 'student',
    studentId,
    phoneNumber,
    collegeId,
  });

  // Generate token
  const token = generateToken({ id: user.id });

  // Remove password from response
  const userResponse = { ...user.toJSON() };
  delete userResponse.password;

  successResponse(res, {
    token,
    user: userResponse,
  }, 'User registered successfully', 201);
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('[LOGIN] Attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return errorResponse(res, 'Email and password are required', 400);
    }

    // Check JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('[LOGIN] JWT_SECRET not configured!');
      return errorResponse(res, 'Server configuration error', 500);
    }

    // Check for user
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: College,
        as: 'college',
        attributes: ['id', 'name', 'code']
      }]
    });

    if (!user) {
      console.log('[LOGIN] User not found:', email);
      return errorResponse(res, 'Invalid credentials', 401);
    }

    console.log('[LOGIN] User found:', user.id, 'Status:', user.status);

    // Check if user is active
    if (user.status !== 'active') {
      console.log('[LOGIN] User not active:', email);
      return errorResponse(res, 'Account is not active', 401);
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log('[LOGIN] Password mismatch for:', email);
      return errorResponse(res, 'Invalid credentials', 401);
    }

    console.log('[LOGIN] Password matched, generating token');

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken({ id: user.id });

    console.log('[LOGIN] Token generated successfully');

    // Remove password from response
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    successResponse(res, {
      token,
      user: userResponse,
    }, 'Login successful');
  } catch (error) {
    console.error('[LOGIN] Unexpected error:', error.message, error.stack);
    return errorResponse(res, 'Login failed: ' + error.message, 500);
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: College,
      as: 'college',
      attributes: ['id', 'name', 'code']
    }]
  });

  successResponse(res, user, 'User profile retrieved');
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 'address'];
  const updates = {};

  // Only allow certain fields to be updated
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByPk(req.user.id);
  await user.update(updates);

  // Get updated user without password
  const updatedUser = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: College,
      as: 'college',
      attributes: ['id', 'name', 'code']
    }]
  });

  successResponse(res, updatedUser, 'Profile updated successfully');
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  // Check current password
  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    return errorResponse(res, 'Current password is incorrect', 400);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await user.update({ password: hashedPassword });

  successResponse(res, null, 'Password updated successfully');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // In a more complex setup, you might blacklist the token
  successResponse(res, null, 'Logged out successfully');
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};