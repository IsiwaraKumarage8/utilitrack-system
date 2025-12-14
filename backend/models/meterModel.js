const { query } = require('../config/database');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METER MODEL
// Database query functions for Meter operations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const meterModel = {
  /**
   * Get all meters with connection and customer details
   * @returns {Promise<Array>} Array of meter records
   */
  findAll: async () => {
    const queryString = `
      SELECT 
        m.meter_id,
        m.meter_number,
        m.meter_type,
        m.manufacturer,
        m.installation_date,
        m.last_maintenance_date,
        m.initial_reading,
        m.meter_status,
        m.notes,
        m.created_at,
        m.updated_at,
        sc.connection_id,
        sc.connection_number,
        sc.property_address,
        sc.connection_status,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email AS customer_email,
        c.phone AS customer_phone,
        ut.utility_name,
        ut.unit_of_measurement,
        (SELECT TOP 1 current_reading 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id 
         ORDER BY reading_date DESC) AS last_reading,
        (SELECT TOP 1 reading_date 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id 
         ORDER BY reading_date DESC) AS last_reading_date
      FROM Meter m
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      ORDER BY m.installation_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching meters: ${error.message}`);
    }
  },

  /**
   * Get meter by ID with full details
   * @param {number} meterId - Meter ID
   * @returns {Promise<Object>} Meter record
   */
  findById: async (meterId) => {
    const queryString = `
      SELECT 
        m.*,
        sc.connection_id,
        sc.connection_number,
        sc.property_address,
        sc.connection_status,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.address AS customer_address,
        ut.utility_name,
        ut.unit_of_measurement,
        (SELECT TOP 1 current_reading 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id 
         ORDER BY reading_date DESC) AS last_reading,
        (SELECT TOP 1 reading_date 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id 
         ORDER BY reading_date DESC) AS last_reading_date,
        (SELECT COUNT(*) 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id) AS total_readings
      FROM Meter m
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE m.meter_id = @meterId
    `;
    
    try {
      const result = await query(queryString, { meterId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching meter: ${error.message}`);
    }
  },

  /**
   * Search meters by meter number, customer name, or connection number
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching meter records
   */
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        m.meter_id,
        m.meter_number,
        m.meter_type,
        m.manufacturer,
        m.installation_date,
        m.meter_status,
        sc.connection_number,
        sc.property_address,
        c.first_name + ' ' + c.last_name AS customer_name,
        ut.utility_name
      FROM Meter m
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE 
        m.meter_number LIKE '%' + @searchTerm + '%'
        OR c.first_name LIKE '%' + @searchTerm + '%'
        OR c.last_name LIKE '%' + @searchTerm + '%'
        OR sc.connection_number LIKE '%' + @searchTerm + '%'
      ORDER BY m.installation_date DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching meters: ${error.message}`);
    }
  },

  /**
   * Filter meters by status
   * @param {string} status - Meter status
   * @returns {Promise<Array>} Array of filtered meters
   */
  filterByStatus: async (status) => {
    const queryString = `
      SELECT 
        m.meter_id,
        m.meter_number,
        m.meter_type,
        m.manufacturer,
        m.installation_date,
        m.meter_status,
        sc.connection_number,
        c.first_name + ' ' + c.last_name AS customer_name,
        ut.utility_name
      FROM Meter m
      INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE m.meter_status = @status
      ORDER BY m.installation_date DESC
    `;
    
    try {
      const result = await query(queryString, { status });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering meters by status: ${error.message}`);
    }
  },

  /**
   * Get meters by connection ID
   * @param {number} connectionId - Connection ID
   * @returns {Promise<Array>} Array of meters for the connection
   */
  findByConnection: async (connectionId) => {
    const queryString = `
      SELECT 
        m.*,
        (SELECT TOP 1 current_reading 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id 
         ORDER BY reading_date DESC) AS last_reading,
        (SELECT TOP 1 reading_date 
         FROM Meter_Reading mr 
         WHERE mr.meter_id = m.meter_id 
         ORDER BY reading_date DESC) AS last_reading_date
      FROM Meter m
      WHERE m.connection_id = @connectionId
      ORDER BY m.installation_date DESC
    `;
    
    try {
      const result = await query(queryString, { connectionId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching meters by connection: ${error.message}`);
    }
  },

  /**
   * Get meter statistics
   * @returns {Promise<Object>} Statistics object
   */
  getStats: async () => {
    const queryString = `
      SELECT 
        COUNT(*) AS total_meters,
        COUNT(CASE WHEN meter_status = 'Active' THEN 1 END) AS active_meters,
        COUNT(CASE WHEN meter_status = 'Faulty' THEN 1 END) AS faulty_meters,
        COUNT(CASE WHEN meter_status = 'Replaced' THEN 1 END) AS replaced_meters,
        COUNT(CASE WHEN meter_status = 'Removed' THEN 1 END) AS removed_meters,
        COUNT(CASE WHEN meter_type = 'Smart Meter' THEN 1 END) AS smart_meters,
        COUNT(CASE WHEN meter_type = 'Digital' THEN 1 END) AS digital_meters,
        COUNT(CASE WHEN meter_type = 'Analog' THEN 1 END) AS analog_meters,
        COUNT(CASE WHEN last_maintenance_date IS NULL THEN 1 END) AS meters_needing_maintenance
      FROM Meter
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching meter statistics: ${error.message}`);
    }
  },

  /**
   * Create new meter
   * @param {Object} meterData - Meter data
   * @returns {Promise<Object>} Created meter record
   */
  create: async (meterData) => {
    const queryString = `
      INSERT INTO Meter (
        connection_id,
        meter_number,
        meter_type,
        manufacturer,
        installation_date,
        initial_reading,
        meter_status,
        notes
      )
      VALUES (
        @connection_id,
        @meter_number,
        @meter_type,
        @manufacturer,
        @installation_date,
        @initial_reading,
        @meter_status,
        @notes
      );
      
      SELECT * FROM Meter WHERE meter_id = SCOPE_IDENTITY();
    `;
    
    try {
      const result = await query(queryString, {
        connection_id: meterData.connection_id,
        meter_number: meterData.meter_number,
        meter_type: meterData.meter_type,
        manufacturer: meterData.manufacturer || null,
        installation_date: meterData.installation_date || new Date().toISOString().split('T')[0],
        initial_reading: meterData.initial_reading || 0.00,
        meter_status: meterData.meter_status || 'Active',
        notes: meterData.notes || null
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error creating meter: ${error.message}`);
    }
  },

  /**
   * Update meter
   * @param {number} meterId - Meter ID
   * @param {Object} meterData - Updated meter data
   * @returns {Promise<Object>} Updated meter record
   */
  update: async (meterId, meterData) => {
    const queryString = `
      UPDATE Meter
      SET 
        meter_type = @meter_type,
        manufacturer = @manufacturer,
        last_maintenance_date = @last_maintenance_date,
        meter_status = @meter_status,
        notes = @notes,
        updated_at = GETDATE()
      WHERE meter_id = @meterId;
      
      SELECT * FROM Meter WHERE meter_id = @meterId;
    `;
    
    try {
      const result = await query(queryString, {
        meterId,
        meter_type: meterData.meter_type,
        manufacturer: meterData.manufacturer || null,
        last_maintenance_date: meterData.last_maintenance_date || null,
        meter_status: meterData.meter_status,
        notes: meterData.notes || null
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error updating meter: ${error.message}`);
    }
  },

  /**
   * Update meter status
   * @param {number} meterId - Meter ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated meter record
   */
  updateStatus: async (meterId, status) => {
    const queryString = `
      UPDATE Meter
      SET 
        meter_status = @status,
        updated_at = GETDATE()
      WHERE meter_id = @meterId;
      
      SELECT * FROM Meter WHERE meter_id = @meterId;
    `;
    
    try {
      const result = await query(queryString, { meterId, status });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error updating meter status: ${error.message}`);
    }
  },

  /**
   * Record maintenance
   * @param {number} meterId - Meter ID
   * @param {string} notes - Maintenance notes
   * @returns {Promise<Object>} Updated meter record
   */
  recordMaintenance: async (meterId, notes = null) => {
    const queryString = `
      UPDATE Meter
      SET 
        last_maintenance_date = GETDATE(),
        notes = COALESCE(@notes, notes),
        updated_at = GETDATE()
      WHERE meter_id = @meterId;
      
      SELECT * FROM Meter WHERE meter_id = @meterId;
    `;
    
    try {
      const result = await query(queryString, { meterId, notes });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error recording maintenance: ${error.message}`);
    }
  },

  /**
   * Delete meter
   * @param {number} meterId - Meter ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (meterId) => {
    const queryString = `
      DELETE FROM Meter
      WHERE meter_id = @meterId;
    `;
    
    try {
      const result = await query(queryString, { meterId });
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting meter: ${error.message}`);
    }
  }
};

module.exports = meterModel;
