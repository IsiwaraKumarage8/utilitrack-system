const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// GET /api/billing/stats/summary - Get billing statistics
router.get('/stats/summary', billingController.getBillingStats);

// GET /api/billing/unprocessed-readings - Get readings without bills
router.get('/unprocessed-readings', billingController.getUnprocessedReadings);

// GET /api/billing/preview/:readingId - Get bill preview
router.get('/preview/:readingId', billingController.getBillPreview);

// GET /api/billing/customer/:customerId - Get bills by customer
router.get('/customer/:customerId', billingController.getBillsByCustomer);

// GET /api/billing/:id/late-fee - Calculate late fee for a bill
router.get('/:id/late-fee', billingController.getLateFee);

// GET /api/billing/:id/with-late-fee - Get bill with late fee included
router.get('/:id/with-late-fee', billingController.getBillWithLateFee);

// GET /api/billing/:id - Get bill by ID
router.get('/:id', billingController.getBillById);

// GET /api/billing - Get all bills (with optional filters)
router.get('/', billingController.getAllBills);

// POST /api/billing/generate - Generate new bill
router.post('/generate', billingController.generateBill);

module.exports = router;
