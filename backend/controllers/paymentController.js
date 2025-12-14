const paymentModel = require('../models/paymentModel');
const { AppError } = require('../middle-ware/errorHandler');

const paymentController = {
  // GET /api/payments - Get all payments
  getAllPayments: async (req, res, next) => {
    try {
      const { search, method, status } = req.query;

      let payments;

      if (search) {
        payments = await paymentModel.search(search);
      } else if (method && method !== 'All') {
        payments = await paymentModel.filterByMethod(method);
      } else if (status && status !== 'All') {
        payments = await paymentModel.filterByStatus(status);
      } else {
        payments = await paymentModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/:id - Get payment by ID
  getPaymentById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payment = await paymentModel.findById(id);

      if (!payment) {
        return next(new AppError('Payment not found', 404));
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/stats/summary - Get payment statistics
  getPaymentStats: async (req, res, next) => {
    try {
      const stats = await paymentModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/customer/:customerId - Get payments by customer
  getPaymentsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const payments = await paymentModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/bill/:billId - Get payments by bill
  getPaymentsByBill: async (req, res, next) => {
    try {
      const { billId } = req.params;

      const payments = await paymentModel.findByBill(billId);

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/payments - Create new payment
  createPayment: async (req, res, next) => {
    try {
      const { bill_id, payment_amount, payment_method, received_by, transaction_reference, notes } = req.body;

      // Validate required fields
      if (!bill_id || !payment_amount || !payment_method || !received_by) {
        return next(new AppError('Bill ID, payment amount, payment method, and received by are required', 400));
      }

      const payment = await paymentModel.create({
        bill_id,
        payment_amount,
        payment_method,
        received_by,
        transaction_reference,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/payments/:id - Update payment
  updatePayment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { payment_status, notes, transaction_reference } = req.body;

      const payment = await paymentModel.update(id, {
        payment_status,
        notes,
        transaction_reference
      });

      if (!payment) {
        return next(new AppError('Payment not found', 404));
      }

      res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/payments/:id - Delete payment
  deletePayment: async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleted = await paymentModel.delete(id);

      if (!deleted) {
        return next(new AppError('Payment not found', 404));
      }

      res.status(200).json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;
