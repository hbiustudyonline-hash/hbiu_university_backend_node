const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  next();
};

// Auth validation rules
const validateRegister = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['student', 'lecturer', 'admin', 'college_admin'])
    .withMessage('Invalid role'),
  
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

// Course validation rules
const validateCourse = [
  body('title')
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('code')
    .notEmpty()
    .withMessage('Course code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Course code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Course code must contain only uppercase letters and numbers'),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('credits')
    .isInt({ min: 1, max: 10 })
    .withMessage('Credits must be between 1 and 10'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid level'),
  
  body('enrollmentLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Enrollment limit must be a positive number'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  handleValidationErrors
];

// College validation rules
const validateCollege = [
  body('name')
    .notEmpty()
    .withMessage('College name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('code')
    .notEmpty()
    .withMessage('College code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('College code must be between 2 and 10 characters')
    .matches(/^[A-Z]+$/)
    .withMessage('College code must contain only uppercase letters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Valid website URL is required'),
  
  body('establishedYear')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Invalid establishment year'),
  
  handleValidationErrors
];

// User update validation rules
const validateUserUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('role')
    .optional()
    .isIn(['student', 'lecturer', 'admin', 'college_admin'])
    .withMessage('Invalid role'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Assignment validation rules
const validateAssignment = [
  body('title')
    .notEmpty()
    .withMessage('Assignment title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('type')
    .isIn(['assignment', 'quiz', 'exam', 'project'])
    .withMessage('Invalid assignment type'),
  
  body('maxScore')
    .isFloat({ min: 0 })
    .withMessage('Maximum score must be a positive number'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
  
  body('timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be a positive number'),
  
  body('attempts')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Attempts must be a positive number'),
  
  body('weight')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Weight must be between 0 and 100'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateCourse,
  validateCollege,
  validateUserUpdate,
  validateAssignment,
  validatePagination,
  handleValidationErrors,
};