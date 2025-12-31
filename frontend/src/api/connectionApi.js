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

// Add request interceptor for auth token
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
      throw error;
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE CONNECTION API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const connectionApi = {
  /**
   * Get all service connections
   * @param {Object} params - Query parameters (search, utility, status)
   * @returns {Promise} - Promise with connections data
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/connections', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
  },

  /**
   * Get a single service connection by ID
   * @param {number} id - Connection ID
   * @returns {Promise} - Promise with connection data
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/connections/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching connection ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new service connection
   * @param {Object} connectionData - Connection data
   * @returns {Promise} - Promise with created connection
   */
  create: async (connectionData) => {
    try {
      const response = await api.post('/connections', connectionData);
      return response.data;
    } catch (error) {
      console.error('Error creating connection:', error);
      throw error;
    }
  },

  /**
   * Update an existing service connection
   * @param {number} id - Connection ID
   * @param {Object} connectionData - Updated connection data
   * @returns {Promise} - Promise with updated connection
   */
  update: async (id, connectionData) => {
    try {
      const response = await api.put(`/connections/${id}`, connectionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating connection ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a service connection
   * @param {number} id - Connection ID
   * @returns {Promise} - Promise with deletion result
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/connections/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting connection ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search connections by query
   * @param {string} query - Search query
   * @returns {Promise} - Promise with search results
   */
  search: async (query) => {
    try {
      const response = await api.get('/connections', { 
        params: { search: query } 
      });
      return response.data;
    } catch (error) {
      console.error('Error searching connections:', error);
      throw error;
    }
  }
};

export default connectionApi;
