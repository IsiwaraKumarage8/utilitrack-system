const { query } = require('../config/database');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METER READING MODEL
// Database query functions for Meter Reading operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const meterReadingModel = {
  /**
   * Get all meter readings with meter and customer details
   * @returns {Promise<Array>} Array of meter reading records
   */
  findAll: async () => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.reading_date,
        mr.current_reading,
        mr.previous_reading,
        mr.consumption,
        mr.reading_type,
        mr.notes,
        mr.created_at,
        m.meter_id,
        m.meter_number,
        m.meter_type,
        sc.connection_id,
        sc.connection_number,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name,
        ut.unit_of_measurement,
        u.user_id AS reader_id,
        u.full_name AS reader_name,
        CASE 
          WHEN EXISTS (SELECT 1 FROM Billing b WHERE b.reading_id = mr.reading_id)
          THEN 'Yes' ELSE 'No'
        END AS bill_generated
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON mr.reader_id = u.user_id
      ORDER BY mr.reading_date DESC, mr.reading_id DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching meter readings: ${error.message}`);
    }
  },

  /**
   * Get meter reading by ID with full details
   * @param {number} readingId - Reading ID
   * @returns {Promise<Object>} Meter reading record
   */
  findById: async (readingId) => {
    const queryString = `
      SELECT 
        mr.*,
        m.meter_id,
        m.meter_number,
        m.meter_type,
        m.manufacturer,
        sc.connection_id,
        sc.connection_number,
        sc.property_address,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email AS customer_email,
        c.phone AS customer_phone,
        ut.utility_name,
        ut.unit_of_measurement,
        u.user_id AS reader_id,
        u.full_name AS reader_name,
        u.user_role AS reader_role,
        b.bill_id,
        b.bill_number
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON mr.reader_id = u.user_id
      LEFT JOIN Billing b ON mr.reading_id = b.reading_id
      WHERE mr.reading_id = @readingId
    `;
    
    try {
      const result = await query(queryString, { readingId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching meter reading: ${error.message}`);
    }
  },

  /**
   * Get readings by meter ID
   * @param {number} meterId - Meter ID
   * @returns {Promise<Array>} Array of readings for the meter
   */
  findByMeter: async (meterId) => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.reading_date,
        mr.current_reading,
        mr.previous_reading,
        mr.consumption,
        mr.reading_type,
        mr.notes,
        u.full_name AS reader_name,
        CASE 
          WHEN EXISTS (SELECT 1 FROM Billing b WHERE b.reading_id = mr.reading_id)
          THEN 'Yes' ELSE 'No'
        END AS bill_generated
      FROM Meter_Reading mr
      LEFT JOIN [User] u ON mr.reader_id = u.user_id
      WHERE mr.meter_id = @meterId
      ORDER BY mr.reading_date DESC
    `;
    
    try {
      const result = await query(queryString, { meterId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching meter readings: ${error.message}`);
    }
  },

  /**
   * Get readings by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Array of readings for the customer
   */
  findByCustomer: async (customerId) => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.reading_date,
        mr.current_reading,
        mr.previous_reading,
        mr.consumption,
        mr.reading_type,
        m.meter_number,
        sc.connection_number,
        ut.utility_name,
        u.full_name AS reader_name
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON mr.reader_id = u.user_id
      WHERE sc.customer_id = @customerId
      ORDER BY mr.reading_date DESC
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer readings: ${error.message}`);
    }
  },

  /**
   * Filter readings by type
   * @param {string} type - Reading type
   * @returns {Promise<Array>} Array of filtered readings
   */
  filterByType: async (type) => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.reading_date,
        mr.current_reading,
        mr.consumption,
        mr.reading_type,
        m.meter_number,
        sc.connection_number,
        c.first_name + ' ' + c.last_name AS customer_name,
        ut.utility_name,
        u.full_name AS reader_name
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON mr.reader_id = u.user_id
      WHERE mr.reading_type = @type
      ORDER BY mr.reading_date DESC
    `;
    
    try {
      const result = await query(queryString, { type });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering readings by type: ${error.message}`);
    }
  },

  /**
   * Get readings without bills (unprocessed)
   * @returns {Promise<Array>} Array of unprocessed readings
   */
  findUnprocessed: async () => {
    const queryString = `
      SELECT 
        mr.reading_id,
        mr.reading_date,
        mr.current_reading,
        mr.consumption,
        mr.reading_type,
        m.meter_id,
        m.meter_number,
        sc.connection_id,
        sc.connection_number,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name,
        ut.unit_of_measurement
      FROM Meter_Reading mr
      INNER JOIN Meter m ON mr.meter_id = m.meter_id
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE NOT EXISTS (
        SELECT 1 FROM Billing b WHERE b.reading_id = mr.reading_id
      )
      AND mr.reading_type = 'Actual'
      AND sc.connection_status = 'Active'
      ORDER BY mr.reading_date ASC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching unprocessed readings: ${error.message}`);
    }
  },

  /**
   * Get reading statistics
   * @returns {Promise<Object>} Statistics object
   */
  getStats: async () => {
    const queryString = `
      SELECT 
        COUNT(*) AS total_readings,
        COUNT(CASE WHEN reading_type = 'Actual' THEN 1 END) AS actual_readings,
        COUNT(CASE WHEN reading_type = 'Estimated' THEN 1 END) AS estimated_readings,
        COUNT(CASE WHEN reading_type = 'Customer-Submitted' THEN 1 END) AS customer_submitted,
        COUNT(CASE 
          WHEN NOT EXISTS (SELECT 1 FROM Billing b WHERE b.reading_id = mr.reading_id)
          THEN 1 END) AS unprocessed_readings,
        AVG(consumption) AS avg_consumption,
        MAX(consumption) AS max_consumption,
        MIN(consumption) AS min_consumption
      FROM Meter_Reading mr
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching reading statistics: ${error.message}`);
    }
  },

  /**
   * Create meter reading using stored procedure
   * @param {Object} readingData - Reading data
   * @returns {Promise<Object>} Created reading record with consumption details
   */
  create: async (readingData) => {
    try {
      const pool = await require('../config/database').getPool();
      const sql = require('../config/database').sql;
      
      const request = pool.request();
      request.input('meter_id', sql.Int, readingData.meter_id);
      request.input('current_reading', sql.Decimal(10, 2), readingData.current_reading);
      request.input('reading_date', sql.Date, readingData.reading_date || new Date().toISOString().split('T')[0]);
      request.input('reading_type', sql.VarChar(20), readingData.reading_type || 'Actual');
      request.input('reader_id', sql.Int, readingData.reader_id || null);
      request.input('notes', sql.VarChar(500), readingData.notes || null);
      
      const result = await request.execute('sp_BulkMeterReadingEntry');
      
      // Return the result from the stored procedure
      if (result.recordset && result.recordset.length > 0) {
        const spResult = result.recordset[0];
        
        // Fetch the complete reading record
        const reading = await meterReadingModel.findById(spResult.reading_id);
        return reading;
      }
      
      throw new Error('Failed to create meter reading');
      
    } catch (error) {
      throw new Error(`Error creating meter reading: ${error.message}`);
    }
  },

  /**
   * Update meter reading
   * @param {number} readingId - Reading ID
   * @param {Object} readingData - Updated reading data
   * @returns {Promise<Object>} Updated reading record
   */
  update: async (readingId, readingData) => {
    const queryString = `
      UPDATE Meter_Reading
      SET 
        reading_type = @reading_type,
        notes = @notes
      WHERE reading_id = @readingId;
      
      SELECT * FROM Meter_Reading WHERE reading_id = @readingId;
    `;
    
    try {
      const result = await query(queryString, {
        readingId,
        reading_type: readingData.reading_type,
        notes: readingData.notes || null
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error updating meter reading: ${error.message}`);
    }
  },

  /**
   * Delete meter reading
   * @param {number} readingId - Reading ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (readingId) => {
    const queryString = `
      -- Check if reading has a bill
      IF EXISTS (SELECT 1 FROM Billing WHERE reading_id = @readingId)
      BEGIN
        RAISERROR('Cannot delete reading that has an associated bill', 16, 1);
        RETURN;
      END
      
      DELETE FROM Meter_Reading
      WHERE reading_id = @readingId;
    `;
    
    try {
      const result = await query(queryString, { readingId });
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting meter reading: ${error.message}`);
    }
  }
};

module.exports = meterReadingModel;
