const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// GET /api/billing/stats/summary - Get billing statistics
router.get('/stats/summary', billingController.getBillingStats);

// GET /api/billing/customer/:customerId - Get bills by customer
router.get('/customer/:customerId', billingController.getBillsByCustomer);

// GET /api/billing/:id - Get bill by ID
router.get('/:id', billingController.getBillById);

// GET /api/billing - Get all bills (with optional filters)
router.get('/', billingController.getAllBills);

module.exports = router;
