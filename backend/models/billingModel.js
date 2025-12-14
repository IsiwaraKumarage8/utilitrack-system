const { query } = require('../config/database');

const billingModel = {
  // Get all bills with customer and utility details
  findAll: async () => {
    const queryString = `
      SELECT 
        b.bill_id,
        b.bill_number,
        b.bill_date,
        b.due_date,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.rate_per_unit,
        b.fixed_charge,
        b.consumption_charge,
        b.total_amount,
        b.amount_paid,
        b.outstanding_balance,
        b.bill_status,
        b.notes,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name AS utility_type,
        sc.connection_number
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching bills: ${error.message}`);
    }
  },

  // Get bill by ID with full details
  findById: async (billId) => {
    const queryString = `
      SELECT 
        b.*,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        c.city,
        ut.utility_name AS utility_type,
        ut.unit_of_measurement,
        sc.connection_number,
        sc.property_address,
        m.meter_number,
        tp.tariff_name
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      INNER JOIN Meter m ON sc.connection_id = m.connection_id
      INNER JOIN Tariff_Plan tp ON b.tariff_id = tp.tariff_id
      WHERE b.bill_id = @billId
    `;
    
    try {
      const result = await query(queryString, { billId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching bill: ${error.message}`);
    }
  },

  // Filter bills by status
  filterByStatus: async (billStatus) => {
    const queryString = `
      SELECT 
        b.bill_id,
        b.bill_number,
        b.bill_date,
        b.due_date,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.total_amount,
        b.amount_paid,
        b.outstanding_balance,
        b.bill_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name AS utility_type,
        sc.connection_number
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE b.bill_status = @billStatus
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString, { billStatus });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering bills: ${error.message}`);
    }
  },

  // Search bills by bill number or customer name
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        b.bill_id,
        b.bill_number,
        b.bill_date,
        b.due_date,
        b.total_amount,
        b.outstanding_balance,
        b.bill_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name AS utility_type
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE 
        b.bill_number LIKE '%' + @searchTerm + '%'
        OR c.first_name LIKE '%' + @searchTerm + '%'
        OR c.last_name LIKE '%' + @searchTerm + '%'
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching bills: ${error.message}`);
    }
  },

  // Get billing statistics
  getStats: async () => {
    const queryString = `
      SELECT 
        COUNT(*) AS total_bills,
        SUM(total_amount) AS total_billed,
        SUM(amount_paid) AS total_collected,
        SUM(outstanding_balance) AS total_outstanding,
        COUNT(CASE WHEN bill_status = 'Unpaid' THEN 1 END) AS unpaid_count,
        COUNT(CASE WHEN bill_status = 'Paid' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN bill_status = 'Partially Paid' THEN 1 END) AS partial_count,
        COUNT(CASE WHEN bill_status = 'Overdue' THEN 1 END) AS overdue_count
      FROM Billing
      WHERE MONTH(bill_date) = MONTH(GETDATE())
        AND YEAR(bill_date) = YEAR(GETDATE())
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error getting billing stats: ${error.message}`);
    }
  },

  // Get bills by customer ID
  findByCustomer: async (customerId) => {
    const queryString = `
      SELECT 
        b.*,
        ut.utility_name AS utility_type,
        sc.connection_number
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE sc.customer_id = @customerId
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer bills: ${error.message}`);
    }
  }
};

module.exports = billingModel;
