import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const meterReadingApi = {
  /**
   * Get all meter readings
   * @returns {Promise} API response with readings array
   */
  getAllReadings: async () => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meter readings:', error);
      throw error;
    }
  },

  /**
   * Get reading by ID
   * @param {number} readingId - Reading ID
   * @returns {Promise} API response with reading details
   */
  getReadingById: async (readingId) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/${readingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reading ${readingId}:`, error);
      throw error;
    }
  },

  /**
   * Get readings for a specific meter
   * @param {number} meterId - Meter ID
   * @returns {Promise} API response with meter's readings
   */
  getReadingsByMeterId: async (meterId) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/meter/${meterId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching readings for meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Get historical readings for a meter
   * @param {number} meterId - Meter ID
   * @param {number} limit - Number of readings to fetch (default: 12)
   * @returns {Promise} API response with historical readings
   */
  getHistoricalReadings: async (meterId, limit = 12) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/meter/${meterId}/history`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical readings for meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Search readings
   * @param {string} searchTerm - Search term
   * @returns {Promise} API response with matching readings
   */
  searchReadings: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching readings:', error);
      throw error;
    }
  },

  /**
   * Filter readings by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} API response with filtered readings
   */
  filterByDateRange: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/filter/date-range`, {
        params: { start: startDate, end: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering readings by date range:', error);
      throw error;
    }
  },

  /**
   * Filter readings by reading type
   * @param {string} readingType - Reading type (Actual, Estimated, Customer-Submitted)
   * @returns {Promise} API response with filtered readings
   */
  filterByType: async (readingType) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/filter/type/${readingType}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering readings by type:', error);
      throw error;
    }
  },

  /**
   * Create new meter reading
   * @param {Object} readingData - Reading data
   * @returns {Promise} API response with created reading
   */
  createReading: async (readingData) => {
    try {
      const response = await axios.post(`${API_URL}/meter-readings`, readingData);
      return response.data;
    } catch (error) {
      console.error('Error creating meter reading:', error);
      throw error;
    }
  },

  /**
   * Update meter reading
   * @param {number} readingId - Reading ID
   * @param {Object} readingData - Updated reading data
   * @returns {Promise} API response with updated reading
   */
  updateReading: async (readingId, readingData) => {
    try {
      const response = await axios.put(`${API_URL}/meter-readings/${readingId}`, readingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reading ${readingId}:`, error);
      throw error;
    }
  },

  /**
   * Delete meter reading
   * @param {number} readingId - Reading ID
   * @returns {Promise} API response
   */
  deleteReading: async (readingId) => {
    try {
      const response = await axios.delete(`${API_URL}/meter-readings/${readingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting reading ${readingId}:`, error);
      throw error;
    }
  },

  /**
   * Get last reading for a meter
   * @param {number} meterId - Meter ID
   * @returns {Promise} API response with last reading
   */
  getLastReading: async (meterId) => {
    try {
      const response = await axios.get(`${API_URL}/meter-readings/meter/${meterId}/last`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching last reading for meter ${meterId}:`, error);
      throw error;
    }
  }
};

export default meterReadingApi;
