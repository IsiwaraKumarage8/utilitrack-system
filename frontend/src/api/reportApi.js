import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AXIOS INSTANCE CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT API FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get dashboard summary statistics
 * @returns {Promise} Dashboard summary data
 */
export const getDashboardSummary = async () => {
  try {
    const response = await api.get('/reports/dashboard-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

/**
 * Get today's revenue with comparison to yesterday
 * @returns {Promise} Today's revenue data
 */
export const getTodayRevenue = async () => {
  try {
    const response = await api.get('/reports/today-revenue');
    return response.data;
  } catch (error) {
    console.error('Error fetching today\'s revenue:', error);
    throw error;
  }
};

/**
 * Get revenue trends for charts
 * @param {number} months - Number of months to retrieve (default: 6)
 * @returns {Promise} Revenue trends data
 */
export const getRevenueTrends = async (months = 6) => {
  try {
    const response = await api.get('/reports/revenue-trends', { params: { months } });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    throw error;
  }
};

/**
 * Get utility distribution statistics
 * @returns {Promise} Utility distribution data
 */
export const getUtilityDistribution = async () => {
  try {
    const response = await api.get('/reports/utility-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching utility distribution:', error);
    throw error;
  }
};

/**
 * Get recent activity
 * @param {number} limit - Number of records to retrieve (default: 10)
 * @returns {Promise} Recent activity data
 */
export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await api.get('/reports/recent-activity', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

/**
 * Get unpaid bills report
 * @param {Object} filters - Optional filters (utility_type, days_overdue_min)
 * @returns {Promise} Unpaid bills data
 */
export const getUnpaidBillsReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/unpaid-bills', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching unpaid bills report:', error);
    throw error;
  }
};

/**
 * Get monthly revenue report
 * @param {Object} filters - Optional filters (year, month, utility_type)
 * @returns {Promise} Monthly revenue data
 */
export const getMonthlyRevenueReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/monthly-revenue', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly revenue report:', error);
    throw error;
  }
};

/**
 * Get active connections report
 * @param {Object} filters - Optional filters (utility_type, customer_type, city)
 * @returns {Promise} Active connections data
 */
export const getActiveConnectionsReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/active-connections', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching active connections report:', error);
    throw error;
  }
};

/**
 * Get defaulters report
 * @param {number} daysOverdue - Minimum days overdue
 * @returns {Promise} Defaulters data
 */
export const getDefaultersReport = async (daysOverdue = 30) => {
  try {
    const response = await api.get('/reports/defaulters', { params: { days_overdue: daysOverdue } });
    return response.data;
  } catch (error) {
    console.error('Error fetching defaulters report:', error);
    throw error;
  }
};

/**
 * Get payment history report
 * @param {Object} filters - Optional filters (start_date, end_date, payment_method)
 * @returns {Promise} Payment history data
 */
export const getPaymentHistoryReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/payment-history', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history report:', error);
    throw error;
  }
};

/**
 * Get consumption trends report
 * @param {Object} filters - Optional filters (utility_type, start_date, end_date)
 * @returns {Promise} Consumption trends data
 */
export const getConsumptionTrendsReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/consumption-trends', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption trends report:', error);
    throw error;
  }
};

/**
 * Get collection efficiency report
 * @param {Object} filters - Optional filters (year, month)
 * @returns {Promise} Collection efficiency data
 */
export const getCollectionEfficiencyReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/collection-efficiency', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching collection efficiency report:', error);
    throw error;
  }
};

/**
 * Get reading statistics by utility type
 * @returns {Promise} Reading statistics data
 */
export const getReadingStatsReport = async () => {
  try {
    const response = await api.get('/reports/reading-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching reading stats report:', error);
    throw error;
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADDITIONAL API FUNCTIONS (Cleaner naming for Reports page)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get monthly revenue (alias for getMonthlyRevenueReport)
 * @param {Object} filters - Optional filters (year, month, utility_type)
 * @returns {Promise} Monthly revenue data
 */
export const getMonthlyRevenue = async (filters = {}) => {
  return getMonthlyRevenueReport(filters);
};

/**
 * Get revenue by utility
 * @param {Object} filters - Optional filters
 * @returns {Promise} Revenue by utility data
 */
export const getRevenueByUtility = async (filters = {}) => {
  return getUtilityDistribution();
};

/**
 * Get collection efficiency
 * @param {Object} filters - Optional filters (year, month)
 * @returns {Promise} Collection efficiency data
 */
export const getCollectionEfficiency = async (filters = {}) => {
  return getCollectionEfficiencyReport(filters);
};

/**
 * Get unpaid bills
 * @param {Object} filters - Optional filters (utility_type, days_overdue_min)
 * @returns {Promise} Unpaid bills data
 */
export const getUnpaidBills = async (filters = {}) => {
  return getUnpaidBillsReport(filters);
};

/**
 * Get defaulting customers
 * @param {number} daysOverdue - Minimum days overdue (default: 30)
 * @returns {Promise} Defaulting customers data
 */
export const getDefaultingCustomers = async (daysOverdue = 30) => {
  return getDefaultersReport(daysOverdue);
};

/**
 * Get consumption by utility
 * @param {Object} filters - Optional filters (utility_type, start_date, end_date)
 * @returns {Promise} Consumption by utility data
 */
export const getConsumptionByUtility = async (filters = {}) => {
  return getConsumptionTrendsReport(filters);
};

/**
 * Get meter reading stats
 * @returns {Promise} Meter reading statistics data
 */
export const getMeterReadingStats = async () => {
  return getReadingStatsReport();
};

/**
 * Get active connections
 * @param {Object} filters - Optional filters (utility_type, customer_type, city)
 * @returns {Promise} Active connections data
 */
export const getActiveConnections = async (filters = {}) => {
  return getActiveConnectionsReport(filters);
};
