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
        SUM(CASE WHEN mr.reading_type = 'Actual' THEN 1 ELSE 0 END) AS actual_readings,
        SUM(CASE WHEN mr.reading_type = 'Estimated' THEN 1 ELSE 0 END) AS estimated_readings,
        AVG(mr.consumption) AS avg_consumption,
        SUM(mr.consumption) AS total_consumption,
        (
          SELECT COUNT(*)
          FROM Meter_Reading mr2
          INNER JOIN Meter m2 ON mr2.meter_id = m2.meter_id
          INNER JOIN Service_Connection sc2 ON m2.connection_id = sc2.connection_id
          WHERE sc2.utility_type_id = ut.utility_type_id
          AND NOT EXISTS (SELECT 1 FROM Billing b WHERE b.reading_id = mr2.reading_id)
        ) AS unprocessed_readings
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      GROUP BY ut.utility_name, ut.utility_type_id
      ORDER BY total_readings DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching reading stats by utility: ${error.message}`);
    }
  },

  /**
   * Get today's revenue statistics with comparison to yesterday
   * @returns {Promise<Object>} Today's revenue data
   */
  getTodayRevenue: async () => {
    const queryString = `
      SELECT 
        -- Today's revenue
        ISNULL(SUM(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(GETDATE() AS DATE)
          THEN p.payment_amount 
        END), 0) AS today_revenue,
        
        -- Today's payment count
        COUNT(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(GETDATE() AS DATE)
          THEN 1 
        END) AS today_payment_count,
        
        -- Yesterday's revenue
        ISNULL(SUM(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)
          THEN p.payment_amount 
        END), 0) AS yesterday_revenue,
        
        -- Today's revenue by payment method
        ISNULL(SUM(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(GETDATE() AS DATE) 
          AND p.payment_method = 'Cash'
          THEN p.payment_amount 
        END), 0) AS cash_payments,
        
        ISNULL(SUM(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(GETDATE() AS DATE) 
          AND p.payment_method = 'Card'
          THEN p.payment_amount 
        END), 0) AS card_payments,
        
        ISNULL(SUM(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(GETDATE() AS DATE) 
          AND p.payment_method = 'Bank Transfer'
          THEN p.payment_amount 
        END), 0) AS bank_transfer_payments,
        
        ISNULL(SUM(CASE 
          WHEN CAST(p.payment_date AS DATE) = CAST(GETDATE() AS DATE) 
          AND p.payment_method = 'Online'
          THEN p.payment_amount 
        END), 0) AS online_payments
      FROM Payment p
    `;
    
    try {
      const result = await query(queryString);
      const data = result.recordset[0];
      
      // Calculate trend percentage
      const todayRevenue = parseFloat(data.today_revenue) || 0;
      const yesterdayRevenue = parseFloat(data.yesterday_revenue) || 0;
      let trendPercentage = 0;
      
      if (yesterdayRevenue > 0) {
        trendPercentage = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(2);
      } else if (todayRevenue > 0) {
        trendPercentage = 100;
      }
      
      return {
        today_revenue: todayRevenue,
        yesterday_revenue: yesterdayRevenue,
        trend_percentage: parseFloat(trendPercentage),
        trend_text: trendPercentage >= 0 ? `+${trendPercentage}%` : `${trendPercentage}%`,
        payment_count: parseInt(data.today_payment_count) || 0,
        cash_payments: parseFloat(data.cash_payments) || 0,
        card_payments: parseFloat(data.card_payments) || 0,
        bank_transfer_payments: parseFloat(data.bank_transfer_payments) || 0,
        online_payments: parseFloat(data.online_payments) || 0
      };
    } catch (error) {
      throw new Error(`Error fetching today's revenue: ${error.message}`);
    }
  },

  /**
   * Get revenue trends for the last N months by utility type
   * @param {number} months - Number of months to retrieve (default: 6)
   * @returns {Promise<Object>} Revenue trends data
   */
  getRevenueTrends: async (months = 6) => {
    const queryString = `
      WITH MonthlyRevenue AS (
        SELECT 
          YEAR(p.payment_date) AS year,
          MONTH(p.payment_date) AS month,
          DATENAME(MONTH, p.payment_date) AS month_name,
          ut.utility_name,
          SUM(p.payment_amount) AS revenue
        FROM Payment p
        INNER JOIN Billing b ON p.bill_id = b.bill_id
        INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
        INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
        WHERE p.payment_date >= DATEADD(MONTH, -@months, GETDATE())
        GROUP BY 
          YEAR(p.payment_date),
          MONTH(p.payment_date),
          DATENAME(MONTH, p.payment_date),
          ut.utility_name
      )
      SELECT 
        year,
        month,
        month_name,
        utility_name,
        revenue,
        -- Create a sort key for ordering
        year * 100 + month AS sort_key
      FROM MonthlyRevenue
      ORDER BY sort_key, utility_name
    `;
    
    try {
      const result = await query(queryString, { months });
      const rawData = result.recordset;
      
      // Process data into chart-friendly format
      const monthsMap = new Map();
      const utilitiesSet = new Set();
      
      // Build unique months and utilities
      rawData.forEach(row => {
        const monthKey = `${row.year}-${String(row.month).padStart(2, '0')}`;
        const monthLabel = `${row.month_name.substring(0, 3)} ${row.year}`;
        
        if (!monthsMap.has(monthKey)) {
          monthsMap.set(monthKey, {
            key: monthKey,
            label: monthLabel,
            sort_key: row.sort_key,
            data: {}
          });
        }
        
        utilitiesSet.add(row.utility_name);
        monthsMap.get(monthKey).data[row.utility_name] = parseFloat(row.revenue) || 0;
      });
      
      // Convert to arrays and ensure all utilities have data for all months
      const sortedMonths = Array.from(monthsMap.values())
        .sort((a, b) => a.sort_key - b.sort_key);
      
      const labels = sortedMonths.map(m => m.label);
      const datasets = {};
      const utilities = Array.from(utilitiesSet);
      
      // Initialize datasets for each utility
      utilities.forEach(utility => {
        datasets[utility] = sortedMonths.map(month => month.data[utility] || 0);
      });
      
      // Calculate totals by month
      const totalByMonth = sortedMonths.map(month => {
        return utilities.reduce((sum, utility) => {
          return sum + (month.data[utility] || 0);
        }, 0);
      });
      
      return {
        labels,
        datasets,
        utilities,
        total_by_month: totalByMonth,
        period: `${months} months`,
        data_points: rawData.length
      };
    } catch (error) {
      throw new Error(`Error fetching revenue trends: ${error.message}`);
    }
  },

  /**
   * Get utility distribution statistics
   * @returns {Promise<Object>} Utility distribution data with percentages
   */
  getUtilityDistribution: async () => {
    const queryString = `
      SELECT 
        ut.utility_name,
        COUNT(sc.connection_id) AS connection_count,
        SUM(CASE WHEN sc.connection_status = 'Active' THEN 1 ELSE 0 END) AS active_connections,
        -- Revenue for current month
        ISNULL(
          (SELECT SUM(p.payment_amount)
           FROM Payment p
           INNER JOIN Billing b ON p.bill_id = b.bill_id
           INNER JOIN Service_Connection sc2 ON b.connection_id = sc2.connection_id
           WHERE sc2.utility_type_id = ut.utility_type_id
           AND YEAR(p.payment_date) = YEAR(GETDATE())
           AND MONTH(p.payment_date) = MONTH(GETDATE())
          ), 0
        ) AS current_month_revenue,
        -- Total revenue (all time)
        ISNULL(
          (SELECT SUM(p.payment_amount)
           FROM Payment p
           INNER JOIN Billing b ON p.bill_id = b.bill_id
           INNER JOIN Service_Connection sc2 ON b.connection_id = sc2.connection_id
           WHERE sc2.utility_type_id = ut.utility_type_id
          ), 0
        ) AS total_revenue
      FROM Utility_Type ut
      LEFT JOIN Service_Connection sc ON ut.utility_type_id = sc.utility_type_id
      GROUP BY ut.utility_type_id, ut.utility_name
      ORDER BY connection_count DESC
    `;
    
    try {
      const result = await query(queryString);
      const rawData = result.recordset;
      
      // Calculate totals
      const totalConnections = rawData.reduce((sum, row) => sum + parseInt(row.connection_count || 0), 0);
      const totalRevenue = rawData.reduce((sum, row) => sum + parseFloat(row.current_month_revenue || 0), 0);
      
      // Transform data for pie chart with percentages
      const distribution = rawData.map(row => {
        const connections = parseInt(row.connection_count || 0);
        const revenue = parseFloat(row.current_month_revenue || 0);
        
        return {
          name: row.utility_name,
          value: connections,
          percentage: totalConnections > 0 ? parseFloat(((connections / totalConnections) * 100).toFixed(2)) : 0,
          active_connections: parseInt(row.active_connections || 0),
          revenue: revenue,
          revenue_percentage: totalRevenue > 0 ? parseFloat(((revenue / totalRevenue) * 100).toFixed(2)) : 0,
          total_revenue: parseFloat(row.total_revenue || 0)
        };
      });
      
      return {
        distribution,
        summary: {
          total_connections: totalConnections,
          total_utilities: rawData.length,
          current_month_revenue: totalRevenue,
          period: 'Current Month'
        }
      };
    } catch (error) {
      throw new Error(`Error fetching utility distribution: ${error.message}`);
    }
  },

  /**
   * Get recent activity - latest payments, bills, and system events
   * @param {number} limit - Number of records to retrieve (default: 10)
   * @returns {Promise<Array>} Recent activity records
   */
  getRecentActivity: async (limit = 10) => {
    const queryString = `
      SELECT TOP (@limit)
        p.payment_id,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        b.bill_number,
        b.bill_status,
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
        c.customer_id,
        ut.utility_name,
        'Payment' AS activity_type,
        CASE 
          WHEN DATEDIFF(HOUR, p.payment_date, GETDATE()) < 1 
          THEN CAST(DATEDIFF(MINUTE, p.payment_date, GETDATE()) AS VARCHAR) + ' mins ago'
          WHEN DATEDIFF(HOUR, p.payment_date, GETDATE()) < 24 
          THEN CAST(DATEDIFF(HOUR, p.payment_date, GETDATE()) AS VARCHAR) + ' hours ago'
          WHEN DATEDIFF(DAY, p.payment_date, GETDATE()) < 7 
          THEN CAST(DATEDIFF(DAY, p.payment_date, GETDATE()) AS VARCHAR) + ' days ago'
          ELSE CONVERT(VARCHAR, p.payment_date, 107)
        END AS time_ago
      FROM Payment p
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { limit });
      const activities = result.recordset;
      
      // Transform data for frontend
      return activities.map(activity => ({
        id: activity.payment_id,
        type: activity.activity_type,
        date: activity.payment_date,
        time_ago: activity.time_ago,
        customer: activity.customer_name,
        customer_id: activity.customer_id,
        bill_number: activity.bill_number,
        amount: parseFloat(activity.payment_amount || 0),
        status: activity.bill_status,
        payment_method: activity.payment_method,
        utility: activity.utility_name
      }));
    } catch (error) {
      throw new Error(`Error fetching recent activity: ${error.message}`);
    }
  }
};

module.exports = reportModel;
