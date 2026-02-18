const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole, checkProgramAccess } = require('../middleware/auth');
const { studentValidation, professorValidation, validate } = require('../utils/validators');

// All routes require admin role (registrar, dean, or program_chair)
router.use(verifyToken, requireRole(['registrar', 'dean', 'program_chair']), checkProgramAccess);

// Students Management
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudent);
router.post('/students', studentValidation, validate, adminController.createStudent);
router.put('/students/:id', studentValidation, validate, adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Professors Management
router.get('/professors', adminController.getProfessors);
router.post('/professors', professorValidation, validate, adminController.createProfessor);
router.put('/professors/:id', professorValidation, validate, adminController.updateProfessor);
router.delete('/professors/:id', adminController.deleteProfessor);

// Sections Management
router.get('/sections', adminController.getSections);

// Programs (Registrar only)
router.get('/programs', requireRole('registrar'), adminController.getPrograms);

// Consultation Requests (view only)
router.get('/consultation-requests', adminController.getConsultationRequests);

module.exports = router;
