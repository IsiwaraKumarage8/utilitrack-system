const complaintModel = require('../models/complaintModel');
const { AppError } = require('../middle-ware/errorHandler');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPLAINT CONTROLLER
// Handle HTTP requests for complaint operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const complaintController = {
  /**
   * GET /api/complaints - Get all complaints
   * Supports query parameters:
   * - search: Search term for complaint number, customer name, description
   * - status: Filter by status (Open, In Progress, Resolved, Closed, Rejected)
   * - type: Filter by type (Billing Issue, Meter Fault, Service Disruption, etc.)
   * - priority: Filter by priority (Low, Medium, High, Urgent)
   */
  getAllComplaints: async (req, res, next) => {
    try {
      const { search, status, type, priority } = req.query;

      let complaints;

      // If search parameter exists
      if (search) {
        complaints = await complaintModel.search(search);
      }
      // If status filter exists
      else if (status && status !== 'All') {
        complaints = await complaintModel.filterByStatus(status);
      }
      // If type filter exists
      else if (type && type !== 'All') {
        complaints = await complaintModel.filterByType(type);
      }
      // If priority filter exists
      else if (priority && priority !== 'All') {
        complaints = await complaintModel.filterByPriority(priority);
      }
      // Otherwise get all complaints
      else {
        complaints = await complaintModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/complaints/:id - Get complaint by ID
   */
  getComplaintById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const complaint = await complaintModel.findById(id);

      if (!complaint) {
        return next(new AppError('Complaint not found', 404));
      }

      res.status(200).json({
        success: true,
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/complaints/customer/:customerId - Get complaints by customer
   */
  getComplaintsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const complaints = await complaintModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/complaints/assigned/:userId - Get complaints assigned to a user
   */
  getComplaintsByAssignedUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const complaints = await complaintModel.findByAssignedUser(userId);

      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/complaints/stats/summary - Get complaint statistics
   */
  getComplaintStats: async (req, res, next) => {
    try {
      const stats = await complaintModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/complaints - Create new complaint
   */
  createComplaint: async (req, res, next) => {
    try {
      const complaintData = req.body;

      // Validate required fields
      const requiredFields = ['customer_id', 'complaint_type', 'description'];
      const missingFields = requiredFields.filter(field => !complaintData[field]);

      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate complaint type
      const validTypes = ['Billing Issue', 'Meter Fault', 'Service Disruption', 'Quality Issue', 'Connection Request', 'Other'];
      if (!validTypes.includes(complaintData.complaint_type)) {
        return next(new AppError('Invalid complaint type', 400));
      }

      // Validate priority if provided
      if (complaintData.priority) {
        const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
        if (!validPriorities.includes(complaintData.priority)) {
          return next(new AppError('Invalid priority', 400));
        }
      }

      const newComplaint = await complaintModel.create(complaintData);

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: newComplaint
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/complaints/:id - Update complaint
   */
  updateComplaint: async (req, res, next) => {
    try {
      const { id } = req.params;
      const complaintData = req.body;

      // Check if complaint exists
      const existingComplaint = await complaintModel.findById(id);
      if (!existingComplaint) {
        return next(new AppError('Complaint not found', 404));
      }

      // Validate complaint type
      const validTypes = ['Billing Issue', 'Meter Fault', 'Service Disruption', 'Quality Issue', 'Connection Request', 'Other'];
      if (complaintData.complaint_type && !validTypes.includes(complaintData.complaint_type)) {
        return next(new AppError('Invalid complaint type', 400));
      }

      // Validate priority
      const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
      if (complaintData.priority && !validPriorities.includes(complaintData.priority)) {
        return next(new AppError('Invalid priority', 400));
      }

      // Validate status
      const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'];
      if (complaintData.complaint_status && !validStatuses.includes(complaintData.complaint_status)) {
        return next(new AppError('Invalid complaint status', 400));
      }

      const updatedComplaint = await complaintModel.update(id, complaintData);

      res.status(200).json({
        success: true,
        message: 'Complaint updated successfully',
        data: updatedComplaint
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/complaints/:id/status - Update complaint status
   */
  updateComplaintStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, resolution_notes } = req.body;

      if (!status) {
        return next(new AppError('Status is required', 400));
      }

      // Validate status
      const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'];
      if (!validStatuses.includes(status)) {
        return next(new AppError('Invalid complaint status', 400));
      }

      // Check if complaint exists
      const existingComplaint = await complaintModel.findById(id);
      if (!existingComplaint) {
        return next(new AppError('Complaint not found', 404));
      }

      const updatedComplaint = await complaintModel.updateStatus(id, status, resolution_notes);

      res.status(200).json({
        success: true,
        message: 'Complaint status updated successfully',
        data: updatedComplaint
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/complaints/:id/assign - Assign complaint to staff member
   */
  assignComplaint: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return next(new AppError('User ID is required', 400));
      }

      // Check if complaint exists
      const existingComplaint = await complaintModel.findById(id);
      if (!existingComplaint) {
        return next(new AppError('Complaint not found', 404));
      }

      const updatedComplaint = await complaintModel.assignToUser(id, user_id);

      res.status(200).json({
        success: true,
        message: 'Complaint assigned successfully',
        data: updatedComplaint
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/complaints/:id - Delete complaint
   */
  deleteComplaint: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if complaint exists
      const existingComplaint = await complaintModel.findById(id);
      if (!existingComplaint) {
        return next(new AppError('Complaint not found', 404));
      }

      const deleted = await complaintModel.delete(id);

      if (!deleted) {
        return next(new AppError('Failed to delete complaint', 500));
      }

      res.status(200).json({
        success: true,
        message: 'Complaint deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = complaintController;
