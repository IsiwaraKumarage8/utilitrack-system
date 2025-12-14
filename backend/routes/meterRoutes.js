const express = require('express');
const router = express.Router();
const meterController = require('../controllers/meterController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METER ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Meter Reading Routes
// Note: These must come before the /:id route to avoid conflicts

// GET /api/meters/readings/stats/summary - Get reading statistics
router.get('/readings/stats/summary', meterController.getReadingStats);

// GET /api/meters/readings/customer/:customerId - Get readings by customer
router.get('/readings/customer/:customerId', meterController.getReadingsByCustomer);

// GET /api/meters/readings/:id - Get reading by ID
router.get('/readings/:id', meterController.getReadingById);

// GET /api/meters/readings - Get all readings (with optional filters)
router.get('/readings', meterController.getAllReadings);

// POST /api/meters/readings - Create new meter reading
router.post('/readings', meterController.createReading);

// PUT /api/meters/readings/:id - Update meter reading
router.put('/readings/:id', meterController.updateReading);

// DELETE /api/meters/readings/:id - Delete meter reading
router.delete('/readings/:id', meterController.deleteReading);

// Meter Routes

// GET /api/meters/stats/summary - Get meter statistics
router.get('/stats/summary', meterController.getMeterStats);

// GET /api/meters/connection/:connectionId - Get meters by connection
router.get('/connection/:connectionId', meterController.getMetersByConnection);

// GET /api/meters/:id - Get meter by ID
router.get('/:id', meterController.getMeterById);

// GET /api/meters/:meterId/readings - Get readings for specific meter
router.get('/:meterId/readings', meterController.getReadingsByMeter);

// GET /api/meters - Get all meters (with optional filters)
router.get('/', meterController.getAllMeters);

// POST /api/meters - Create new meter
router.post('/', meterController.createMeter);

// PUT /api/meters/:id - Update meter
router.put('/:id', meterController.updateMeter);

// PATCH /api/meters/:id/status - Update meter status
router.patch('/:id/status', meterController.updateMeterStatus);

// PATCH /api/meters/:id/maintenance - Record maintenance
router.patch('/:id/maintenance', meterController.recordMaintenance);

// DELETE /api/meters/:id - Delete meter
router.delete('/:id', meterController.deleteMeter);

module.exports = router;
