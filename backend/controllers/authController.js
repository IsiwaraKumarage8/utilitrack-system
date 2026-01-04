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
      
      console.log('DEBUG: Login attempt for username:', username);
      console.log('DEBUG: User found:', user ? 'Yes' : 'No');
      if (user) {
        console.log('DEBUG: User role:', user.user_role);
        console.log('DEBUG: User status:', user.user_status);
        console.log('DEBUG: Password length:', user.password ? user.password.length : 0);
      }

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

      // Compare password directly (plain text)
      console.log('DEBUG: Comparing password...');
      const isPasswordValid = password === user.password;
      console.log('DEBUG: Password valid:', isPasswordValid);

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

      // Remove password from response
      const { password: userPassword, ...userWithoutPassword } = user;

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

      // Create user data object
      const userData = {
        username,
        password,
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

      // Remove password
      const { password: userPassword, ...userWithoutPassword } = user;

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

      // Get user with password (need to fetch with password included)
      const user = await userModel.findByUsername(req.user.username);
      
      // Verify current password (plain text comparison)
      const isPasswordValid = currentPassword === user.password;
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password (plain text)
      await userModel.updatePassword(userId, newPassword);

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
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: async (req, res) => {
    try {
      const userId = req.user.userId;
      const username = req.user.username;

      // Log the logout action
      console.log(`User logged out: ${username} (ID: ${userId})`);

      // Note: In a production system with token blacklisting or session management,
      // you would invalidate the token here. For JWT without a blacklist,
      // the client-side token removal is the primary logout mechanism.

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, return success to ensure client clears token
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    }
  }
};

module.exports = authController;
