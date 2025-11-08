const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateAdmin = require('../middleware/auth');
const { validateLogin, checkValidation } = require('../middleware/validation');

// POST /api/auth/login
router.post('/login', validateLogin, checkValidation, authController.login);

// GET /api/auth/verify - Verify token
router.get('/verify', authenticateAdmin, authController.verifyToken);

module.exports = router;
