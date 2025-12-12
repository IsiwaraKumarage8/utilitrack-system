const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'UtiliTrackDB',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Import routes
const customersRouter = require('./routes/customers');
const metersRouter = require('./routes/meters');
const dashboardRouter = require('./routes/dashboard');

// Use routes
app.use('/api/customers', customersRouter);
app.use('/api/meters', metersRouter);
app.use('/api/dashboard', dashboardRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'UtiliTrack API Server',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      meters: '/api/meters',
      dashboard: '/api/dashboard',
      test: '/api/test'
    }
  });
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT @@VERSION AS version, DB_NAME() AS database');
    res.json({ 
      message: 'Database connected successfully!', 
      version: result.recordset[0].version,
      database: result.recordset[0].database
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 UtiliTrack API Server`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✅ Customers API: http://localhost:${PORT}/api/customers`);
  console.log(`✅ Dashboard API: http://localhost:${PORT}/api/dashboard/stats\n`);
});