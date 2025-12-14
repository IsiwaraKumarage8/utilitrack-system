const { query } = require('../config/database');

const paymentModel = {
  // Get all payments with customer and bill details
  findAll: async () => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.transaction_reference,
        p.payment_status,
        p.notes,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_id,
        b.bill_number,
        b.total_amount AS bill_amount,
        u.full_name AS received_by
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching payments: ${error.message}`);
    }
  },

  // Get payment by ID
  findById: async (paymentId) => {
    const queryString = `
      SELECT 
        p.*,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        b.bill_number,
        b.bill_date,
        b.total_amount AS bill_total,
        b.outstanding_balance,
        u.full_name AS received_by_name,
        u.user_role AS received_by_role
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      WHERE p.payment_id = @paymentId
    `;
    
    try {
      const result = await query(queryString, { paymentId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching payment: ${error.message}`);
    }
  },

  // Filter payments by method
  filterByMethod: async (paymentMethod) => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.transaction_reference,
        p.payment_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_number,
        u.full_name AS received_by
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      WHERE p.payment_method = @paymentMethod
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { paymentMethod });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering payments: ${error.message}`);
    }
  },

  // Filter payments by status
  filterByStatus: async (paymentStatus) => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.payment_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_number
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      WHERE p.payment_status = @paymentStatus
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { paymentStatus });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering payments by status: ${error.message}`);
    }
  },

  // Search payments
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.payment_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_number
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      WHERE 
        p.payment_number LIKE '%' + @searchTerm + '%'
        OR b.bill_number LIKE '%' + @searchTerm + '%'
        OR c.first_name LIKE '%' + @searchTerm + '%'
        OR c.last_name LIKE '%' + @searchTerm + '%'
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching payments: ${error.message}`);
    }
  },

  // Get payment statistics
  getStats: async () => {
    const queryString = `
      SELECT 
        SUM(CASE WHEN CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE) THEN payment_amount ELSE 0 END) AS today_collections,
        SUM(CASE WHEN MONTH(payment_date) = MONTH(GETDATE()) AND YEAR(payment_date) = YEAR(GETDATE()) THEN payment_amount ELSE 0 END) AS monthly_collections,
        COUNT(CASE WHEN payment_status = 'Pending' THEN 1 END) AS pending_count,
        COUNT(CASE WHEN payment_status = 'Failed' THEN 1 END) AS failed_count,
        COUNT(CASE WHEN MONTH(payment_date) = MONTH(GETDATE()) AND YEAR(payment_date) = YEAR(GETDATE()) THEN 1 END) AS monthly_payment_count
      FROM Payment
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error getting payment stats: ${error.message}`);
    }
  },

  // Get payments by customer
  findByCustomer: async (customerId) => {
    const queryString = `
      SELECT 
        p.*,
        b.bill_number,
        b.total_amount AS bill_amount
      FROM Payment p
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      WHERE p.customer_id = @customerId
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer payments: ${error.message}`);
    }
  },

  // Get payments by bill
  findByBill: async (billId) => {
    const queryString = `
      SELECT 
        p.*,
        c.first_name + ' ' + c.last_name AS customer_name,
        u.full_name AS received_by_name
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      WHERE p.bill_id = @billId
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { billId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching bill payments: ${error.message}`);
    }
  }
};

module.exports = paymentModel;
