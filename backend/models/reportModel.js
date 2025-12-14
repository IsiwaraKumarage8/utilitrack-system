const { query } = require('../config/database');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT MODEL
// Database query functions for reporting using views and stored procedures
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const reportModel = {
  /**
   * Get unpaid bills using v_UnpaidBills view
   * @param {Object} filters - Optional filters (utility_type, customer_type, days_overdue_min)
   * @returns {Promise<Array>} Array of unpaid bills
   */
  getUnpaidBills: async (filters = {}) => {
    let queryString = `
      SELECT *
      FROM v_UnpaidBills
      WHERE 1=1
    `;
    
    const params = {};
    
    if (filters.utility_type) {
      queryString += ` AND utility_type = @utility_type`;
      params.utility_type = filters.utility_type;
    }
    
    if (filters.days_overdue_min !== undefined) {
      queryString += ` AND days_overdue >= @days_overdue_min`;
      params.days_overdue_min = filters.days_overdue_min;
    }
    
    queryString += ` ORDER BY days_overdue DESC, outstanding_balance DESC`;
    
    try {
      const result = await query(queryString, params);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching unpaid bills report: ${error.message}`);
    }
  },

  /**
   * Get defaulting customers using sp_GetDefaulters stored procedure
   * @param {number} daysOverdue - Minimum days overdue (default: 30)
   * @returns {Promise<Array>} Array of defaulting customers
   */
  getDefaulters: async (daysOverdue = 30) => {
    try {
      const pool = await require('../config/database').getPool();
      const sql = require('../config/database').sql;
      
      const request = pool.request();
      request.input('days_overdue', sql.Int, daysOverdue);
      
      const result = await request.execute('sp_GetDefaulters');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching defaulters report: ${error.message}`);
    }
  },

  /**
   * Get customer payment history using v_CustomerPaymentHistory view
   * @param {number} customerId - Optional customer ID to filter
   * @param {Object} filters - Optional filters (start_date, end_date, payment_method)
   * @returns {Promise<Array>} Array of payment history records
   */
  getPaymentHistory: async (customerId = null, filters = {}) => {
    let queryString = `
      SELECT *
      FROM v_CustomerPaymentHistory
      WHERE 1=1
    `;
    
    const params = {};
    
    if (customerId) {
      queryString += ` AND customer_id = @customerId`;
      params.customerId = customerId;
    }
    
    if (filters.start_date) {
      queryString += ` AND payment_date >= @start_date`;
      params.start_date = filters.start_date;
    }
    
    if (filters.end_date) {
      queryString += ` AND payment_date <= @end_date`;
      params.end_date = filters.end_date;
    }
    
    if (filters.payment_method) {
      queryString += ` AND payment_method = @payment_method`;
      params.payment_method = filters.payment_method;
    }
    
    queryString += ` ORDER BY payment_date DESC`;
    
    try {
      const result = await query(queryString, params);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching payment history report: ${error.message}`);
    }
  },

  /**
   * Get monthly revenue report using v_MonthlyRevenue view
   * @param {Object} filters - Optional filters (year, month, utility_type)
   * @returns {Promise<Array>} Array of monthly revenue records
   */
  getMonthlyRevenue: async (filters = {}) => {
    let queryString = `
      SELECT *
      FROM v_MonthlyRevenue
      WHERE 1=1
    `;
    
    const params = {};
    
    if (filters.year) {
      queryString += ` AND year = @year`;
      params.year = filters.year;
    }
    
    if (filters.month) {
      queryString += ` AND month = @month`;
      params.month = filters.month;
    }
    
    if (filters.utility_type) {
      queryString += ` AND utility_type = @utility_type`;
      params.utility_type = filters.utility_type;
    }
    
    queryString += ` ORDER BY year DESC, month DESC, utility_type`;
    
    try {
      const result = await query(queryString, params);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching monthly revenue report: ${error.message}`);
    }
  },

  /**
   * Get active connections report using v_ActiveConnections view
   * @param {Object} filters - Optional filters (utility_type, customer_type, city)
   * @returns {Promise<Array>} Array of active connections
   */
  getActiveConnections: async (filters = {}) => {
    let queryString = `
      SELECT *
      FROM v_ActiveConnections
      WHERE 1=1
    `;
    
    const params = {};
    
    if (filters.utility_type) {
      queryString += ` AND utility_type = @utility_type`;
      params.utility_type = filters.utility_type;
    }
    
    if (filters.customer_type) {
      queryString += ` AND customer_type = @customer_type`;
      params.customer_type = filters.customer_type;
    }
    
    if (filters.city) {
      queryString += ` AND city = @city`;
      params.city = filters.city;
    }
    
    queryString += ` ORDER BY connection_date DESC`;
    
    try {
      const result = await query(queryString, params);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching active connections report: ${error.message}`);
    }
  },

  /**
   * Get consumption trends report
   * @param {Object} filters - Filters (start_date, end_date, utility_type, customer_type)
   * @returns {Promise<Array>} Array of consumption trend data
   */
  getConsumptionTrends: async (filters = {}) => {
    const queryString = `
      SELECT 
        YEAR(mr.reading_date) AS year,
        MONTH(mr.reading_date) AS month,
        DATENAME(month, mr.reading_date) AS month_name,
        ut.utility_name AS utility_type,
        c.customer_type,
        COUNT(mr.reading_id) AS total_readings,
        SUM(mr.consumption) AS total_consumption,
        AVG(mr.consumption) AS avg_consumption,
        MIN(mr.consumption) AS min_consumption,
        MAX(mr.consumption) AS max_consumption
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE mr.reading_type = 'Actual'
        ${filters.start_date ? 'AND mr.reading_date >= @start_date' : ''}
        ${filters.end_date ? 'AND mr.reading_date <= @end_date' : ''}
        ${filters.utility_type ? 'AND ut.utility_name = @utility_type' : ''}
        ${filters.customer_type ? 'AND c.customer_type = @customer_type' : ''}
      GROUP BY 
        YEAR(mr.reading_date),
        MONTH(mr.reading_date),
        DATENAME(month, mr.reading_date),
        ut.utility_name,
        c.customer_type
      ORDER BY year DESC, month DESC, utility_type, customer_type
    `;
    
    try {
      const result = await query(queryString, filters);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching consumption trends: ${error.message}`);
    }
  },

  /**
   * Get collection efficiency report
   * @param {Object} filters - Filters (start_date, end_date, utility_type)
   * @returns {Promise<Array>} Collection efficiency data
   */
  getCollectionEfficiency: async (filters = {}) => {
    const queryString = `
      SELECT 
        ut.utility_name AS utility_type,
        COUNT(DISTINCT b.bill_id) AS total_bills,
        SUM(b.total_amount) AS total_billed,
        SUM(b.amount_paid) AS total_collected,
        SUM(b.outstanding_balance) AS total_outstanding,
        CAST(
          CASE 
            WHEN SUM(b.total_amount) > 0 
            THEN (SUM(b.amount_paid) * 100.0 / SUM(b.total_amount))
            ELSE 0 
          END AS DECIMAL(5,2)
        ) AS collection_rate,
        COUNT(CASE WHEN b.bill_status = 'Paid' THEN 1 END) AS bills_paid,
        COUNT(CASE WHEN b.bill_status = 'Overdue' THEN 1 END) AS bills_overdue,
        COUNT(CASE WHEN b.bill_status IN ('Unpaid', 'Partially Paid') THEN 1 END) AS bills_pending
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE 1=1
        ${filters.start_date ? 'AND b.bill_date >= @start_date' : ''}
        ${filters.end_date ? 'AND b.bill_date <= @end_date' : ''}
        ${filters.utility_type ? 'AND ut.utility_name = @utility_type' : ''}
      GROUP BY ut.utility_name
      ORDER BY total_billed DESC
    `;
    
    try {
      const result = await query(queryString, filters);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching collection efficiency: ${error.message}`);
    }
  },

  /**
   * Get dashboard summary statistics
   * @returns {Promise<Object>} Dashboard summary data
   */
  getDashboardSummary: async () => {
    const queryString = `
      SELECT 
        -- Customer stats
        (SELECT COUNT(*) FROM Customer WHERE status = 'Active') AS active_customers,
        (SELECT COUNT(*) FROM Customer) AS total_customers,
        
        -- Connection stats
        (SELECT COUNT(*) FROM Service_Connection WHERE connection_status = 'Active') AS active_connections,
        (SELECT COUNT(*) FROM Service_Connection) AS total_connections,
        
        -- Meter stats
        (SELECT COUNT(*) FROM Meter WHERE meter_status = 'Active') AS active_meters,
        (SELECT COUNT(*) FROM Meter WHERE meter_status = 'Faulty') AS faulty_meters,
        
        -- Billing stats (current month)
        (SELECT COUNT(*) FROM Billing 
         WHERE YEAR(bill_date) = YEAR(GETDATE()) 
         AND MONTH(bill_date) = MONTH(GETDATE())) AS bills_this_month,
        (SELECT SUM(total_amount) FROM Billing 
         WHERE YEAR(bill_date) = YEAR(GETDATE()) 
         AND MONTH(bill_date) = MONTH(GETDATE())) AS billed_this_month,
        (SELECT SUM(amount_paid) FROM Billing 
         WHERE YEAR(bill_date) = YEAR(GETDATE()) 
         AND MONTH(bill_date) = MONTH(GETDATE())) AS collected_this_month,
        
        -- Outstanding stats
        (SELECT COUNT(*) FROM Billing WHERE bill_status IN ('Unpaid', 'Partially Paid', 'Overdue')) AS unpaid_bills,
        (SELECT SUM(outstanding_balance) FROM Billing WHERE outstanding_balance > 0) AS total_outstanding,
        
        -- Complaint stats
        (SELECT COUNT(*) FROM Complaint WHERE complaint_status = 'Open') AS open_complaints,
        (SELECT COUNT(*) FROM Complaint WHERE complaint_status = 'In Progress') AS in_progress_complaints,
        
        -- Payment stats (current month)
        (SELECT COUNT(*) FROM Payment 
         WHERE YEAR(payment_date) = YEAR(GETDATE()) 
         AND MONTH(payment_date) = MONTH(GETDATE())) AS payments_this_month,
        (SELECT SUM(payment_amount) FROM Payment 
         WHERE YEAR(payment_date) = YEAR(GETDATE()) 
         AND MONTH(payment_date) = MONTH(GETDATE())) AS payment_total_this_month
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching dashboard summary: ${error.message}`);
    }
  },

  /**
   * Get meter reading statistics by utility type
   * @returns {Promise<Array>} Reading statistics by utility
   */
  getReadingStatsByUtility: async () => {
    const queryString = `
      SELECT 
        ut.utility_name AS utility_type,
        COUNT(mr.reading_id) AS total_readings,
        COUNT(CASE WHEN mr.reading_type = 'Actual' THEN 1 END) AS actual_readings,
        COUNT(CASE WHEN mr.reading_type = 'Estimated' THEN 1 END) AS estimated_readings,
        AVG(mr.consumption) AS avg_consumption,
        SUM(mr.consumption) AS total_consumption,
        COUNT(CASE 
          WHEN NOT EXISTS (SELECT 1 FROM Billing b WHERE b.reading_id = mr.reading_id)
          THEN 1 END) AS unprocessed_readings
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      GROUP BY ut.utility_name
      ORDER BY total_readings DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching reading stats by utility: ${error.message}`);
    }
  }
};

module.exports = reportModel;
