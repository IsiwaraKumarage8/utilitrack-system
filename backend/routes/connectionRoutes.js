const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE CONNECTION ROUTES
// All routes are prefixed with /api/connections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/connections - Get all connections (with optional filters)
// Query params: ?search=term, ?utility=Electricity, ?status=Active
router.get('/', connectionController.getAllConnections);

// GET /api/connections/customer/:customerId - Get connections for specific customer
// NOTE: This route must come BEFORE /:id to avoid matching 'customer' as an ID
router.get('/customer/:customerId', connectionController.getConnectionsByCustomer);

// GET /api/connections/:id - Get connection by ID
router.get('/:id', connectionController.getConnectionById);

// POST /api/connections - Create new connection
router.post('/', connectionController.createConnection);

// PUT /api/connections/:id - Update connection by ID
router.put('/:id', connectionController.updateConnection);

// DELETE /api/connections/:id - Delete (disconnect) connection by ID
router.delete('/:id', connectionController.deleteConnection);

module.exports = router;
