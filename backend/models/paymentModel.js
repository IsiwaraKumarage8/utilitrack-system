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
  },

  // Create new payment using stored procedure
  create: async (paymentData) => {
    const { bill_id, payment_amount, payment_method, received_by, transaction_reference, notes } = paymentData;

    const queryString = `
      DECLARE @payment_number_out VARCHAR(50);
      
      EXEC sp_ProcessPayment 
        @bill_id = @billId,
        @payment_amount = @paymentAmount,
        @payment_method = @paymentMethod,
        @received_by = @receivedBy,
        @transaction_reference = @transactionReference,
        @payment_number_out = @payment_number_out OUTPUT;
      
      SELECT @payment_number_out AS payment_number;
    `;

    try {
      const result = await query(queryString, {
        billId: bill_id,
        paymentAmount: payment_amount,
        paymentMethod: payment_method,
        receivedBy: received_by,
        transactionReference: transaction_reference || null
      });

      const paymentNumber = result.recordset[0]?.payment_number;

      // If notes are provided, update the payment record
      if (notes && paymentNumber) {
        const updateQuery = `
          UPDATE Payment
          SET notes = @notes
          WHERE payment_number = @paymentNumber
        `;
        await query(updateQuery, { notes, paymentNumber });
      }

      // Fetch the complete payment details
      const selectQuery = `
        SELECT 
          p.*,
          c.first_name + ' ' + c.last_name AS customer_name,
          b.bill_number,
          u.full_name AS received_by_name
        FROM Payment p
        INNER JOIN Customer c ON p.customer_id = c.customer_id
        INNER JOIN Billing b ON p.bill_id = b.bill_id
        LEFT JOIN [User] u ON p.received_by = u.user_id
        WHERE p.payment_number = @paymentNumber
      `;
      
      const paymentResult = await query(selectQuery, { paymentNumber });
      return paymentResult.recordset[0];
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  },

  // Update payment
  update: async (paymentId, updateData) => {
    const { payment_status, notes, transaction_reference } = updateData;

    const queryString = `
      UPDATE Payment
      SET 
        payment_status = COALESCE(@paymentStatus, payment_status),
        notes = COALESCE(@notes, notes),
        transaction_reference = COALESCE(@transactionReference, transaction_reference)
      WHERE payment_id = @paymentId
    `;

    try {
      await query(queryString, {
        paymentId,
        paymentStatus: payment_status || null,
        notes: notes || null,
        transactionReference: transaction_reference || null
      });

      // Return updated payment
      return await paymentModel.findById(paymentId);
    } catch (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }
  },

  // Delete payment
  delete: async (paymentId) => {
    const queryString = `
      DELETE FROM Payment
      WHERE payment_id = @paymentId
    `;

    try {
      const result = await query(queryString, { paymentId });
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting payment: ${error.message}`);
    }
  },

  // Get customer payment history using optimized v_CustomerPaymentHistory view
  getCustomerPaymentHistory: async (customerId = null, filters = {}) => {
    const { start_date, end_date, payment_method } = filters;
    
    let whereConditions = [];
    if (customerId) whereConditions.push(`customer_id = @customerId`);
    if (start_date) whereConditions.push(`payment_date >= @startDate`);
    if (end_date) whereConditions.push(`payment_date <= @endDate`);
    if (payment_method) whereConditions.push(`payment_method = @paymentMethod`);
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    const queryString = `
      SELECT *
      FROM v_CustomerPaymentHistory
      ${whereClause}
      ORDER BY payment_date DESC
    `;
    
    try {
      const result = await query(queryString, {
        customerId: customerId || null,
        startDate: start_date || null,
        endDate: end_date || null,
        paymentMethod: payment_method || null
      });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer payment history: ${error.message}`);
    }
  }
};

module.exports = paymentModel;
