const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middle-ware/errorHandler');

const userController = {
  // GET /api/users - Get all users
  getAllUsers: async (req, res, next) => {
    try {
      const { search, role, status } = req.query;

      let users;

      if (search) {
        users = await userModel.search(search);
      } else if (role && role !== 'All') {
        users = await userModel.filterByRole(role);
      } else if (status && status !== 'All') {
        users = await userModel.filterByStatus(status);
      } else {
        users = await userModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/:id - Get user by ID
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/stats/summary - Get user statistics
  getUserStats: async (req, res, next) => {
    try {
      const stats = await userModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/users - Create new user
  createUser: async (req, res, next) => {
    try {
      const { username, password, full_name, email, phone, user_role, department } = req.body;

      // Validate required fields
      if (!username || !password || !full_name || !user_role) {
        return next(new AppError('Username, password, full name, and user role are required', 400));
      }

      const user = await userModel.create({
        username,
        password,
        full_name,
        email,
        phone,
        user_role,
        department
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/users/:id - Update user
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { full_name, email, phone, user_role, department, user_status } = req.body;

      const user = await userModel.update(id, {
        full_name,
        email,
        phone,
        user_role,
        department,
        user_status
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/users/:id/password - Update user password
  updatePassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { new_password } = req.body;

      if (!new_password) {
        return next(new AppError('New password is required', 400));
      }

      await userModel.updatePassword(id, new_password);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/users/:id - Delete user
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleted = await userModel.delete(id);

      if (!deleted) {
        return next(new AppError('User not found', 404));
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/users/login - User login
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return next(new AppError('Username and password are required', 400));
      }

      // Get user by username
      const user = await userModel.findByUsername(username);

      if (!user) {
        return next(new AppError('Invalid credentials', 401));
      }

      // Check if user is active
      if (user.user_status !== 'Active') {
        return next(new AppError('User account is not active', 403));
      }

      // Verify password
      const isPasswordValid = await userModel.verifyPassword(password, user.password_hash);

      if (!isPasswordValid) {
        return next(new AppError('Invalid credentials', 401));
      }

      // Update last login
      await userModel.updateLastLogin(user.user_id);

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          user_role: user.user_role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Remove password_hash from response
      delete user.password_hash;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
