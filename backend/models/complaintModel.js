const { query } = require('../config/database');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPLAINT MODEL
// Database query functions for Complaint operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const complaintModel = {
  /**
   * Get all complaints with customer and staff details
   * @returns {Promise<Array>} Array of complaint records
   */
  findAll: async () => {
    const queryString = `
      SELECT 
        co.complaint_id,
        co.complaint_number,
        co.complaint_date,
        co.complaint_type,
        co.priority,
        co.description,
        co.complaint_status,
        co.resolution_date,
        co.resolution_notes,
        co.created_at,
        co.updated_at,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        sc.connection_id,
        sc.connection_number,
        ut.utility_name,
        u.user_id AS assigned_to_id,
        u.full_name AS assigned_to_name,
        u.user_role AS assigned_to_role
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      ORDER BY co.complaint_date DESC, co.complaint_id DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching complaints: ${error.message}`);
    }
  },

  /**
   * Get complaint by ID with full details
   * @param {number} complaintId - Complaint ID
   * @returns {Promise<Object>} Complaint record
   */
  findById: async (complaintId) => {
    const queryString = `
      SELECT 
        co.*,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.address AS customer_address,
        c.city AS customer_city,
        sc.connection_id,
        sc.connection_number,
        sc.property_address,
        ut.utility_name,
        u.user_id AS assigned_to_id,
        u.full_name AS assigned_to_name,
        u.email AS assigned_to_email,
        u.phone AS assigned_to_phone,
        u.user_role AS assigned_to_role
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      WHERE co.complaint_id = @complaintId
    `;
    
    try {
      const result = await query(queryString, { complaintId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching complaint: ${error.message}`);
    }
  },

  /**
   * Search complaints by customer name, complaint number, or description
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching complaint records
   */
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        co.complaint_id,
        co.complaint_number,
        co.complaint_date,
        co.complaint_type,
        co.priority,
        co.description,
        co.complaint_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        sc.connection_number,
        u.full_name AS assigned_to_name
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      WHERE 
        co.complaint_number LIKE '%' + @searchTerm + '%'
        OR c.first_name LIKE '%' + @searchTerm + '%'
        OR c.last_name LIKE '%' + @searchTerm + '%'
        OR co.description LIKE '%' + @searchTerm + '%'
      ORDER BY co.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching complaints: ${error.message}`);
    }
  },

  /**
   * Filter complaints by status
   * @param {string} status - Complaint status
   * @returns {Promise<Array>} Array of filtered complaints
   */
  filterByStatus: async (status) => {
    const queryString = `
      SELECT 
        co.complaint_id,
        co.complaint_number,
        co.complaint_date,
        co.complaint_type,
        co.priority,
        co.description,
        co.complaint_status,
        co.resolution_date,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.email AS customer_email,
        sc.connection_number,
        u.full_name AS assigned_to_name
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      WHERE co.complaint_status = @status
      ORDER BY co.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString, { status });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering complaints by status: ${error.message}`);
    }
  },

  /**
   * Filter complaints by type
   * @param {string} type - Complaint type
   * @returns {Promise<Array>} Array of filtered complaints
   */
  filterByType: async (type) => {
    const queryString = `
      SELECT 
        co.complaint_id,
        co.complaint_number,
        co.complaint_date,
        co.complaint_type,
        co.priority,
        co.description,
        co.complaint_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        sc.connection_number,
        u.full_name AS assigned_to_name
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      WHERE co.complaint_type = @type
      ORDER BY co.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString, { type });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering complaints by type: ${error.message}`);
    }
  },

  /**
   * Filter complaints by priority
   * @param {string} priority - Complaint priority
   * @returns {Promise<Array>} Array of filtered complaints
   */
  filterByPriority: async (priority) => {
    const queryString = `
      SELECT 
        co.complaint_id,
        co.complaint_number,
        co.complaint_date,
        co.complaint_type,
        co.priority,
        co.description,
        co.complaint_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        sc.connection_number,
        u.full_name AS assigned_to_name
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      WHERE co.priority = @priority
      ORDER BY co.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString, { priority });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering complaints by priority: ${error.message}`);
    }
  },

  /**
   * Get complaints by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Array of customer's complaints
   */
  findByCustomer: async (customerId) => {
    const queryString = `
      SELECT 
        co.*,
        sc.connection_number,
        ut.utility_name,
        u.full_name AS assigned_to_name
      FROM Complaint co
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      LEFT JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON co.assigned_to = u.user_id
      WHERE co.customer_id = @customerId
      ORDER BY co.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer complaints: ${error.message}`);
    }
  },

  /**
   * Get complaints assigned to a staff member
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of assigned complaints
   */
  findByAssignedUser: async (userId) => {
    const queryString = `
      SELECT 
        co.complaint_id,
        co.complaint_number,
        co.complaint_date,
        co.complaint_type,
        co.priority,
        co.description,
        co.complaint_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        sc.connection_number
      FROM Complaint co
      INNER JOIN Customer c ON co.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON co.connection_id = sc.connection_id
      WHERE co.assigned_to = @userId
      ORDER BY 
        CASE co.priority 
          WHEN 'Urgent' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END,
        co.complaint_date ASC
    `;
    
    try {
      const result = await query(queryString, { userId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching assigned complaints: ${error.message}`);
    }
  },

  /**
   * Get complaint statistics
   * @returns {Promise<Object>} Statistics object
   */
  getStats: async () => {
    const queryString = `
      SELECT 
        COUNT(*) AS total_complaints,
        COUNT(CASE WHEN complaint_status = 'Open' THEN 1 END) AS open_complaints,
        COUNT(CASE WHEN complaint_status = 'In Progress' THEN 1 END) AS in_progress_complaints,
        COUNT(CASE WHEN complaint_status = 'Resolved' THEN 1 END) AS resolved_complaints,
        COUNT(CASE WHEN complaint_status = 'Closed' THEN 1 END) AS closed_complaints,
        COUNT(CASE WHEN priority = 'Urgent' THEN 1 END) AS urgent_complaints,
        COUNT(CASE WHEN priority = 'High' THEN 1 END) AS high_priority_complaints,
        AVG(CASE 
          WHEN resolution_date IS NOT NULL AND complaint_status IN ('Resolved', 'Closed')
          THEN DATEDIFF(day, complaint_date, resolution_date)
          ELSE NULL
        END) AS avg_resolution_days
      FROM Complaint
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching complaint statistics: ${error.message}`);
    }
  },

  /**
   * Create new complaint
   * @param {Object} complaintData - Complaint data
   * @returns {Promise<Object>} Created complaint record
   */
  create: async (complaintData) => {
    const queryString = `
      DECLARE @complaint_number VARCHAR(50);
      DECLARE @year INT = YEAR(GETDATE());
      DECLARE @sequence INT;
      
      -- Generate unique complaint number
      SELECT @sequence = ISNULL(MAX(CAST(RIGHT(complaint_number, 4) AS INT)), 0) + 1
      FROM Complaint
      WHERE YEAR(complaint_date) = @year;
      
      SET @complaint_number = 'COMP-' + CAST(@year AS VARCHAR(4)) + '-' + RIGHT('0000' + CAST(@sequence AS VARCHAR(4)), 4);
      
      INSERT INTO Complaint (
        customer_id,
        connection_id,
        complaint_number,
        complaint_date,
        complaint_type,
        priority,
        description,
        assigned_to,
        complaint_status
      )
      VALUES (
        @customer_id,
        @connection_id,
        @complaint_number,
        GETDATE(),
        @complaint_type,
        @priority,
        @description,
        @assigned_to,
        @complaint_status
      );
      
      SELECT * FROM Complaint WHERE complaint_id = SCOPE_IDENTITY();
    `;
    
    try {
      const result = await query(queryString, {
        customer_id: complaintData.customer_id,
        connection_id: complaintData.connection_id || null,
        complaint_type: complaintData.complaint_type,
        priority: complaintData.priority || 'Medium',
        description: complaintData.description,
        assigned_to: complaintData.assigned_to || null,
        complaint_status: complaintData.complaint_status || 'Open'
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error creating complaint: ${error.message}`);
    }
  },

  /**
   * Update complaint
   * @param {number} complaintId - Complaint ID
   * @param {Object} complaintData - Updated complaint data
   * @returns {Promise<Object>} Updated complaint record
   */
  update: async (complaintId, complaintData) => {
    const queryString = `
      UPDATE Complaint
      SET 
        complaint_type = @complaint_type,
        priority = @priority,
        description = @description,
        assigned_to = @assigned_to,
        complaint_status = @complaint_status,
        resolution_date = @resolution_date,
        resolution_notes = @resolution_notes,
        updated_at = GETDATE()
      WHERE complaint_id = @complaintId;
      
      SELECT * FROM Complaint WHERE complaint_id = @complaintId;
    `;
    
    try {
      const result = await query(queryString, {
        complaintId,
        complaint_type: complaintData.complaint_type,
        priority: complaintData.priority,
        description: complaintData.description,
        assigned_to: complaintData.assigned_to || null,
        complaint_status: complaintData.complaint_status,
        resolution_date: complaintData.resolution_date || null,
        resolution_notes: complaintData.resolution_notes || null
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error updating complaint: ${error.message}`);
    }
  },

  /**
   * Update complaint status
   * @param {number} complaintId - Complaint ID
   * @param {string} status - New status
   * @param {string} resolutionNotes - Resolution notes (optional)
   * @returns {Promise<Object>} Updated complaint record
   */
  updateStatus: async (complaintId, status, resolutionNotes = null) => {
    const queryString = `
      UPDATE Complaint
      SET 
        complaint_status = @status,
        resolution_date = CASE 
          WHEN @status IN ('Resolved', 'Closed') THEN GETDATE()
          ELSE resolution_date
        END,
        resolution_notes = COALESCE(@resolutionNotes, resolution_notes),
        updated_at = GETDATE()
      WHERE complaint_id = @complaintId;
      
      SELECT * FROM Complaint WHERE complaint_id = @complaintId;
    `;
    
    try {
      const result = await query(queryString, {
        complaintId,
        status,
        resolutionNotes
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error updating complaint status: ${error.message}`);
    }
  },

  /**
   * Assign complaint to staff member
   * @param {number} complaintId - Complaint ID
   * @param {number} userId - User ID to assign to
   * @returns {Promise<Object>} Updated complaint record
   */
  assignToUser: async (complaintId, userId) => {
    const queryString = `
      UPDATE Complaint
      SET 
        assigned_to = @userId,
        complaint_status = CASE 
          WHEN complaint_status = 'Open' THEN 'In Progress'
          ELSE complaint_status
        END,
        updated_at = GETDATE()
      WHERE complaint_id = @complaintId;
      
      SELECT * FROM Complaint WHERE complaint_id = @complaintId;
    `;
    
    try {
      const result = await query(queryString, { complaintId, userId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error assigning complaint: ${error.message}`);
    }
  },

  /**
   * Delete complaint
   * @param {number} complaintId - Complaint ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (complaintId) => {
    const queryString = `
      DELETE FROM Complaint
      WHERE complaint_id = @complaintId;
    `;
    
    try {
      const result = await query(queryString, { complaintId });
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting complaint: ${error.message}`);
    }
  }
};

module.exports = complaintModel;
