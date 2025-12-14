import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AXIOS INSTANCE CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REQUEST INTERCEPTOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Add request interceptor for auth token (if needed later)
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
// RESPONSE INTERCEPTOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred');
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BILLING API FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const billingApi = {
  /**
   * Get all bills with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term for bill number or customer name
   * @param {string} params.status - Filter by bill status (Unpaid, Paid, Partially Paid, Overdue, Cancelled)
   * @returns {Promise} - Promise resolving to bills array
   */
  getAllBills: async (params = {}) => {
    try {
      const response = await api.get('/billing', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  },

  /**
   * Get a single bill by ID
   * @param {number} billId - Bill ID
   * @returns {Promise} - Promise resolving to bill object
   */
  getBillById: async (billId) => {
    try {
      const response = await api.get(`/billing/${billId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bill ${billId}:`, error);
      throw error;
    }
  },

  /**
   * Get billing statistics
   * @returns {Promise} - Promise resolving to stats object
   */
  getBillingStats: async () => {
    try {
      const response = await api.get('/billing/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching billing stats:', error);
      throw error;
    }
  },

  /**
   * Get bills for a specific customer
   * @param {number} customerId - Customer ID
   * @returns {Promise} - Promise resolving to bills array
   */
  getBillsByCustomer: async (customerId) => {
    try {
      const response = await api.get(`/billing/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bills for customer ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Search bills by term
   * @param {string} searchTerm - Search term
   * @returns {Promise} - Promise resolving to bills array
   */
  searchBills: async (searchTerm) => {
    try {
      const response = await api.get('/billing', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching bills:', error);
      throw error;
    }
  },

  /**
   * Filter bills by status
   * @param {string} status - Bill status
   * @returns {Promise} - Promise resolving to bills array
   */
  filterByStatus: async (status) => {
    try {
      const response = await api.get('/billing', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error(`Error filtering bills by status ${status}:`, error);
      throw error;
    }
  }
};

export default billingApi;
