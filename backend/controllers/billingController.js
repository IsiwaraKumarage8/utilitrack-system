const billingModel = require('../models/billingModel');
const { AppError } = require('../middle-ware/errorHandler');
const { query } = require('../config/database');

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
  // Query param: ?period=current (current month) or ?period=all (all time)
  getBillingStats: async (req, res, next) => {
    try {
      const { period } = req.query;
      const currentMonthOnly = period === 'current';
      
      const stats = await billingModel.getStats(currentMonthOnly);

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
  },

  // GET /api/billing/unprocessed-readings - Get meter readings without bills
  getUnprocessedReadings: async (req, res, next) => {
    try {
      const { utility_type } = req.query;
      
      let readings = await billingModel.findUnprocessedReadings();
      
      if (utility_type && utility_type !== 'All') {
        readings = readings.filter(r => r.utility_type === utility_type);
      }

      res.status(200).json({
        success: true,
        count: readings.length,
        data: readings
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/preview/:readingId - Get bill preview before generation
  getBillPreview: async (req, res, next) => {
    try {
      const { readingId } = req.params;

      const preview = await billingModel.getBillPreview(readingId);

      if (!preview) {
        return next(new AppError('Reading not found or bill already exists', 404));
      }

      res.status(200).json({
        success: true,
        data: preview
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/billing/generate - Generate bill from meter reading
  generateBill: async (req, res, next) => {
    try {
      const { reading_id, due_date } = req.body;

      if (!reading_id) {
        return next(new AppError('Meter reading ID is required', 400));
      }

      const existingBill = await query(
        'SELECT bill_id FROM Billing WHERE reading_id = @reading_id',
        { reading_id }
      );

      if (existingBill.recordset.length > 0) {
        return next(new AppError('Bill already exists for this meter reading', 400));
      }

      const bill = await billingModel.generateBill(reading_id, due_date);

      res.status(201).json({
        success: true,
        message: 'Bill generated successfully',
        data: bill
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/:id/late-fee - Calculate late fee for a bill
  getLateFee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { current_date } = req.query;

      const lateFee = await billingModel.calculateLateFee(id, current_date);

      res.status(200).json({
        success: true,
        data: {
          bill_id: parseInt(id),
          late_fee: lateFee,
          calculated_date: current_date || new Date().toISOString().split('T')[0]
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/:id/with-late-fee - Get bill with late fee included
  getBillWithLateFee: async (req, res, next) => {
    try {
      const { id } = req.params;

      const bill = await billingModel.getBillWithLateFee(id);

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
  }
};

module.exports = billingController;
