const billingModel = require('../models/billingModel');
const { AppError } = require('../middle-ware/errorHandler');

const billingController = {
  // GET /api/billing - Get all bills
  getAllBills: async (req, res, next) => {
    try {
      const { search, status } = req.query;

      let bills;

      if (search) {
        bills = await billingModel.search(search);
      } else if (status && status !== 'All') {
        bills = await billingModel.filterByStatus(status);
      } else {
        bills = await billingModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: bills.length,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/:id - Get bill by ID
  getBillById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const bill = await billingModel.findById(id);

      if (!bill) {
        return next(new AppError('Bill not found', 404));
      }

      res.status(200).json({
        success: true,
        data: bill
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/stats/summary - Get billing statistics
  getBillingStats: async (req, res, next) => {
    try {
      const stats = await billingModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/customer/:customerId - Get bills by customer
  getBillsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const bills = await billingModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: bills.length,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = billingController;
