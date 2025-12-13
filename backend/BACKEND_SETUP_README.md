# Backend Setup Documentation

## ✅ Backend Setup Complete!

This document describes the backend server setup for the Utility Management System.

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── auth.js
│   └── database.js              ✅ SQL Server connection pool
├── controllers/
│   ├── authController.js
│   ├── billingController.js
│   ├── complaintController.js
│   ├── customerController.js
│   ├── meterController.js
│   ├── paymentController.js
│   └── reportController.js
├── middle-ware/
│   ├── authMiddleware.js
│   ├── errorHandler.js          ✅ Global error handling
│   └── validateMiddleware.js
├── models/
│   ├── billingModel.js
│   ├── customerModel.js
│   └── paymentModel.js
├── routes/
│   ├── authRoutes.js
│   ├── billingRoutes.js
│   ├── customerRoutes.js
│   └── paymentRoutes.js
├── utils/
│   ├── helpers.js
│   └── logger.js                ✅ Winston logger
├── logs/                        ✅ Log files directory
│   ├── error.log
│   └── combined.log
├── .env                         ✅ Environment variables
├── package.json
├── server.js                    ✅ Main Express server
└── test-server.js               ✅ Server test script
```

---

## 🔧 Files Created

### 1. `server.js` - Main Express Server

**Features:**
- Express.js web server
- CORS enabled for frontend communication
- Helmet security headers
- Body parsing (JSON & URL-encoded)
- Morgan HTTP request logging
- Health check endpoint
- Global error handling
- 404 handler
- Graceful shutdown (SIGTERM, SIGINT)
- Database connection initialization

**Key Endpoints:**
- `GET /health` - Server health check

### 2. `config/database.js` - SQL Server Connection

**Features:**
- Connection pool management (max: 10, min: 0)
- Automatic connection retry
- Connection error handling
- Multiple query execution methods:
  - `query(queryString, params)` - Execute SQL queries
  - `executeProcedure(procedureName, params)` - Execute stored procedures
  - `queryWithTypes(queryString, typedParams)` - Type-safe queries
  - `testConnection()` - Test database connectivity
  - `closePool()` - Graceful connection closure

**Configuration:**
- Server: localhost
- Port: 1433
- Database: ums_db
- Encryption: Enabled
- Trust server certificate: True (for local dev)
- Request timeout: 30 seconds
- Idle timeout: 30 seconds

### 3. `.env` - Environment Configuration

**Variables:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_SERVER=localhost
DB_DATABASE=ums_db
DB_USER=DESKTOP-KFESKC0\USER
DB_PASSWORD=MS2sql3@SERVER6
DB_PORT=1433

# JWT
JWT_SECRET=a3f5b8c2d9e1f4a7b6c3d8e2f5a9b4c7d1e6f3a8b5c2d9e4f7a1b8c5d2e9f6a3b
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. `middle-ware/errorHandler.js` - Error Handling

**Features:**
- Custom `AppError` class for operational errors
- Comprehensive error handling middleware
- Specific handlers for:
  - SQL Server connection errors
  - SQL Server request errors
  - SQL Server transaction errors
  - JWT authentication errors
  - Validation errors
  - Duplicate key violations (SQL error 2627, 2601)
  - Foreign key constraint violations (SQL error 547)
- Development vs Production error responses
- `asyncHandler` wrapper for async route handlers

### 5. `utils/logger.js` - Winston Logger

**Features:**
- File-based logging:
  - `logs/error.log` - Error level logs only
  - `logs/combined.log` - All log levels
- Console logging in development
- Log rotation (5MB max file size, 5 files retained)
- Timestamped logs
- Colorized console output
- Helper methods:
  - `logger.logQuery(query, params, duration)` - Database queries
  - `logger.logRequest(req)` - API requests
  - `logger.logAuth(event, data)` - Authentication events
  - `logger.logEvent(event, data)` - Business events
- Morgan HTTP logger integration

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- SQL Server (running locally or remotely)
- Database `ums_db` created (run `ums_db.sql` script)

### Installation

```bash
cd backend
npm install
```

### Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### Testing the Server

**1. Health Check Endpoint:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-13T16:00:00.000Z"
}
```

**2. Using the test script:**
```bash
node test-server.js
```

---

## 🔌 Database Connection

### Connection Status

The server will attempt to connect to SQL Server on startup. If the connection fails, the server will still start and serve API endpoints, but database operations will fail.

### Troubleshooting Database Connection

If you see this error:
```
❌ Database connection failed: Failed to connect to localhost:1433
```

**Check these:**

1. **SQL Server is running:**
   - Open "SQL Server Configuration Manager"
   - Check if SQL Server service is started

2. **Database exists:**
   ```sql
   -- Run in SQL Server Management Studio
   SELECT name FROM sys.databases WHERE name = 'ums_db';
   ```

3. **Credentials are correct:**
   - Verify `DB_USER` and `DB_PASSWORD` in `.env`
   - For Windows Authentication, use format: `COMPUTERNAME\USERNAME`
   - For SQL Server Authentication, use SQL login username

4. **Port is open:**
   - Default SQL Server port is 1433
   - Check firewall settings
   - Verify SQL Server is listening on TCP/IP

5. **TCP/IP is enabled:**
   - Open "SQL Server Configuration Manager"
   - Navigate to "SQL Server Network Configuration"
   - Enable "TCP/IP" protocol

---

## 📝 API Routes (To Be Implemented)

The following routes are prepared but need to be created:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/meters` - Get all meters
- `POST /api/meters` - Create new meter
- `GET /api/readings` - Get all meter readings
- `POST /api/readings` - Record new meter reading
- `GET /api/billing` - Get all bills
- `POST /api/billing/generate` - Generate bills
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment

---

## 🔐 Security Features

1. **Helmet** - Sets security HTTP headers
2. **CORS** - Configured for frontend origin only
3. **JWT** - Token-based authentication (to be implemented)
4. **Rate Limiting** - Environment configured (to be implemented)
5. **Input Validation** - Express-validator ready (to be implemented)
6. **Password Hashing** - bcryptjs available (to be implemented)

---

## 📊 Logging

### Log Files Location
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs

### Log Levels
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages (development only)

### Example Usage in Controllers

```javascript
const logger = require('../utils/logger');

// Log database query
logger.logQuery('SELECT * FROM Customer WHERE customer_id = @id', { id: 123 }, 45);

// Log API request
logger.logRequest(req);

// Log authentication event
logger.logAuth('login', { userId: 123, username: 'john.doe' });

// Log business event
logger.logEvent('bill_generated', { billId: 456, amount: 1500.00 });

// Standard logging
logger.info('Customer created successfully');
logger.error('Failed to create customer', { error: err.message });
logger.debug('Debug information', { data: someData });
```

---

## 🛠️ Development Tips

### Using the Async Handler

Wrap async route handlers to automatically catch errors:

```javascript
const { asyncHandler } = require('../middle-ware/errorHandler');

router.get('/customers', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM Customer');
  res.json({ success: true, data: result.recordset });
}));
```

### Throwing Custom Errors

```javascript
const { AppError } = require('../middle-ware/errorHandler');

// Throw operational error
if (!customer) {
  throw new AppError('Customer not found', 404);
}
```

### Database Queries

```javascript
const { query, executeProcedure, queryWithTypes, sql } = require('../config/database');

// Simple query
const result = await query('SELECT * FROM Customer WHERE customer_id = @id', { id: 123 });

// Type-safe query
const result = await queryWithTypes(
  'INSERT INTO Customer (first_name, last_name) VALUES (@firstName, @lastName)',
  [
    { name: 'firstName', type: sql.VarChar(50), value: 'John' },
    { name: 'lastName', type: sql.VarChar(50), value: 'Doe' }
  ]
);

// Stored procedure
const result = await executeProcedure('sp_GetCustomerBills', { customerId: 123 });
```

---

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `mssql` - SQL Server client
- `dotenv` - Environment variables
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `cors` - CORS handling
- `express-validator` - Input validation
- `morgan` - HTTP logging
- `winston` - Application logging

### Development Dependencies
- `nodemon` - Auto-restart on file changes

---

## ✅ Setup Checklist

- [x] Server.js created and configured
- [x] Database connection pool configured
- [x] Environment variables set up
- [x] Error handling middleware created
- [x] Logger configured
- [x] Logs directory created
- [x] Health check endpoint working
- [ ] SQL Server connection verified
- [ ] Authentication routes implemented
- [ ] Customer routes implemented
- [ ] Meter routes implemented
- [ ] Reading routes implemented
- [ ] Billing routes implemented
- [ ] Payment routes implemented

---

## 🆘 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`
- Check for syntax errors in server.js

### Database connection fails
- Verify SQL Server is running
- Check credentials in `.env`
- Ensure database `ums_db` exists
- Verify TCP/IP is enabled in SQL Server

### CORS errors from frontend
- Verify `CORS_ORIGIN` in `.env` matches frontend URL
- Default is `http://localhost:5173` (Vite default)

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error logs in `logs/error.log`
3. Enable debug logging in development
4. Check database connection status

---

**Last Updated:** December 13, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for development
