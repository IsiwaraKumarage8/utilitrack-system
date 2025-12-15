import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const complaintApi = {
  /**
   * Get all complaints
   * @returns {Promise} API response with complaints array
   */
  getAllComplaints: async () => {
    try {
      const response = await axios.get(`${API_URL}/complaints`);
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  /**
   * Get complaint by ID
   * @param {number} complaintId - Complaint ID
   * @returns {Promise} API response with complaint details
   */
  getComplaintById: async (complaintId) => {
    try {
      const response = await axios.get(`${API_URL}/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching complaint ${complaintId}:`, error);
      throw error;
    }
  },

  /**
   * Search complaints
   * @param {string} searchTerm - Search term
   * @returns {Promise} API response with matching complaints
   */
  searchComplaints: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/complaints/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching complaints:', error);
      throw error;
    }
  },

  /**
   * Filter complaints by status
   * @param {string} status - Complaint status
   * @returns {Promise} API response with filtered complaints
   */
  filterByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/complaints/filter/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering complaints by status:', error);
      throw error;
    }
  },

  /**
   * Filter complaints by priority
   * @param {string} priority - Priority level
   * @returns {Promise} API response with filtered complaints
   */
  filterByPriority: async (priority) => {
    try {
      const response = await axios.get(`${API_URL}/complaints/filter/priority/${priority}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering complaints by priority:', error);
      throw error;
    }
  },

  /**
   * Filter complaints by type
   * @param {string} type - Complaint type
   * @returns {Promise} API response with filtered complaints
   */
  filterByType: async (type) => {
    try {
      const response = await axios.get(`${API_URL}/complaints/filter/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering complaints by type:', error);
      throw error;
    }
  },

  /**
   * Get complaints by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise} API response with customer complaints
   */
  getComplaintsByCustomer: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/complaints/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching complaints for customer ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Create new complaint
   * @param {Object} complaintData - Complaint data
   * @returns {Promise} API response with created complaint
   */
  createComplaint: async (complaintData) => {
    try {
      const response = await axios.post(`${API_URL}/complaints`, complaintData);
      return response.data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  },

  /**
   * Update complaint
   * @param {number} complaintId - Complaint ID
   * @param {Object} complaintData - Updated complaint data
   * @returns {Promise} API response with updated complaint
   */
  updateComplaint: async (complaintId, complaintData) => {
    try {
      const response = await axios.put(`${API_URL}/complaints/${complaintId}`, complaintData);
      return response.data;
    } catch (error) {
      console.error(`Error updating complaint ${complaintId}:`, error);
      throw error;
    }
  },

  /**
   * Delete complaint
   * @param {number} complaintId - Complaint ID
   * @returns {Promise} API response
   */
  deleteComplaint: async (complaintId) => {
    try {
      const response = await axios.delete(`${API_URL}/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting complaint ${complaintId}:`, error);
      throw error;
    }
  },

  /**
   * Assign complaint to staff
   * @param {number} complaintId - Complaint ID
   * @param {number} userId - User ID to assign to
   * @returns {Promise} API response
   */
  assignComplaint: async (complaintId, userId) => {
    try {
      const response = await axios.put(`${API_URL}/complaints/${complaintId}/assign`, {
        assigned_to_id: userId
      });
      return response.data;
    } catch (error) {
      console.error(`Error assigning complaint ${complaintId}:`, error);
      throw error;
    }
  },

  /**
   * Update complaint status
   * @param {number} complaintId - Complaint ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  updateStatus: async (complaintId, status) => {
    try {
      const response = await axios.put(`${API_URL}/complaints/${complaintId}/status`, {
        complaint_status: status
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating complaint status ${complaintId}:`, error);
      throw error;
    }
  },

  /**
   * Resolve complaint
   * @param {number} complaintId - Complaint ID
   * @param {string} resolutionNotes - Resolution notes
   * @returns {Promise} API response
   */
  resolveComplaint: async (complaintId, resolutionNotes) => {
    try {
      const response = await axios.put(`${API_URL}/complaints/${complaintId}/resolve`, {
        resolution_notes: resolutionNotes
      });
      return response.data;
    } catch (error) {
      console.error(`Error resolving complaint ${complaintId}:`, error);
      throw error;
    }
  }
};

export default complaintApi;
