const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Database config
const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'UtiliTrackDB',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// GET all customers
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT * FROM Customers ORDER BY CustomerID DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Customers WHERE CustomerID = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new customer
router.post('/', async (req, res) => {
  try {
    const { CustomerName, CustomerType, Address, PhoneNumber, Email, NIC } = req.body;
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('CustomerName', sql.NVarChar, CustomerName)
      .input('CustomerType', sql.NVarChar, CustomerType)
      .input('Address', sql.NVarChar, Address)
      .input('PhoneNumber', sql.NVarChar, PhoneNumber)
      .input('Email', sql.NVarChar, Email)
      .input('NIC', sql.NVarChar, NIC)
      .query(`
        INSERT INTO Customers (CustomerName, CustomerType, Address, PhoneNumber, Email, NIC)
        OUTPUT INSERTED.*
        VALUES (@CustomerName, @CustomerType, @Address, @PhoneNumber, @Email, @NIC)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const { CustomerName, CustomerType, Address, PhoneNumber, Email, NIC, Status } = req.body;
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('CustomerName', sql.NVarChar, CustomerName)
      .input('CustomerType', sql.NVarChar, CustomerType)
      .input('Address', sql.NVarChar, Address)
      .input('PhoneNumber', sql.NVarChar, PhoneNumber)
      .input('Email', sql.NVarChar, Email)
      .input('NIC', sql.NVarChar, NIC)
      .input('Status', sql.NVarChar, Status)
      .query(`
        UPDATE Customers 
        SET CustomerName = @CustomerName, CustomerType = @CustomerType, 
            Address = @Address, PhoneNumber = @PhoneNumber, 
            Email = @Email, NIC = @NIC, Status = @Status
        OUTPUT INSERTED.*
        WHERE CustomerID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Customers WHERE CustomerID = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;