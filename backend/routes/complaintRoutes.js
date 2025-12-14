const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPLAINT ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/complaints/stats/summary - Get complaint statistics
router.get('/stats/summary', complaintController.getComplaintStats);

// GET /api/complaints/customer/:customerId - Get complaints by customer
router.get('/customer/:customerId', complaintController.getComplaintsByCustomer);

// GET /api/complaints/assigned/:userId - Get complaints assigned to a user
router.get('/assigned/:userId', complaintController.getComplaintsByAssignedUser);

// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', complaintController.getComplaintById);

// GET /api/complaints - Get all complaints (with optional filters)
router.get('/', complaintController.getAllComplaints);

// POST /api/complaints - Create new complaint
router.post('/', complaintController.createComplaint);

// PUT /api/complaints/:id - Update complaint
router.put('/:id', complaintController.updateComplaint);

// PATCH /api/complaints/:id/status - Update complaint status
router.patch('/:id/status', complaintController.updateComplaintStatus);

// PATCH /api/complaints/:id/assign - Assign complaint to staff member
router.patch('/:id/assign', complaintController.assignComplaint);

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', complaintController.deleteComplaint);

module.exports = router;
