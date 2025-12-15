import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const paymentApi = {
  /**
   * Get all payments
   * @returns {Promise} API response with payments array
   */
  getAllPayments: async () => {
    try {
      const response = await axios.get(`${API_URL}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Get payment by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise} API response with payment details
   */
  getPaymentById: async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Get payments for a specific bill
   * @param {number} billId - Bill ID
   * @returns {Promise} API response with bill's payments
   */
  getPaymentsByBillId: async (billId) => {
    try {
      const response = await axios.get(`${API_URL}/payments/bill/${billId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for bill ${billId}:`, error);
      throw error;
    }
  },

  /**
   * Get payments for a specific customer
   * @param {number} customerId - Customer ID
   * @returns {Promise} API response with customer's payments
   */
  getPaymentsByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/payments/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for customer ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Search payments
   * @param {string} searchTerm - Search term
   * @returns {Promise} API response with matching payments
   */
  searchPayments: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/payments/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching payments:', error);
      throw error;
    }
  },

  /**
   * Filter payments by status
   * @param {string} status - Payment status
   * @returns {Promise} API response with filtered payments
   */
  filterByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/payments/filter/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering payments by status:', error);
      throw error;
    }
  },

  /**
   * Filter payments by payment method
   * @param {string} method - Payment method
   * @returns {Promise} API response with filtered payments
   */
  filterByMethod: async (method) => {
    try {
      const response = await axios.get(`${API_URL}/payments/filter/method/${method}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering payments by method:', error);
      throw error;
    }
  },

  /**
   * Filter payments by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} API response with filtered payments
   */
  filterByDateRange: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/payments/filter/date-range`, {
        params: { start: startDate, end: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering payments by date range:', error);
      throw error;
    }
  },

  /**
   * Create new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise} API response with created payment
   */
  createPayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/payments`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  /**
   * Update payment
   * @param {number} paymentId - Payment ID
   * @param {Object} paymentData - Updated payment data
   * @returns {Promise} API response with updated payment
   */
  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await axios.put(`${API_URL}/payments/${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Delete payment
   * @param {number} paymentId - Payment ID
   * @returns {Promise} API response
   */
  deletePayment: async (paymentId) => {
    try {
      const response = await axios.delete(`${API_URL}/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Verify payment
   * @param {number} paymentId - Payment ID
   * @returns {Promise} API response
   */
  verifyPayment: async (paymentId) => {
    try {
      const response = await axios.put(`${API_URL}/payments/${paymentId}/verify`);
      return response.data;
    } catch (error) {
      console.error(`Error verifying payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Refund payment
   * @param {number} paymentId - Payment ID
   * @param {string} reason - Refund reason
   * @returns {Promise} API response
   */
  refundPayment: async (paymentId, reason) => {
    try {
      const response = await axios.put(`${API_URL}/payments/${paymentId}/refund`, {
        refund_reason: reason
      });
      return response.data;
    } catch (error) {
      console.error(`Error refunding payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Get payment statistics
   * @param {string} period - Period (today, this_week, this_month, this_year)
   * @returns {Promise} API response with payment stats
   */
  getPaymentStats: async (period = 'this_month') => {
    try {
      const response = await axios.get(`${API_URL}/payments/stats`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }
};

export default paymentApi;
