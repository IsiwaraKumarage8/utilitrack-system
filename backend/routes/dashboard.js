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

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    // Get total customers
    const customers = await pool.request()
      .query('SELECT COUNT(*) as total FROM Customers WHERE Status = \'Active\'');
    
    // Get total meters
    const meters = await pool.request()
      .query('SELECT COUNT(*) as total FROM Meters WHERE Status = \'Active\'');
    
    // Get total revenue (sum of all paid bills)
    const revenue = await pool.request()
      .query('SELECT ISNULL(SUM(TotalAmount), 0) as total FROM Bills WHERE Status = \'Paid\'');
    
    // Get pending bills
    const pending = await pool.request()
      .query('SELECT COUNT(*) as total FROM Bills WHERE Status = \'Pending\'');
    
    res.json({
      totalCustomers: customers.recordset[0].total,
      totalMeters: meters.recordset[0].total,
      totalRevenue: revenue.recordset[0].total,
      pendingBills: pending.recordset[0].total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET recent activities
router.get('/recent', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT TOP 10
        c.CustomerName,
        ut.UtilityName,
        m.MeterNumber,
        m.InstallationDate as ActivityDate,
        'New Meter Installation' as ActivityType
      FROM Meters m
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      ORDER BY m.InstallationDate DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;