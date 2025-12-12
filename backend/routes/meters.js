const express = require('express');
const sql = require('mssql');
const router = express.Router();

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'UtiliTrackDB',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// GET all meters with customer and utility info
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        m.MeterID, m.MeterNumber, m.InstallationDate, m.LastReadingDate, m.Status,
        c.CustomerID, c.CustomerName, c.CustomerType,
        ut.UtilityTypeID, ut.UtilityName, ut.Unit
      FROM Meters m
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      ORDER BY m.MeterID DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET meters by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('customerId', sql.Int, req.params.customerId)
      .query(`
        SELECT 
          m.MeterID, m.MeterNumber, m.InstallationDate, m.Status,
          ut.UtilityName, ut.Unit
        FROM Meters m
        JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
        WHERE m.CustomerID = @customerId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new meter
router.post('/', async (req, res) => {
  try {
    const { CustomerID, UtilityTypeID, MeterNumber } = req.body;
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('CustomerID', sql.Int, CustomerID)
      .input('UtilityTypeID', sql.Int, UtilityTypeID)
      .input('MeterNumber', sql.NVarChar, MeterNumber)
      .query(`
        INSERT INTO Meters (CustomerID, UtilityTypeID, MeterNumber)
        OUTPUT INSERTED.*
        VALUES (@CustomerID, @UtilityTypeID, @MeterNumber)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;