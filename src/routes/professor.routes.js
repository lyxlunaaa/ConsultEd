const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { consultationApprovalValidation, validate } = require('../utils/validators');

// All routes require professor role
router.use(verifyToken, requireRole('professor'));

// GET /api/professor/dashboard
router.get('/dashboard', professorController.getDashboard);

// GET /api/professor/consultation-requests
router.get('/consultation-requests', professorController.getConsultationRequests);

// GET /api/professor/consultation-requests/:id
router.get('/consultation-requests/:id', professorController.getRequestDetails);

// PUT /api/professor/consultation-requests/:id/approve
router.put(
    '/consultation-requests/:id/approve',
    consultationApprovalValidation,
    validate,
    professorController.approveRequest
);

// PUT /api/professor/consultation-requests/:id/reject
router.put('/consultation-requests/:id/reject', professorController.rejectRequest);

// GET /api/professor/schedule
router.get('/schedule', professorController.getSchedule);

module.exports = router;
