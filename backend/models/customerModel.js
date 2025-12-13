const { query } = require('../config/database');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOMER MODEL
// Database query functions for Customer operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const customerModel = {
  /**
   * Get all customers
   * @returns {Promise<Array>} Array of customer records
   */
  findAll: async () => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  },

  /**
   * Get customer by ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Customer record
   */
  findById: async (customerId) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE customer_id = @customerId
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching customer: ${error.message}`);
    }
  },

  /**
   * Search customers by name, email, or phone
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching customer records
   */
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE 
        first_name LIKE '%' + @searchTerm + '%'
        OR last_name LIKE '%' + @searchTerm + '%'
        OR email LIKE '%' + @searchTerm + '%'
        OR phone LIKE '%' + @searchTerm + '%'
        OR company_name LIKE '%' + @searchTerm + '%'
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching customers: ${error.message}`);
    }
  },

  /**
   * Filter customers by type
   * @param {string} customerType - Customer type (Residential, Commercial, Industrial, Government)
   * @returns {Promise<Array>} Array of filtered customer records
   */
  filterByType: async (customerType) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE customer_type = @customerType
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString, { customerType });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering customers: ${error.message}`);
    }
  },

  /**
   * Filter customers by status
   * @param {string} status - Status (Active, Inactive, Suspended)
   * @returns {Promise<Array>} Array of filtered customer records
   */
  filterByStatus: async (status) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE status = @status
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString, { status });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering customers by status: ${error.message}`);
    }
  },

  /**
   * Get customer count by type
   * @returns {Promise<Array>} Array of customer type counts
   */
  getCountByType: async () => {
    const queryString = `
      SELECT 
        customer_type,
        COUNT(*) as count
      FROM Customer
      GROUP BY customer_type
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error getting customer count: ${error.message}`);
    }
  },

  /**
   * Create new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} Created customer record
   */
  create: async (customerData) => {
    const queryString = `
      INSERT INTO Customer (
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        status,
        registration_date
      )
      VALUES (
        @customer_type,
        @first_name,
        @last_name,
        @company_name,
        @email,
        @phone,
        @address,
        @city,
        @postal_code,
        @status,
        GETDATE()
      );
      
      SELECT * FROM Customer WHERE customer_id = SCOPE_IDENTITY();
    `;
    
    try {
      const result = await query(queryString, {
        customer_type: customerData.customer_type,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        company_name: customerData.company_name || null,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        postal_code: customerData.postal_code,
        status: customerData.status || 'Active'
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error creating customer: ${error.message}`);
    }
  },

  /**
   * Update existing customer
   * @param {number} customerId - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise<Object>} Updated customer record
   */
  update: async (customerId, customerData) => {
    const queryString = `
      UPDATE Customer
      SET 
        customer_type = @customer_type,
        first_name = @first_name,
        last_name = @last_name,
        company_name = @company_name,
        email = @email,
        phone = @phone,
        address = @address,
        city = @city,
        postal_code = @postal_code,
        status = @status,
        updated_at = GETDATE()
      WHERE customer_id = @customerId;
      
      SELECT * FROM Customer WHERE customer_id = @customerId;
    `;
    
    try {
      const result = await query(queryString, {
        customerId,
        customer_type: customerData.customer_type,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        company_name: customerData.company_name || null,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        postal_code: customerData.postal_code,
        status: customerData.status
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error updating customer: ${error.message}`);
    }
  },

  /**
   * Delete customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (customerId) => {
    const queryString = `
      DELETE FROM Customer
      WHERE customer_id = @customerId;
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting customer: ${error.message}`);
    }
  }
};

module.exports = customerModel;
