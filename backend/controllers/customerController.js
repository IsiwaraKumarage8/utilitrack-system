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
  },

  /**
   * POST /api/customers - Create new customer
   */
  createCustomer: async (req, res, next) => {
    try {
      const customerData = req.body;

      // Validate required fields
      const requiredFields = ['customer_type', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'postal_code'];
      const missingFields = requiredFields.filter(field => !customerData[field]);

      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate customer type
      const validTypes = ['Residential', 'Commercial', 'Industrial', 'Government'];
      if (!validTypes.includes(customerData.customer_type)) {
        return next(new AppError('Invalid customer type', 400));
      }

      // Create customer
      const newCustomer = await customerModel.create(customerData);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: newCustomer
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/customers/:id - Update existing customer
   */
  updateCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customerData = req.body;

      // Check if customer exists
      const existingCustomer = await customerModel.findById(id);
      if (!existingCustomer) {
        return next(new AppError('Customer not found', 404));
      }

      // Validate customer type if provided
      if (customerData.customer_type) {
        const validTypes = ['Residential', 'Commercial', 'Industrial', 'Government'];
        if (!validTypes.includes(customerData.customer_type)) {
          return next(new AppError('Invalid customer type', 400));
        }
      }

      // Validate status if provided
      if (customerData.status) {
        const validStatuses = ['Active', 'Inactive', 'Suspended'];
        if (!validStatuses.includes(customerData.status)) {
          return next(new AppError('Invalid status', 400));
        }
      }

      // Update customer
      const updatedCustomer = await customerModel.update(id, customerData);

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/customers/:id - Delete customer
   */
  deleteCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if customer exists
      const existingCustomer = await customerModel.findById(id);
      if (!existingCustomer) {
        return next(new AppError('Customer not found', 404));
      }

      // Delete customer
      const deleted = await customerModel.delete(id);

      if (!deleted) {
        return next(new AppError('Failed to delete customer', 500));
      }

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/customers/:id/balance - Get customer's total outstanding balance
   */
  getCustomerBalance: async (req, res, next) => {
    try {
      const { id } = req.params;

      const balance = await customerModel.getBalance(id);

      res.status(200).json({
        success: true,
        data: {
          customer_id: parseInt(id),
          total_outstanding_balance: balance
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/customers/:id/with-balance - Get customer with balance details
   */
  getCustomerWithBalance: async (req, res, next) => {
    try {
      const { id } = req.params;

      const customer = await customerModel.getCustomerWithBalance(id);

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
  }
};

module.exports = customerController;
