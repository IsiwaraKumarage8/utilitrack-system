const customerModel = require('../models/customerModel');
const { AppError } = require('../middle-ware/errorHandler');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOMER CONTROLLER
// Handle HTTP requests for customer operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const customerController = {
  /**
   * GET /api/customers - Get all customers
   * Supports query parameters:
   * - search: Search term for name, email, phone
   * - type: Filter by customer type (Residential, Commercial, Industrial, Government)
   * - status: Filter by status (Active, Inactive, Suspended)
   */
  getAllCustomers: async (req, res, next) => {
    try {
      const { search, type, status } = req.query;

      let customers;

      // If search parameter exists, search customers
      if (search) {
        customers = await customerModel.search(search);
      } 
      // If type filter exists, filter by type
      else if (type && type !== 'All') {
        customers = await customerModel.filterByType(type);
      }
      // If status filter exists, filter by status
      else if (status && status !== 'All') {
        customers = await customerModel.filterByStatus(status);
      }
      // Otherwise get all customers
      else {
        customers = await customerModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/customers/:id - Get customer by ID
   */
  getCustomerById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const customer = await customerModel.findById(id);

      if (!customer) {
        return next(new AppError('Customer not found', 404));
      }

      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/customers/stats/count - Get customer statistics
   * Returns count of customers by type
   */
  getCustomerStats: async (req, res, next) => {
    try {
      const countByType = await customerModel.getCountByType();

      res.status(200).json({
        success: true,
        data: countByType
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
