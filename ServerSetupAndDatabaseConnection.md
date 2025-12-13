I'm building a Node.js backend for a Utility Management System using Express and SQL Server (mssql package). I need to set up the initial server structure.

TECH STACK:
- Node.js with Express
- SQL Server (Microsoft SQL Server)
- mssql package for database connection
- dotenv for environment variables
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- express-validator for validation
- cors for cross-origin requests
- helmet for security
- morgan for logging

DATABASE CONNECTION DETAILS:
- Server: localhost
- Database: UtilityManagementDB
- Port: 1433
- Authentication: SQL Server authentication

EXISTING FOLDER STRUCTURE:
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── package.json
└── server.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILES TO CREATE:

1. server.js (Main entry point)
Create the main Express server with:
- Import all required packages (express, cors, helmet, morgan, dotenv)
- Configure middleware (cors, helmet, express.json, express.urlencoded, morgan)
- Import all routes
- Global error handler
- Server listen on port from .env (default 5000)
- Graceful shutdown handler

Structure:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes (will be added)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/customers', require('./routes/customerRoutes'));
// ... more routes

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. config/database.js (SQL Server connection pool)
Create database configuration with connection pool:

Requirements:
- Use mssql package
- Create connection pool configuration
- Export pool and query execution function
- Handle connection errors gracefully
- Use environment variables for credentials
- Add connection retry logic
- Test connection on startup

Structure:
```javascript
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true, // Use encryption for Azure
    trustServerCertificate: true, // Trust self-signed certificates for local development
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create connection pool
let pool = null;

const getPool = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('✅ Database connected successfully');
      return pool;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }
  return pool;
};

// Helper function to execute queries
const query = async (queryString, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(queryString);
    return result;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

// Helper function to execute stored procedures
const executeProcedure = async (procedureName, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error('Stored procedure execution error:', error);
    throw error;
  }
};

// Close pool on app termination
const closePool = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Database connection pool closed');
    }
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  sql,
  getPool,
  query,
  executeProcedure,
  closePool
};
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. .env (Environment variables)
Create .env file with all necessary configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_SERVER=localhost
DB_DATABASE=UtilityManagementDB
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_PORT=1433

# JWT Configuration
JWT_SECRET=a3f5b8c2d9e1f4a7b6c3d8e2f5a9b4c7d1e6f3a8b5c2d9e4f7a1b8c5d2e9f6a3b
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. middleware/errorHandler.js (Global error handler)
Create centralized error handling:
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // SQL Server errors
  if (err.name === 'ConnectionError') {
    const message = 'Database connection error';
    error = new AppError(message, 500);
  }

  if (err.name === 'RequestError') {
    const message = 'Database request error';
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = 'Validation error';
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
};

module.exports = { AppError, errorHandler };
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. utils/logger.js (Optional - Winston logger setup)
Create logging utility:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TESTING THE SETUP:

After creating these files, test with:

1. Start server:
```bash
npm run dev
```

2. Test health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

3. Database connection should log:
✅ Database connected successfully
🚀 Server running on port 5000
📍 Environment: development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please create all these files with:
- Proper error handling
- Environment variable usage
- Console logging for debugging
- Comments explaining each section
- Production-ready code structure

Make it clean, professional, and well-organized!