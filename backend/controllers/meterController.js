const meterModel = require('../models/meterModel');
const meterReadingModel = require('../models/meterReadingModel');
const { AppError } = require('../middle-ware/errorHandler');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METER CONTROLLER
// Handle HTTP requests for meter and meter reading operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const meterController = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // METER ENDPOINTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * GET /api/meters - Get all meters
   * Supports query parameters:
   * - search: Search term for meter number, customer name, connection number
   * - status: Filter by status (Active, Faulty, Replaced, Removed)
   */
  getAllMeters: async (req, res, next) => {
    try {
      const { search, status } = req.query;

      let meters;

      if (search) {
        meters = await meterModel.search(search);
      } else if (status && status !== 'All') {
        meters = await meterModel.filterByStatus(status);
      } else {
        meters = await meterModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: meters.length,
        data: meters
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/:id - Get meter by ID
   */
  getMeterById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const meter = await meterModel.findById(id);

      if (!meter) {
        return next(new AppError('Meter not found', 404));
      }

      res.status(200).json({
        success: true,
        data: meter
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/connection/:connectionId - Get meters by connection
   */
  getMetersByConnection: async (req, res, next) => {
    try {
      const { connectionId } = req.params;

      const meters = await meterModel.findByConnection(connectionId);

      res.status(200).json({
        success: true,
        count: meters.length,
        data: meters
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/stats/summary - Get meter statistics
   */
  getMeterStats: async (req, res, next) => {
    try {
      const stats = await meterModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/meters - Create new meter
   */
  createMeter: async (req, res, next) => {
    try {
      const meterData = req.body;

      // Validate required fields
      const requiredFields = ['connection_id', 'meter_number', 'meter_type'];
      const missingFields = requiredFields.filter(field => !meterData[field]);

      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate meter type
      const validTypes = ['Digital', 'Analog', 'Smart Meter'];
      if (!validTypes.includes(meterData.meter_type)) {
        return next(new AppError('Invalid meter type. Must be: Digital, Analog, or Smart Meter', 400));
      }

      const newMeter = await meterModel.create(meterData);

      res.status(201).json({
        success: true,
        message: 'Meter created successfully',
        data: newMeter
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/meters/:id - Update meter
   */
  updateMeter: async (req, res, next) => {
    try {
      const { id } = req.params;
      const meterData = req.body;

      // Check if meter exists
      const existingMeter = await meterModel.findById(id);
      if (!existingMeter) {
        return next(new AppError('Meter not found', 404));
      }

      // Validate meter type if provided
      if (meterData.meter_type) {
        const validTypes = ['Digital', 'Analog', 'Smart Meter'];
        if (!validTypes.includes(meterData.meter_type)) {
          return next(new AppError('Invalid meter type', 400));
        }
      }

      // Validate status if provided
      if (meterData.meter_status) {
        const validStatuses = ['Active', 'Faulty', 'Replaced', 'Removed'];
        if (!validStatuses.includes(meterData.meter_status)) {
          return next(new AppError('Invalid meter status', 400));
        }
      }

      const updatedMeter = await meterModel.update(id, meterData);

      res.status(200).json({
        success: true,
        message: 'Meter updated successfully',
        data: updatedMeter
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/meters/:id/status - Update meter status
   */
  updateMeterStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return next(new AppError('Status is required', 400));
      }

      // Validate status
      const validStatuses = ['Active', 'Faulty', 'Replaced', 'Removed'];
      if (!validStatuses.includes(status)) {
        return next(new AppError('Invalid meter status', 400));
      }

      const updatedMeter = await meterModel.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Meter status updated successfully',
        data: updatedMeter
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/meters/:id/maintenance - Record maintenance
   */
  recordMaintenance: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const updatedMeter = await meterModel.recordMaintenance(id, notes);

      res.status(200).json({
        success: true,
        message: 'Maintenance recorded successfully',
        data: updatedMeter
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/meters/:id - Delete meter
   */
  deleteMeter: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if meter exists
      const existingMeter = await meterModel.findById(id);
      if (!existingMeter) {
        return next(new AppError('Meter not found', 404));
      }

      const deleted = await meterModel.delete(id);

      if (!deleted) {
        return next(new AppError('Failed to delete meter', 500));
      }

      res.status(200).json({
        success: true,
        message: 'Meter deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // METER READING ENDPOINTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * GET /api/meters/readings - Get all meter readings
   * Supports query parameters:
   * - type: Filter by reading type (Actual, Estimated, Customer-Submitted)
   * - unprocessed: Get readings without bills (true/false)
   */
  getAllReadings: async (req, res, next) => {
    try {
      const { type, unprocessed } = req.query;

      let readings;

      if (unprocessed === 'true') {
        readings = await meterReadingModel.findUnprocessed();
      } else if (type && type !== 'All') {
        readings = await meterReadingModel.filterByType(type);
      } else {
        readings = await meterReadingModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: readings.length,
        data: readings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/readings/:id - Get reading by ID
   */
  getReadingById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const reading = await meterReadingModel.findById(id);

      if (!reading) {
        return next(new AppError('Meter reading not found', 404));
      }

      res.status(200).json({
        success: true,
        data: reading
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/:meterId/readings - Get readings by meter
   */
  getReadingsByMeter: async (req, res, next) => {
    try {
      const { meterId } = req.params;

      const readings = await meterReadingModel.findByMeter(meterId);

      res.status(200).json({
        success: true,
        count: readings.length,
        data: readings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/readings/customer/:customerId - Get readings by customer
   */
  getReadingsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const readings = await meterReadingModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: readings.length,
        data: readings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/meters/readings/stats/summary - Get reading statistics
   */
  getReadingStats: async (req, res, next) => {
    try {
      const stats = await meterReadingModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/meters/readings - Create new meter reading
   * Uses sp_BulkMeterReadingEntry stored procedure
   */
  createReading: async (req, res, next) => {
    try {
      const readingData = req.body;

      // Validate required fields
      const requiredFields = ['meter_id', 'current_reading'];
      const missingFields = requiredFields.filter(field => !readingData[field]);

      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate reading type if provided
      if (readingData.reading_type) {
        const validTypes = ['Actual', 'Estimated', 'Customer-Submitted'];
        if (!validTypes.includes(readingData.reading_type)) {
          return next(new AppError('Invalid reading type', 400));
        }
      }

      const newReading = await meterReadingModel.create(readingData);

      res.status(201).json({
        success: true,
        message: 'Meter reading recorded successfully',
        data: newReading
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/meters/readings/:id - Update meter reading
   */
  updateReading: async (req, res, next) => {
    try {
      const { id } = req.params;
      const readingData = req.body;

      // Check if reading exists
      const existingReading = await meterReadingModel.findById(id);
      if (!existingReading) {
        return next(new AppError('Meter reading not found', 404));
      }

      // Validate reading type if provided
      if (readingData.reading_type) {
        const validTypes = ['Actual', 'Estimated', 'Customer-Submitted'];
        if (!validTypes.includes(readingData.reading_type)) {
          return next(new AppError('Invalid reading type', 400));
        }
      }

      const updatedReading = await meterReadingModel.update(id, readingData);

      res.status(200).json({
        success: true,
        message: 'Meter reading updated successfully',
        data: updatedReading
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/meters/readings/:id - Delete meter reading
   */
  deleteReading: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if reading exists
      const existingReading = await meterReadingModel.findById(id);
      if (!existingReading) {
        return next(new AppError('Meter reading not found', 404));
      }

      const deleted = await meterReadingModel.delete(id);

      if (!deleted) {
        return next(new AppError('Failed to delete meter reading', 500));
      }

      res.status(200).json({
        success: true,
        message: 'Meter reading deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = meterController;
