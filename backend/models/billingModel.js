const { query, executeProcedure } = require('../config/database');

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
        m.meter_type,
        tp.tariff_name
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      INNER JOIN Meter_Reading mr ON b.reading_id = mr.reading_id
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
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
  // @param {boolean} currentMonthOnly - If true, filter by current month only
  getStats: async (currentMonthOnly = false) => {
    const whereClause = currentMonthOnly 
      ? `WHERE MONTH(bill_date) = MONTH(GETDATE()) AND YEAR(bill_date) = YEAR(GETDATE())`
      : '';
    
    const queryString = `
      SELECT 
        COUNT(*) AS total_bills,
        ISNULL(SUM(total_amount), 0) AS total_billed,
        ISNULL(SUM(amount_paid), 0) AS total_collected,
        ISNULL(SUM(outstanding_balance), 0) AS total_outstanding,
        COUNT(CASE WHEN bill_status = 'Unpaid' THEN 1 END) AS unpaid_count,
        COUNT(CASE WHEN bill_status = 'Paid' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN bill_status = 'Partially Paid' THEN 1 END) AS partial_count,
        COUNT(CASE WHEN bill_status = 'Overdue' THEN 1 END) AS overdue_count
      FROM Billing
      ${whereClause}
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
  },

  // Get unprocessed meter readings (readings without bills yet)
  findUnprocessedReadings: async () => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.meter_id,
        mr.reading_date,
        mr.current_reading,
        mr.previous_reading,
        mr.consumption,
        mr.reading_type,
        m.meter_number,
        m.meter_type,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email,
        c.phone,
        ut.utility_type_id,
        ut.utility_name AS utility_type,
        ut.unit_of_measurement,
        sc.connection_id,
        sc.connection_number,
        sc.property_address
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN Billing b ON mr.reading_id = b.reading_id
      WHERE b.bill_id IS NULL
        AND mr.reading_type = 'Actual'
        AND sc.connection_status = 'Active'
      ORDER BY mr.reading_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching unprocessed readings: ${error.message}`);
    }
  },

  // Get bill preview data
  getBillPreview: async (readingId) => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.reading_date,
        mr.consumption,
        mr.current_reading,
        mr.previous_reading,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        c.city,
        sc.connection_id,
        sc.connection_number,
        sc.property_address,
        m.meter_number,
        m.meter_type,
        ut.utility_type_id,
        ut.utility_name AS utility_type,
        ut.unit_of_measurement,
        tp.tariff_id,
        tp.tariff_name,
        tp.rate_per_unit,
        tp.fixed_charge,
        mr.consumption * tp.rate_per_unit AS consumption_charge,
        (mr.consumption * tp.rate_per_unit) + tp.fixed_charge AS total_amount,
        (SELECT TOP 1 reading_date FROM Meter_Reading WHERE meter_id = mr.meter_id AND reading_id < mr.reading_id ORDER BY reading_date DESC) AS period_start,
        mr.reading_date AS period_end
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      INNER JOIN Tariff_Plan tp ON 
        tp.utility_type_id = ut.utility_type_id 
        AND tp.customer_type = c.customer_type
        AND tp.tariff_status = 'Active'
        AND tp.effective_from <= GETDATE()
        AND (tp.effective_to IS NULL OR tp.effective_to >= GETDATE())
      WHERE mr.reading_id = @readingId
    `;
    
    try {
      const result = await query(queryString, { readingId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching bill preview: ${error.message}`);
    }
  },

  // Generate bill using stored procedure
  generateBill: async (readingId, dueDate = null) => {
    try {
      const pool = await require('../config/database').getPool();
      const sql = require('../config/database').sql;
      
      const finalDueDate = dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const request = pool.request();
      request.input('reading_id', sql.Int, readingId);
      request.input('due_date', sql.Date, finalDueDate);
      request.output('bill_number_out', sql.VarChar(50));
      
      const result = await request.execute('sp_GenerateBill');
      
      const billNumber = result.output.bill_number_out;
      
      if (!billNumber) {
        throw new Error('Failed to generate bill - no bill number returned');
      }
      
      const bill = await billingModel.findByBillNumber(billNumber);
      return bill;
      
    } catch (error) {
      throw new Error(`Error generating bill: ${error.message}`);
    }
  },

  // Find bill by bill number
  findByBillNumber: async (billNumber) => {
    const queryString = `
      SELECT 
        b.*,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email,
        c.phone,
        ut.utility_name AS utility_type,
        sc.connection_number,
        m.meter_number,
        m.meter_type
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      INNER JOIN Meter_Reading mr ON b.reading_id = mr.reading_id
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      WHERE b.bill_number = @billNumber
    `;
    
    try {
      const result = await query(queryString, { billNumber });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching bill by number: ${error.message}`);
    }
  }
};

module.exports = billingModel;
