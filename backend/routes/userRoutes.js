const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USER ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// POST /api/users/login - User login
router.post('/login', userController.login);

// GET /api/users/stats/summary - Get user statistics
router.get('/stats/summary', userController.getUserStats);

// GET /api/users/stats/active-staff - Get active staff count
router.get('/stats/active-staff', userController.getActiveStaff);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// GET /api/users - Get all users (with optional filters)
router.get('/', userController.getAllUsers);

// POST /api/users - Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// PATCH /api/users/:id/password - Update user password
router.patch('/:id/password', userController.updatePassword);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
