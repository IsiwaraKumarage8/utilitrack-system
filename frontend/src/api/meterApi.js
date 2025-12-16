import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const meterApi = {
  /**
   * Get all meters
   * @returns {Promise} API response with meters array
   */
  getAllMeters: async () => {
    try {
      const response = await axios.get(`${API_URL}/meters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meters:', error);
      throw error;
    }
  },

  /**
   * Get meter by ID
   * @param {number} meterId - Meter ID
   * @returns {Promise} API response with meter details
   */
  getMeterById: async (meterId) => {
    try {
      const response = await axios.get(`${API_URL}/meters/${meterId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Search meters
   * @param {string} searchTerm - Search term
   * @returns {Promise} API response with matching meters
   */
  searchMeters: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/meters`, {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching meters:', error);
      throw error;
    }
  },

  /**
   * Filter meters by status
   * @param {string} status - Meter status
   * @returns {Promise} API response with filtered meters
   */
  filterByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/meters/filter/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering meters by status:', error);
      throw error;
    }
  },

  /**
   * Filter meters by utility type
   * @param {string} utilityType - Utility type name
   * @returns {Promise} API response with filtered meters
   */
  filterByUtility: async (utilityType) => {
    try {
      const response = await axios.get(`${API_URL}/meters/filter/utility/${utilityType}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering meters by utility:', error);
      throw error;
    }
  },

  /**
   * Create new meter
   * @param {Object} meterData - Meter data
   * @returns {Promise} API response with created meter
   */
  createMeter: async (meterData) => {
    try {
      const response = await axios.post(`${API_URL}/meters`, meterData);
      return response.data;
    } catch (error) {
      console.error('Error creating meter:', error);
      throw error;
    }
  },

  /**
   * Update meter
   * @param {number} meterId - Meter ID
   * @param {Object} meterData - Updated meter data
   * @returns {Promise} API response with updated meter
   */
  updateMeter: async (meterId, meterData) => {
    try {
      const response = await axios.put(`${API_URL}/meters/${meterId}`, meterData);
      return response.data;
    } catch (error) {
      console.error(`Error updating meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Delete meter
   * @param {number} meterId - Meter ID
   * @returns {Promise} API response
   */
  deleteMeter: async (meterId) => {
    try {
      const response = await axios.delete(`${API_URL}/meters/${meterId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Get meter reading history
   * @param {number} meterId - Meter ID
   * @returns {Promise} API response with reading history
   */
  getMeterReadings: async (meterId) => {
    try {
      const response = await axios.get(`${API_URL}/meters/${meterId}/readings`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching readings for meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Get meter maintenance history
   * @param {number} meterId - Meter ID
   * @returns {Promise} API response with maintenance history
   */
  getMeterMaintenance: async (meterId) => {
    try {
      const response = await axios.get(`${API_URL}/meters/${meterId}/maintenance`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance for meter ${meterId}:`, error);
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
      const response = await axios.get(`${API_URL}/meters/${meterId}/last-reading`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching last reading for meter ${meterId}:`, error);
      throw error;
    }
  },

  /**
   * Get meter statistics
   * @returns {Promise} API response with meter stats
   */
  getMeterStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/meters/stats/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meter stats:', error);
      throw error;
    }
  }
};

export default meterApi;
