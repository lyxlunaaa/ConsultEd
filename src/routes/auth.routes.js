const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginValidation, validate } = require('../utils/validators');

// POST /api/auth/login
router.post('/login', loginValidation, validate, authController.login);

module.exports = router;
