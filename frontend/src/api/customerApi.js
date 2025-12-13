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
      throw new Error(error.message);
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOMER API METHODS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const customerApi = {
  /**
   * Get all customers
   * @returns {Promise<Object>} Response with customers array
   */
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  /**
   * Get customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise<Object>} Response with customer object
   */
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  /**
   * Search customers
   * @param {string} searchTerm - Search term
   * @returns {Promise<Object>} Response with matching customers
   */
  search: async (searchTerm) => {
    const response = await api.get(`/customers?search=${searchTerm}`);
    return response.data;
  },

  /**
   * Filter by type
   * @param {string} type - Customer type (Residential, Commercial, Industrial, Government)
   * @returns {Promise<Object>} Response with filtered customers
   */
  filterByType: async (type) => {
    const response = await api.get(`/customers?type=${type}`);
    return response.data;
  },

  /**
   * Filter by status
   * @param {string} status - Status (Active, Inactive, Suspended)
   * @returns {Promise<Object>} Response with filtered customers
   */
  filterByStatus: async (status) => {
    const response = await api.get(`/customers?status=${status}`);
    return response.data;
  },

  /**
   * Get customer statistics
   * @returns {Promise<Object>} Response with customer statistics
   */
  getStats: async () => {
    const response = await api.get('/customers/stats/count');
    return response.data;
  }
};

export default customerApi;
