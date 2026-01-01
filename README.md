# UtiliTrack System

A comprehensive **Utility Management System** for managing electricity, water, and gas utilities. This full-stack application handles customer management, billing, payments, meter readings, service connections, and complaint tracking for residential, commercial, industrial, and government customers.

---

## 📋 Prerequisites

Before starting, make sure you have these installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **SQL Server** (Express, Standard, or Developer) - [Download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

**Quick Check:**
```powershell
node --version
npm --version
```

---

## 🚀 Quick Start Guide

Follow these 4 simple steps to get the system running:

### Step 1: Setup the Database

1. Open **SQL Server Management Studio (SSMS)**
2. Open the `ums_db.sql` file from the project root
3. Execute it to create the database, all tables, and initial data

**Default Login Created:**
- Username: `admin`
- Password: `admin123`

---

### Step 2: Setup the Backend

1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd backend
   ```

2. Install required packages:
   ```powershell
   npm install
   ```

3. Create your configuration file:
   ```powershell
   # Copy the example file
   copy .env.example .env
   ```

4. Open `.env` file and update the database password:
      Instructions:
      1. Choose the option that matches your SQL Server setup
      2. Comment out the default configuration (lines 10-14)
      3. Uncomment your preferred option above
      4. Update DB_PASSWORD if using SQL Authentication

   ```env

# OPTION 1: SQL Server Express with Windows Authentication
# Uncomment these lines if using SQL Server Express with Windows Auth:
# DB_SERVER=localhost\\SQLEXPRESS
# DB_DATABASE=ums_db
# DB_USER=
# DB_PASSWORD=
# DB_PORT=1433

# OPTION 2: SQL Server Default Instance with SQL Authentication
# Most common for SQL Server Developer/Standard editions
# DB_SERVER=localhost
# DB_DATABASE=ums_db
# DB_USER=sa
# DB_PASSWORD=your_password_here
# DB_PORT=1433

# OPTION 3: SQL Server Express with SQL Authentication
# Uncomment these lines if using SQL Server Express:
# DB_SERVER=localhost\\SQLEXPRESS
# DB_DATABASE=ums_db
# DB_USER=sa
# DB_PASSWORD=your_password_here
# DB_PORT=1433

# OPTION 4: Windows Authentication (any SQL Server edition)
# Uncomment these lines if using Windows Authentication:
# DB_SERVER=localhost
# DB_DATABASE=ums_db
# DB_USER=
# DB_PASSWORD=
# DB_PORT=1433
   ```

5. Generate a secure JWT secret:
   ```powershell
   npm run generate-jwt
   ```
   Copy the generated line and paste it into your `.env` file

6. Start the backend:
   ```powershell
   npm run dev
   ```
   
   ✅ Backend running at `http://localhost:5000`

---

### Step 3: Setup the Frontend

1. Open a **new terminal** (keep the backend running)
2. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```

3. Install required packages:
   ```powershell
   npm install
   ```

4. Start the frontend:
   ```powershell
   npm run dev
   ```

   ✅ Frontend running at `http://localhost:5173`

---

### Step 4: Login and Test

1. Open your browser and go to `http://localhost:5173`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You should see the dashboard!

---

## 📝 Configuration Options

The `.env` file in the backend folder controls how the system connects to your database. Here are the common configurations:

### Option 1: Default SQL Server with Password
```env
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=YourPassword
```

### Option 2: SQL Server Express with Password
```env
DB_SERVER=localhost\\SQLEXPRESS
DB_USER=sa
DB_PASSWORD=YourPassword
```

### Option 3: Windows Authentication (No Password)
```env
DB_SERVER=localhost
DB_USER=
DB_PASSWORD=
```

### Option 4: SQL Server Express + Windows Authentication
```env
DB_SERVER=localhost\\SQLEXPRESS
DB_USER=
DB_PASSWORD=
```

**Note:** Only uncomment and use ONE option that matches your setup.

---

## 🔧 Complete Configuration Reference

If you need to customize other settings, here's what each variable in `.env` does:

| Variable | What it does | Default Value |
|----------|--------------|---------------|
| `PORT` | Port for backend server | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_SERVER` | Your SQL Server address | `localhost` |
| `DB_DATABASE` | Database name | `ums_db` |
| `DB_USER` | SQL Server username | `sa` |
| `DB_PASSWORD` | SQL Server password | Your password |
| `DB_PORT` | SQL Server port | `1433` |
| `JWT_SECRET` | Security token (generate with npm script) | Generated |
| `JWT_EXPIRE` | How long users stay logged in | `7d` (7 days) |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Security rate limiting window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests allowed | `100` |

---

## 🎯 Daily Development Workflow

Once everything is set up, here's how to start working:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

Both servers will automatically reload when you make changes to the code.

---

## 📦 Building for Production

When you're ready to deploy or submit the project:

**Backend:**
```powershell
cd backend
npm start
```

**Frontend:**
```powershell
cd frontend
npm run build
npm run preview
```

---

## ❓ Troubleshooting

### Backend Issues

**Problem: "Cannot connect to database"**

Solutions:
- Make sure SQL Server is running
- Check your username and password in `.env` are correct
- If using Windows Authentication, make sure `DB_USER` and `DB_PASSWORD` are empty (no values)
- Try adding `\\SQLEXPRESS` to your `DB_SERVER` if using SQL Server Express

**Problem: "Port 5000 is already in use"**

Solution:
- Change `PORT=5000` to `PORT=5001` in your `.env` file
- Restart the backend server

**Problem: "JWT_SECRET is not defined"**

Solution:
- Run `npm run generate-jwt` in the backend folder
- Copy the generated line into your `.env` file

**Problem: ".env file not found"**

Solution:
- Make sure you copied `.env.example` to `.env`
- The `.env` file should be in the `backend` folder

---

### Frontend Issues

**Problem: "Cannot connect to backend" or "Network Error"**

Solutions:
- Make sure the backend is running (check Terminal 1)
- Verify the backend shows "Server running on port 5000"
- Check that `CORS_ORIGIN=http://localhost:5173` in backend `.env`

**Problem: "Module not found" errors**

Solution:
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Problem: Frontend won't start on port 5173**

Solution:
- Another application might be using that port
- The error message will suggest an alternative port (e.g., 5174)
- Use that port instead: `http://localhost:5174`

---

### Database Issues

**Problem: "Invalid object name" or "Table does not exist"**

Solution:
- The database schema wasn't loaded properly
- Re-run the `ums_db.sql` script in SSMS
- Make sure you selected the `ums_db` database before running the script

**Problem: "Login failed for user 'sa'"**

Solutions:
1. Check SQL Server allows SQL Server Authentication:
   - Open SSMS
   - Right-click your server → Properties
   - Go to Security
   - Select "SQL Server and Windows Authentication mode"
   - Restart SQL Server

2. Verify your password is correct in the `.env` file

**Problem: "Cannot connect to SQL Server"**

Solutions:
1. Make sure SQL Server is running:
   - Open "Services" in Windows
   - Find "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
   - Make sure it's "Running"

2. Enable TCP/IP:
   - Open "SQL Server Configuration Manager"
   - Go to SQL Server Network Configuration → Protocols
   - Enable "TCP/IP"
   - Restart SQL Server

---

### Other Common Issues

**Problem: Changes to backend code don't appear**

Solution:
- Stop the backend (Ctrl+C)
- Start it again with `npm run dev`

**Problem: Changes to frontend code don't appear**

Solution:
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

**Problem: "Access Denied" or authentication errors**

Solution:
- Clear your browser's local storage
- Log out and log back in
- Check the JWT_SECRET hasn't changed in `.env`

---

## 🔐 Security Notes

**For Coursework Submission:**
The `.env` file is included in this repository for easy setup and evaluation. In a real production environment, this file would be excluded from version control and secrets would be managed securely.

**Important:** Change the default admin password (`admin123`) before deploying to any public environment!

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check that all prerequisites are installed correctly
2. Make sure you followed each step in order
3. Verify both backend and frontend are running simultaneously
4. Check the terminal outputs for specific error messages
5. Review the configuration in your `.env` file

---

## 📚 Project Structure

```
UtiliTrack/
├── backend/              # Node.js + Express API
│   ├── src/             # Source code
│   ├── .env             # Configuration file
│   └── package.json     # Dependencies
├── frontend/            # React + Vite application
│   ├── src/             # Source code
│   └── package.json     # Dependencies
└── ums_db.sql          # Database schema and seed data
```

---

**System Requirements:**
- Node.js v18 or higher
- npm v9 or higher
- SQL Server (any edition)
- Modern web browser (Chrome, Firefox, Edge)
- Windows, macOS, or Linux operating system