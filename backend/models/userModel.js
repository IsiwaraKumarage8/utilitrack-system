const { query } = require('../config/database');

const userModel = {
  // Get all users
  findAll: async () => {
    const queryString = `
      SELECT 
        user_id,
        username,
        full_name,
        email,
        phone,
        user_role,
        department,
        hire_date,
        user_status,
        last_login,
        created_at,
        updated_at
      FROM [User]
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  // Get user by ID
  findById: async (userId) => {
    const queryString = `
      SELECT 
        user_id,
        username,
        full_name,
        email,
        phone,
        user_role,
        department,
        hire_date,
        user_status,
        last_login,
        created_at,
        updated_at
      FROM [User]
      WHERE user_id = @userId
    `;
    
    try {
      const result = await query(queryString, { userId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  // Get user by username (for authentication)
  findByUsername: async (username) => {
    const queryString = `
      SELECT 
        user_id,
        username,
        password,
        full_name,
        email,
        phone,
        user_role,
        department,
        user_status
      FROM [User]
      WHERE username = @username
    `;
    
    try {
      const result = await query(queryString, { username });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching user by username: ${error.message}`);
    }
  },

  // Filter users by role
  filterByRole: async (userRole) => {
    const queryString = `
      SELECT 
        user_id,
        username,
        full_name,
        email,
        phone,
        user_role,
        department,
        user_status
      FROM [User]
      WHERE user_role = @userRole
      ORDER BY full_name
    `;
    
    try {
      const result = await query(queryString, { userRole });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering users by role: ${error.message}`);
    }
  },

  // Filter users by status
  filterByStatus: async (userStatus) => {
    const queryString = `
      SELECT 
        user_id,
        username,
        full_name,
        email,
        user_role,
        department,
        user_status
      FROM [User]
      WHERE user_status = @userStatus
      ORDER BY full_name
    `;
    
    try {
      const result = await query(queryString, { userStatus });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering users by status: ${error.message}`);
    }
  },

  // Search users
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        user_id,
        username,
        full_name,
        email,
        phone,
        user_role,
        department,
        user_status
      FROM [User]
      WHERE 
        username LIKE '%' + @searchTerm + '%'
        OR full_name LIKE '%' + @searchTerm + '%'
        OR email LIKE '%' + @searchTerm + '%'
      ORDER BY full_name
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  },

  // Get user statistics
  getStats: async () => {
    const queryString = `
      SELECT 
        COUNT(*) AS total_users,
        COUNT(CASE WHEN user_status = 'Active' THEN 1 END) AS active_users,
        COUNT(CASE WHEN user_status = 'Inactive' THEN 1 END) AS inactive_users,
        COUNT(CASE WHEN user_role = 'Admin' THEN 1 END) AS admin_count,
        COUNT(CASE WHEN user_role = 'Field Officer' THEN 1 END) AS field_officer_count,
        COUNT(CASE WHEN user_role = 'Cashier' THEN 1 END) AS cashier_count
      FROM [User]
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error getting user stats: ${error.message}`);
    }
  },

  // Create new user
  create: async (userData) => {
    const { username, password, full_name, email, phone, user_role, department } = userData;

    const queryString = `
      INSERT INTO [User] (username, password, full_name, email, phone, user_role, department, hire_date, user_status)
      OUTPUT INSERTED.*
      VALUES (@username, @password, @full_name, @email, @phone, @user_role, @department, GETDATE(), 'Active')
    `;

    try {
      const result = await query(queryString, {
        username,
        password,
        full_name,
        email: email || null,
        phone: phone || null,
        user_role,
        department: department || null
      });

      // Return user without password
      const user = result.recordset[0];
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  // Update user
  update: async (userId, updateData) => {
    const { full_name, email, phone, user_role, department, user_status } = updateData;

    const queryString = `
      UPDATE [User]
      SET 
        full_name = COALESCE(@full_name, full_name),
        email = COALESCE(@email, email),
        phone = COALESCE(@phone, phone),
        user_role = COALESCE(@user_role, user_role),
        department = COALESCE(@department, department),
        user_status = COALESCE(@user_status, user_status),
        updated_at = GETDATE()
      WHERE user_id = @userId
    `;

    try {
      await query(queryString, {
        userId,
        full_name: full_name || null,
        email: email || null,
        phone: phone || null,
        user_role: user_role || null,
        department: department || null,
        user_status: user_status || null
      });

      return await userModel.findById(userId);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  // Update password
  updatePassword: async (userId, password) => {
    const queryString = `
      UPDATE [User]
      SET 
        password = @password,
        updated_at = GETDATE()
      WHERE user_id = @userId
    `;

    try {
      await query(queryString, { userId, password });
      return true;
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  },

  // Update last login
  updateLastLogin: async (userId) => {
    const queryString = `
      UPDATE [User]
      SET last_login = GETDATE()
      WHERE user_id = @userId
    `;

    try {
      await query(queryString, { userId });
      return true;
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  },

  // Delete user
  delete: async (userId) => {
    const queryString = `
      DELETE FROM [User]
      WHERE user_id = @userId
    `;

    try {
      const result = await query(queryString, { userId });
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  },

  // Get active staff (users who logged in recently)
  getActiveStaff: async () => {
    const queryString = `
      SELECT 
        user_id,
        username,
        full_name,
        user_role,
        department,
        last_login,
        DATEDIFF(MINUTE, last_login, GETDATE()) AS minutes_since_login
      FROM [User]
      WHERE user_status = 'Active'
      AND last_login IS NOT NULL
      AND DATEDIFF(HOUR, last_login, GETDATE()) <= 24
      ORDER BY last_login DESC
    `;

    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching active staff: ${error.message}`);
    }
  }
};

module.exports = userModel;
