const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET /api/payments/stats/summary - Get payment statistics
router.get('/stats/summary', paymentController.getPaymentStats);

// GET /api/payments/customer/:customerId - Get payments by customer
router.get('/customer/:customerId', paymentController.getPaymentsByCustomer);

// GET /api/payments/bill/:billId - Get payments by bill
router.get('/bill/:billId', paymentController.getPaymentsByBill);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// GET /api/payments - Get all payments (with optional filters)
router.get('/', paymentController.getAllPayments);

// POST /api/payments - Create new payment
router.post('/', paymentController.createPayment);

// PUT /api/payments/:id - Update payment
router.put('/:id', paymentController.updatePayment);

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
