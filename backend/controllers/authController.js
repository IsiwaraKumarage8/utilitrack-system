const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authController = {
  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find user by username
      const user = await userModel.findByUsername(username);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Check if user is active
      if (user.user_status !== 'Active') {
        return res.status(403).json({
          success: false,
          message: `Account is ${user.user_status.toLowerCase()}. Please contact administrator.`
        });
      }

      // Compare password with hash
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Update last login time
      await userModel.updateLastLogin(user.user_id);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          role: user.user_role,
          email: user.email
        },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Register new user
   * POST /api/auth/register
   */
  register: async (req, res) => {
    try {
      const { username, password, full_name, email, phone, user_role, department } = req.body;

      // Validate required fields
      if (!username || !password || !full_name || !email || !user_role) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, full name, email, and user role are required'
        });
      }

      // Validate user role
      const validRoles = ['Admin', 'Field Officer', 'Cashier', 'Manager', 'Billing Clerk'];
      if (!validRoles.includes(user_role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
      }

      // Check if username already exists
      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user data object
      const userData = {
        username,
        password_hash,
        full_name,
        email,
        phone: phone || null,
        user_role,
        department: department || null,
        hire_date: new Date(),
        user_status: 'Active'
      };

      // Create user in database
      const newUser = await userModel.create(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user_id: newUser.user_id,
          username: newUser.username,
          full_name: newUser.full_name,
          email: newUser.email,
          user_role: newUser.user_role
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle duplicate email error
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Verify JWT token and return user data
   * GET /api/auth/verify
   */
  verifyToken: async (req, res) => {
    try {
      // User data is already attached by auth middleware
      const user = await userModel.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove password_hash
      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword
        }
      });

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Token verification failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Change password
   * POST /api/auth/change-password
   */
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      // Get user with password hash
      const user = await userModel.findById(userId);
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Update password
      await userModel.updatePassword(userId, newPasswordHash);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password change failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = authController;
