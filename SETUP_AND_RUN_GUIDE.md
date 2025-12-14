# 🚀 UtiliTrack System - Setup and Run Guide

Complete guide to set up and run the Utility Management System (frontend + backend).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Installing Dependencies](#installing-dependencies)
6. [Running the Application](#running-the-application)
7. [Verifying Everything Works](#verifying-everything-works)
8. [Troubleshooting](#troubleshooting)

---

## 📌 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | v18.x or higher | https://nodejs.org/ |
| **npm** | v9.x or higher | Comes with Node.js |
| **SQL Server** | Express/Standard/Developer | https://www.microsoft.com/en-us/sql-server/sql-server-downloads |
| **Git** | Latest | https://git-scm.com/ |

### Verify Installation

Open PowerShell or Command Prompt and run:

```powershell
# Check Node.js version
node --version
# Expected output: v18.x.x or higher

# Check npm version
npm --version
# Expected output: 9.x.x or higher

# Check if SQL Server is running
sqlcmd -L
# Should list your SQL Server instances
```

---

## 🛠️ Initial Setup

### 1. Clone or Navigate to Project Directory

```powershell
# If cloning from repository
git clone <your-repository-url>
cd utilitrack-system

# If already have the project
cd D:\utilitrack-system
```

### 2. Project Structure Overview

```
utilitrack-system/
├── backend/              # Node.js + Express API
│   ├── config/          # Database & auth configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Database queries
│   ├── routes/          # API endpoints
│   ├── middle-ware/     # Error handling & validation
│   ├── utils/           # Logger & helpers
│   ├── logs/            # Log files (auto-created)
│   ├── server.js        # Main entry point
│   ├── package.json     # Dependencies
│   └── .env             # Environment variables (YOU NEED TO CREATE THIS)
│
└── frontend/            # React + Vite UI
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   └── main.jsx     # Entry point
    ├── package.json     # Dependencies
    └── vite.config.js   # Build configuration
```

---

## 🗄️ Database Configuration

### 1. Create Database

Open **SQL Server Management Studio (SSMS)** or use **sqlcmd**:

```sql
-- Create the database
CREATE DATABASE ums_db;
GO

-- Use the database
USE ums_db;
GO
```

### 2. Import Database Schema

Run the provided SQL script to create tables:

```powershell
# Using sqlcmd (from project root)
sqlcmd -S localhost -U sa -P YourPassword -i ums_db.sql

# Or import via SSMS:
# 1. Open SSMS
# 2. Connect to your SQL Server instance
# 3. File → Open → File → Select ums_db.sql
# 4. Execute (F5)
```

### 3. Verify Database

Check that tables were created:

```sql
USE ums_db;
GO

-- List all tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
```

You should see tables like: `Customer`, `Service_Connection`, `Meter`, `Meter_Reading`, etc.

---

## ⚙️ Environment Variables Setup

### 1. Create `.env` File in Backend

Navigate to the backend directory and create a `.env` file:

```powershell
cd backend
```

Create a file named `.env` with the following content:

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SERVER CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORT=5000
NODE_ENV=development

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# OPTION 1: SQL Server with SQL Authentication (sa login)
DB_SERVER=localhost
DB_DATABASE=ums_db
DB_USER=sa
DB_PASSWORD=YourPasswordHere
DB_PORT=1433

# OPTION 2: SQL Server Express with SQL Authentication
# DB_SERVER=localhost\\SQLEXPRESS
# DB_DATABASE=ums_db
# DB_USER=sa
# DB_PASSWORD=YourPasswordHere
# DB_PORT=1433

# OPTION 3: Windows Authentication (leave user/password empty)
# DB_SERVER=localhost\\SQLEXPRESS
# DB_DATABASE=ums_db
# DB_USER=
# DB_PASSWORD=
# DB_PORT=1433

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# JWT CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JWT_SECRET=a3f5b8c2d9e1f4a7b6c3d8e2f5a9b4c7d1e6f3a8b5c2d9e4f7a1b8c5d2e9f6a3b
JWT_EXPIRE=7d

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CORS CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORS_ORIGIN=http://localhost:5173

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RATE LIMITING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Configure Database Connection

**Important:** You MUST update these values based on your SQL Server setup:

#### **For SQL Server Express (Default Installation):**

```env
DB_SERVER=localhost\\SQLEXPRESS
DB_DATABASE=ums_db
DB_USER=sa
DB_PASSWORD=YourActualPassword
DB_PORT=1433
```

#### **For SQL Server Standard/Developer:**

```env
DB_SERVER=localhost
DB_DATABASE=ums_db
DB_USER=sa
DB_PASSWORD=YourActualPassword
DB_PORT=1433
```

#### **For Windows Authentication:**

```env
DB_SERVER=localhost\\SQLEXPRESS
DB_DATABASE=ums_db
DB_USER=
DB_PASSWORD=
DB_PORT=1433
```

### 3. Verify SQL Server Instance Name

If you're not sure of your SQL Server instance name:

```powershell
# List all SQL Server instances
sqlcmd -L

# Or check Windows Services
Get-Service | Where-Object {$_.DisplayName -like "*SQL Server*"}
```

Common instance names:
- `localhost` (default unnamed instance)
- `localhost\SQLEXPRESS` (SQL Server Express)
- `localhost\MSSQLSERVER` (standard instance)

---

## 📦 Installing Dependencies

### 1. Install Backend Dependencies

```powershell
# Navigate to backend directory
cd D:\utilitrack-system\backend

# Install all required packages
npm install

# You should see packages being installed:
# ✓ express, mssql, dotenv, cors, helmet, etc.
```

**Expected Output:**
```
added 150 packages, and audited 151 packages in 15s
```

### 2. Install Frontend Dependencies

```powershell
# Navigate to frontend directory
cd D:\utilitrack-system\frontend

# Install all required packages
npm install

# You should see packages being installed:
# ✓ react, vite, axios, recharts, react-router-dom, etc.
```

**Expected Output:**
```
added 300 packages, and audited 301 packages in 25s
```

### 3. Verify Installations

```powershell
# Check backend packages
cd D:\utilitrack-system\backend
npm list --depth=0

# Check frontend packages
cd D:\utilitrack-system\frontend
npm list --depth=0
```

---

## 🚀 Running the Application

### Option 1: Run Both Servers Separately (Recommended)

#### Terminal 1 - Backend Server

```powershell
# Navigate to backend
cd D:\utilitrack-system\backend

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

**Expected Output:**
```
[nodemon] starting `node server.js`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database connected successfully
📊 Database: ums_db
🖥️  Server: localhost
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server running on port: 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Terminal 2 - Frontend Server

```powershell
# Navigate to frontend
cd D:\utilitrack-system\frontend

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v7.2.4  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Option 2: Using VS Code Split Terminals

1. Open VS Code in project folder
2. Open Terminal (Ctrl + `)
3. Split terminal (click split icon)
4. In **Terminal 1**: `cd backend && npm run dev`
5. In **Terminal 2**: `cd frontend && npm run dev`

---

## ✅ Verifying Everything Works

### 1. Check Backend Health

Open your browser and navigate to:

```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

### 2. Check Customers API

```
http://localhost:5000/api/customers
```

**Expected Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "customer_id": 1,
      "customer_type": "Residential",
      "first_name": "Nuwan",
      "last_name": "Bandara",
      "email": "nuwan.bandara@email.com",
      ...
    }
  ]
}
```

### 3. Check Frontend

Open your browser and navigate to:

```
http://localhost:5173/
```

You should see:
- ✅ Dashboard page loads
- ✅ Sidebar navigation works
- ✅ Can navigate to Customers page
- ✅ Customer data loads from API

### 4. Test CRUD Operations

1. **Navigate to Customers page** (http://localhost:5173/customers)
2. **Add Customer:**
   - Click "Add Customer" button
   - Fill in the form
   - Click "Add Customer"
   - Check for success toast notification
3. **Edit Customer:**
   - Click edit icon on any customer
   - Modify details
   - Click "Save Changes"
4. **View Details:**
   - Click view icon to see customer details
5. **Delete Customer:**
   - Click delete icon
   - Confirm deletion

---

## 🔧 Troubleshooting

### Problem: Backend won't start - "Port 5000 already in use"

**Solution:**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

---

### Problem: Database connection failed - "config.server property is required"

**Solution:**

1. Check your `.env` file exists in `backend/` directory
2. Verify `DB_SERVER` is not empty
3. For SQL Server Express, use double backslash:
   ```env
   DB_SERVER=localhost\\SQLEXPRESS
   ```
4. Restart the backend server after changing `.env`

---

### Problem: "Login failed for user 'sa'"

**Solutions:**

**Option 1: Enable SQL Server Authentication**
```sql
-- Run in SSMS
USE master;
GO
ALTER LOGIN sa ENABLE;
GO
ALTER LOGIN sa WITH PASSWORD = 'YourNewPassword';
GO
```

**Option 2: Use Windows Authentication**
```env
DB_SERVER=localhost\\SQLEXPRESS
DB_DATABASE=ums_db
DB_USER=
DB_PASSWORD=
```

---

### Problem: "Cannot find module 'express'" or similar

**Solution:**

```powershell
# Reinstall backend dependencies
cd backend
rm -r node_modules
rm package-lock.json
npm install

# Reinstall frontend dependencies
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

---

### Problem: Frontend shows "Network error - please check your connection"

**Solutions:**

1. **Check backend is running:**
   ```
   http://localhost:5000/health
   ```

2. **Check CORS settings in backend/.env:**
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Check API URL in frontend/src/api/customerApi.js:**
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

4. **Disable browser extensions** (like adblockers) that might block requests

---

### Problem: Database tables don't exist

**Solution:**

```powershell
# Import database schema
cd D:\utilitrack-system
sqlcmd -S localhost -U sa -P YourPassword -d ums_db -i ums_db.sql

# Verify tables exist
sqlcmd -S localhost -U sa -P YourPassword -d ums_db -Q "SELECT name FROM sys.tables"
```

---

### Problem: Logs directory not found

**Solution:**

The `logs/` directory will be auto-created when the server starts. If you encounter issues:

```powershell
cd backend
mkdir logs
```

---

## 📚 Additional Resources

### Backend API Documentation

- **Customer API:** See `backend/CUSTOMERS_API_DOCUMENTATION.md`
- **Backend Setup:** See `backend/BACKEND_SETUP_README.md`

### Database Schema

- **Schema SQL:** `ums_db.sql` in project root
- **Field Mapping:** `DATABASE_FIELD_MAPPING.md`

### Development Commands

```powershell
# Backend
cd backend
npm run dev        # Start with auto-reload (recommended for development)
npm start          # Start production server

# Frontend
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DB_SERVER` | SQL Server address | `localhost` or `localhost\\SQLEXPRESS` |
| `DB_DATABASE` | Database name | `ums_db` |
| `DB_USER` | Database username | `sa` (or empty for Windows Auth) |
| `DB_PASSWORD` | Database password | Your password (or empty for Windows Auth) |
| `DB_PORT` | SQL Server port | `1433` |
| `JWT_SECRET` | Secret key for JWT tokens | Any random string (64+ chars) |
| `JWT_EXPIRE` | Token expiration time | `7d`, `24h`, `30m` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js (v18+)
- [ ] Install SQL Server
- [ ] Create `ums_db` database
- [ ] Import `ums_db.sql` schema
- [ ] Create `backend/.env` file with database credentials
- [ ] Run `npm install` in backend folder
- [ ] Run `npm install` in frontend folder
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Test health endpoint: http://localhost:5000/health
- [ ] Open frontend: http://localhost:5173
- [ ] Test CRUD operations on Customers page

---

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check the logs:**
   - Backend: `backend/logs/error.log`
   - Terminal output from both servers

2. **Verify configuration:**
   - `.env` file has correct values
   - SQL Server is running
   - Database exists and has data

3. **Test components individually:**
   - Can you connect to SQL Server via SSMS?
   - Does backend health check work?
   - Can you access API endpoints directly?

---

**🎉 You're all set! Your UtiliTrack System should now be running successfully.**

Access your application at: **http://localhost:5173**
