const sql = require('mssql');
const dbConfig = require('../config/database');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE CONNECTION MODEL
// Database operations for Service_Connection table
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const connectionModel = {
  /**
   * Get all service connections with customer and utility details
   * Joins: Customer, Utility_Type, Tariff_Plan, Meter tables
   */
  findAll: async () => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT 
          sc.connection_id,
          sc.customer_id,
          sc.utility_type_id,
          sc.connection_number,
          sc.connection_date,
          sc.disconnection_date,
          sc.connection_status,
          sc.property_address,
          sc.notes,
          sc.created_at,
          sc.updated_at,
          -- Customer details
          c.first_name + ' ' + c.last_name AS customer_name,
          c.customer_type,
          c.email AS customer_email,
          c.phone AS customer_phone,
          -- Utility details
          ut.utility_name,
          ut.unit_of_measurement,
          -- Meter details (get the first/primary meter for this connection)
          m.meter_number,
          m.meter_type,
          -- Tariff details
          tp.tariff_name,
          tp.rate_per_unit,
          -- Latest reading consumption
          (
            SELECT TOP 1 consumption 
            FROM Meter_Reading mr 
            INNER JOIN Meter m2 ON mr.meter_id = m2.meter_id
            WHERE m2.connection_id = sc.connection_id
            ORDER BY mr.reading_date DESC
          ) AS current_consumption
        FROM Service_Connection sc
        INNER JOIN Customer c ON sc.customer_id = c.customer_id
        INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
        LEFT JOIN Meter m ON sc.connection_id = m.connection_id
        LEFT JOIN Tariff_Plan tp ON sc.utility_type_id = tp.utility_type_id 
          AND tp.customer_type = c.customer_type
        ORDER BY sc.connection_date DESC
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Database error in findAll: ${error.message}`);
    }
  },

  /**
   * Get service connection by ID with full details
   */
  findById: async (connectionId) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('connectionId', sql.Int, connectionId)
        .query(`
          SELECT 
            sc.connection_id,
            sc.customer_id,
            sc.utility_type_id,
            sc.connection_number,
            sc.connection_date,
            sc.disconnection_date,
            sc.connection_status,
            sc.property_address,
            sc.notes,
            sc.created_at,
            sc.updated_at,
            -- Customer details
            c.first_name + ' ' + c.last_name AS customer_name,
            c.customer_type,
            c.email AS customer_email,
            c.phone AS customer_phone,
            -- Utility details
            ut.utility_name,
            ut.unit_of_measurement,
            -- Meter details
            m.meter_number,
            m.meter_type,
            m.installation_date,
            -- Tariff details
            tp.tariff_name,
            tp.rate_per_unit,
            tp.fixed_charge
          FROM Service_Connection sc
          INNER JOIN Customer c ON sc.customer_id = c.customer_id
          INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
          LEFT JOIN Meter m ON sc.connection_id = m.connection_id
          LEFT JOIN Tariff_Plan tp ON sc.utility_type_id = tp.utility_type_id 
            AND tp.customer_type = c.customer_type
          WHERE sc.connection_id = @connectionId
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Database error in findById: ${error.message}`);
    }
  },

  /**
   * Search connections by customer name, connection number, or property address
   */
  search: async (searchTerm) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('searchTerm', sql.VarChar, `%${searchTerm}%`)
        .query(`
          SELECT 
            sc.connection_id,
            sc.customer_id,
            sc.utility_type_id,
            sc.connection_number,
            sc.connection_date,
            sc.disconnection_date,
            sc.connection_status,
            sc.property_address,
            sc.notes,
            c.first_name + ' ' + c.last_name AS customer_name,
            c.customer_type,
            ut.utility_name,
            ut.unit_of_measurement,
            m.meter_number,
            m.meter_type,
            tp.tariff_name,
            (
              SELECT TOP 1 consumption 
              FROM Meter_Reading mr 
              INNER JOIN Meter m2 ON mr.meter_id = m2.meter_id
              WHERE m2.connection_id = sc.connection_id
              ORDER BY mr.reading_date DESC
            ) AS current_consumption
          FROM Service_Connection sc
          INNER JOIN Customer c ON sc.customer_id = c.customer_id
          INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
          LEFT JOIN Meter m ON sc.connection_id = m.connection_id
          LEFT JOIN Tariff_Plan tp ON sc.utility_type_id = tp.utility_type_id 
            AND tp.customer_type = c.customer_type
          WHERE 
            c.first_name LIKE @searchTerm 
            OR c.last_name LIKE @searchTerm
            OR sc.connection_number LIKE @searchTerm
            OR sc.property_address LIKE @searchTerm
          ORDER BY sc.connection_date DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Database error in search: ${error.message}`);
    }
  },

  /**
   * Filter connections by utility type
   */
  filterByUtility: async (utilityName) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('utilityName', sql.VarChar, utilityName)
        .query(`
          SELECT 
            sc.connection_id,
            sc.customer_id,
            sc.utility_type_id,
            sc.connection_number,
            sc.connection_date,
            sc.disconnection_date,
            sc.connection_status,
            sc.property_address,
            sc.notes,
            c.first_name + ' ' + c.last_name AS customer_name,
            c.customer_type,
            ut.utility_name,
            ut.unit_of_measurement,
            m.meter_number,
            m.meter_type,
            tp.tariff_name,
            (
              SELECT TOP 1 consumption 
              FROM Meter_Reading mr 
              INNER JOIN Meter m2 ON mr.meter_id = m2.meter_id
              WHERE m2.connection_id = sc.connection_id
              ORDER BY mr.reading_date DESC
            ) AS current_consumption
          FROM Service_Connection sc
          INNER JOIN Customer c ON sc.customer_id = c.customer_id
          INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
          LEFT JOIN Meter m ON sc.connection_id = m.connection_id
          LEFT JOIN Tariff_Plan tp ON sc.utility_type_id = tp.utility_type_id 
            AND tp.customer_type = c.customer_type
          WHERE ut.utility_name = @utilityName
          ORDER BY sc.connection_date DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Database error in filterByUtility: ${error.message}`);
    }
  },

  /**
   * Filter connections by status
   */
  filterByStatus: async (status) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('status', sql.VarChar, status)
        .query(`
          SELECT 
            sc.connection_id,
            sc.customer_id,
            sc.utility_type_id,
            sc.connection_number,
            sc.connection_date,
            sc.disconnection_date,
            sc.connection_status,
            sc.property_address,
            sc.notes,
            c.first_name + ' ' + c.last_name AS customer_name,
            c.customer_type,
            ut.utility_name,
            ut.unit_of_measurement,
            m.meter_number,
            m.meter_type,
            tp.tariff_name,
            (
              SELECT TOP 1 consumption 
              FROM Meter_Reading mr 
              INNER JOIN Meter m2 ON mr.meter_id = m2.meter_id
              WHERE m2.connection_id = sc.connection_id
              ORDER BY mr.reading_date DESC
            ) AS current_consumption
          FROM Service_Connection sc
          INNER JOIN Customer c ON sc.customer_id = c.customer_id
          INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
          LEFT JOIN Meter m ON sc.connection_id = m.connection_id
          LEFT JOIN Tariff_Plan tp ON sc.utility_type_id = tp.utility_type_id 
            AND tp.customer_type = c.customer_type
          WHERE sc.connection_status = @status
          ORDER BY sc.connection_date DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Database error in filterByStatus: ${error.message}`);
    }
  },

  /**
   * Create new service connection
   */
  create: async (connectionData) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('customer_id', sql.Int, connectionData.customer_id)
        .input('utility_type_id', sql.Int, connectionData.utility_type_id)
        .input('connection_number', sql.VarChar, connectionData.connection_number)
        .input('connection_date', sql.Date, connectionData.connection_date || new Date())
        .input('connection_status', sql.VarChar, connectionData.connection_status || 'Pending')
        .input('property_address', sql.VarChar, connectionData.property_address)
        .input('notes', sql.VarChar, connectionData.notes || null)
        .query(`
          INSERT INTO Service_Connection (
            customer_id, utility_type_id, connection_number, 
            connection_date, connection_status, property_address, notes
          )
          OUTPUT INSERTED.*
          VALUES (
            @customer_id, @utility_type_id, @connection_number,
            @connection_date, @connection_status, @property_address, @notes
          )
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Database error in create: ${error.message}`);
    }
  },

  /**
   * Update service connection
   */
  update: async (connectionId, connectionData) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      // Build dynamic SET clause based on provided fields
      const updates = [];
      const request = pool.request().input('connectionId', sql.Int, connectionId);

      if (connectionData.customer_id !== undefined) {
        updates.push('customer_id = @customer_id');
        request.input('customer_id', sql.Int, connectionData.customer_id);
      }
      if (connectionData.utility_type_id !== undefined) {
        updates.push('utility_type_id = @utility_type_id');
        request.input('utility_type_id', sql.Int, connectionData.utility_type_id);
      }
      if (connectionData.connection_number !== undefined) {
        updates.push('connection_number = @connection_number');
        request.input('connection_number', sql.VarChar, connectionData.connection_number);
      }
      if (connectionData.connection_date !== undefined) {
        updates.push('connection_date = @connection_date');
        request.input('connection_date', sql.Date, connectionData.connection_date);
      }
      if (connectionData.disconnection_date !== undefined) {
        updates.push('disconnection_date = @disconnection_date');
        request.input('disconnection_date', sql.Date, connectionData.disconnection_date);
      }
      if (connectionData.connection_status !== undefined) {
        updates.push('connection_status = @connection_status');
        request.input('connection_status', sql.VarChar, connectionData.connection_status);
      }
      if (connectionData.property_address !== undefined) {
        updates.push('property_address = @property_address');
        request.input('property_address', sql.VarChar, connectionData.property_address);
      }
      if (connectionData.notes !== undefined) {
        updates.push('notes = @notes');
        request.input('notes', sql.VarChar, connectionData.notes);
      }

      // Always update the updated_at timestamp
      updates.push('updated_at = GETDATE()');

      if (updates.length === 1) { // Only updated_at
        throw new Error('No fields to update');
      }

      const result = await request.query(`
        UPDATE Service_Connection
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE connection_id = @connectionId
      `);

      return result.recordset[0];
    } catch (error) {
      throw new Error(`Database error in update: ${error.message}`);
    }
  },

  /**
   * Delete service connection (soft delete by setting status to Disconnected)
   */
  delete: async (connectionId) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('connectionId', sql.Int, connectionId)
        .query(`
          UPDATE Service_Connection
          SET 
            connection_status = 'Disconnected',
            disconnection_date = GETDATE(),
            updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE connection_id = @connectionId
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Database error in delete: ${error.message}`);
    }
  },

  /**
   * Get connections by customer ID
   */
  findByCustomerId: async (customerId) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('customerId', sql.Int, customerId)
        .query(`
          SELECT 
            sc.connection_id,
            sc.connection_number,
            sc.connection_date,
            sc.connection_status,
            sc.property_address,
            ut.utility_name,
            m.meter_number
          FROM Service_Connection sc
          INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
          LEFT JOIN Meter m ON sc.connection_id = m.connection_id
          WHERE sc.customer_id = @customerId
          ORDER BY sc.connection_date DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Database error in findByCustomerId: ${error.message}`);
    }
  }
};

module.exports = connectionModel;
