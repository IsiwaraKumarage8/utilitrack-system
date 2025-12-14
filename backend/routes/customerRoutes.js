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

// GET /api/customers/:id/balance - Get customer's total outstanding balance
router.get('/:id/balance', customerController.getCustomerBalance);

// GET /api/customers/:id/with-balance - Get customer with balance details
router.get('/:id/with-balance', customerController.getCustomerWithBalance);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers - Create new customer
router.post('/', customerController.createCustomer);

// PUT /api/customers/:id - Update customer by ID
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id - Delete customer by ID
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
