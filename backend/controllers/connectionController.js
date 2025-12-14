const connectionModel = require('../models/connectionModel');
const { AppError } = require('../middle-ware/errorHandler');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE CONNECTION CONTROLLER
// Handle HTTP requests for service connection operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const connectionController = {
  /**
   * GET /api/connections - Get all service connections
   * Supports query parameters:
   * - search: Search term for customer name, connection number, address
   * - utility: Filter by utility type (Electricity, Water, Gas, etc.)
   * - status: Filter by status (Active, Disconnected, Suspended, Pending)
   */
  getAllConnections: async (req, res, next) => {
    try {
      const { search, utility, status } = req.query;

      let connections;

      // If search parameter exists, search connections
      if (search) {
        connections = await connectionModel.search(search);
      } 
      // If utility filter exists, filter by utility type
      else if (utility && utility !== 'All') {
        connections = await connectionModel.filterByUtility(utility);
      }
      // If status filter exists, filter by status
      else if (status && status !== 'All') {
        connections = await connectionModel.filterByStatus(status);
      }
      // Otherwise get all connections
      else {
        connections = await connectionModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: connections.length,
        data: connections
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/connections/:id - Get connection by ID
   */
  getConnectionById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const connection = await connectionModel.findById(id);

      if (!connection) {
        return next(new AppError('Service connection not found', 404));
      }

      res.status(200).json({
        success: true,
        data: connection
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/connections/customer/:customerId - Get connections for specific customer
   */
  getConnectionsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const connections = await connectionModel.findByCustomerId(customerId);

      res.status(200).json({
        success: true,
        count: connections.length,
        data: connections
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/connections - Create new service connection
   */
  createConnection: async (req, res, next) => {
    try {
      const connectionData = req.body;

      // Validate required fields
      const requiredFields = ['customer_id', 'utility_type_id', 'connection_number', 'property_address'];
      const missingFields = requiredFields.filter(field => !connectionData[field]);

      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate connection status if provided
      if (connectionData.connection_status) {
        const validStatuses = ['Active', 'Disconnected', 'Suspended', 'Pending'];
        if (!validStatuses.includes(connectionData.connection_status)) {
          return next(new AppError('Invalid connection status', 400));
        }
      }

      // Create connection
      const newConnection = await connectionModel.create(connectionData);

      res.status(201).json({
        success: true,
        message: 'Service connection created successfully',
        data: newConnection
      });
    } catch (error) {
      // Handle unique constraint violation for connection_number
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return next(new AppError('Connection number already exists', 400));
      }
      next(error);
    }
  },

  /**
   * PUT /api/connections/:id - Update existing connection
   */
  updateConnection: async (req, res, next) => {
    try {
      const { id } = req.params;
      const connectionData = req.body;

      // Check if connection exists
      const existingConnection = await connectionModel.findById(id);
      if (!existingConnection) {
        return next(new AppError('Service connection not found', 404));
      }

      // Validate connection status if provided
      if (connectionData.connection_status) {
        const validStatuses = ['Active', 'Disconnected', 'Suspended', 'Pending'];
        if (!validStatuses.includes(connectionData.connection_status)) {
          return next(new AppError('Invalid connection status', 400));
        }
      }

      // Update connection
      const updatedConnection = await connectionModel.update(id, connectionData);

      res.status(200).json({
        success: true,
        message: 'Service connection updated successfully',
        data: updatedConnection
      });
    } catch (error) {
      // Handle unique constraint violation
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return next(new AppError('Connection number already exists', 400));
      }
      next(error);
    }
  },

  /**
   * DELETE /api/connections/:id - Delete connection (soft delete)
   */
  deleteConnection: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if connection exists
      const existingConnection = await connectionModel.findById(id);
      if (!existingConnection) {
        return next(new AppError('Service connection not found', 404));
      }

      // Soft delete (set status to Disconnected)
      const deletedConnection = await connectionModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Service connection disconnected successfully',
        data: deletedConnection
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = connectionController;
