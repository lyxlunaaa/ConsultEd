const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { consultationRequestValidation, validate } = require('../utils/validators');

// All routes require student role
router.use(verifyToken, requireRole('student'));

// GET /api/student/dashboard
router.get('/dashboard', studentController.getDashboard);

// GET /api/student/professors
router.get('/professors', studentController.getProfessors);

// POST /api/student/consultation-request
router.post(
    '/consultation-request',
    consultationRequestValidation,
    validate,
    studentController.createConsultationRequest
);

// GET /api/student/consultation-requests
router.get('/consultation-requests', studentController.getConsultationRequests);

module.exports = router;
