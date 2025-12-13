const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOMER ROUTES
// All routes are prefixed with /api/customers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/customers - Get all customers (with optional filters)
// Query params: ?search=term, ?type=Residential, ?status=Active
router.get('/', customerController.getAllCustomers);

// GET /api/customers/stats/count - Get customer statistics
// NOTE: This route must come BEFORE /:id to avoid matching 'stats' as an ID
router.get('/stats/count', customerController.getCustomerStats);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getCustomerById);

module.exports = router;
