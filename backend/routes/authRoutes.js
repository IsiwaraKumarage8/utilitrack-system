const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middle-ware/authMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public (could be protected with admin role in production)
 */
router.post('/register', authController.register);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token and return user data
 * @access  Private
 */
router.get('/verify', authenticate, authController.verifyToken);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
