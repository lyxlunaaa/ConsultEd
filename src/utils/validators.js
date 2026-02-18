const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Login validation
const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Consultation request validation
const consultationRequestValidation = [
    body('professor_id')
        .isInt({ min: 1 })
        .withMessage('Valid professor ID is required'),
    body('course_id')
        .isInt({ min: 1 })
        .withMessage('Valid course ID is required'),
    body('purpose')
        .trim()
        .notEmpty()
        .withMessage('Purpose is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Purpose must be between 10 and 1000 characters')
];

// Consultation approval validation
const consultationApprovalValidation = [
    body('approved_date')
        .notEmpty()
        .withMessage('Approved date is required')
        .isDate()
        .withMessage('Valid date is required'),
    body('approved_time')
        .notEmpty()
        .withMessage('Approved time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Valid time format required (HH:MM)'),
    body('consultation_type')
        .isIn(['face_to_face', 'online'])
        .withMessage('Consultation type must be face_to_face or online'),
    body('consultation_note')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Note must not exceed 500 characters')
];

// Student creation/update validation
const studentValidation = [
    body('student_number')
        .trim()
        .notEmpty()
        .withMessage('Student number is required'),
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name must not exceed 50 characters'),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name must not exceed 50 characters'),
    body('middle_name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Middle name must not exceed 50 characters'),
    body('program_id')
        .isInt({ min: 1 })
        .withMessage('Valid program ID is required'),
    body('section')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Section must not exceed 20 characters')
];

// Professor creation/update validation
const professorValidation = [
    body('employee_id')
        .trim()
        .notEmpty()
        .withMessage('Employee ID is required'),
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name must not exceed 50 characters'),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name must not exceed 50 characters'),
    body('middle_name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Middle name must not exceed 50 characters'),
    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required')
        .isLength({ max: 100 })
        .withMessage('Department must not exceed 100 characters')
];

module.exports = {
    validate,
    loginValidation,
    consultationRequestValidation,
    consultationApprovalValidation,
    studentValidation,
    professorValidation
};
