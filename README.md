# UtiliTrack System
# ━━━━━━━━━━━━━━━━━━━━━━━━━

A comprehensive **Utility Management System** for managing electricity, water, and gas utilities. This full-stack application handles customer management, billing, payments, meter readings, service connections, and complaint tracking for residential, commercial, industrial, and government customers.

---
## 📋 Prerequisites
# ━━━━━━━━━━━━━━━━━━━━━━━━━

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
# ━━━━━━━━━━━━━━━━━━━━━━━━━

Follow these 4 simple steps to get the system running:

### Step 1: Setup the Database
# ━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open **SQL Server Management Studio (SSMS)**

2. Open the `ums_db.sql` file from the project root
   - You can open the [ums_db sql script](ums_db.sql) in the IDE, copy and paste the SQL script in a new query inside **SQL Server Management Studio (SSMS)**.
   - Or you can directly open the [ums_db sql script](ums_db.sql) inside **SQL Server Management Studio (SSMS)** and run it that way.

3. Execute it to create the database, all tables, and initial data

   **Default Login Created:**
   - Username: `admin`
   - Password: `admin123`

### Step 2: Setup new Login
# ━━━━━━━━━━━━━━━━━━━━━━━━━

1. In the "Object Explorer", right-click on the Microsoft Server and click on "Properties".

2. Under "Select a page", go to "Security".

3. Under "Server authentication", select "SQL Server and Windows Authentication mode" and click "OK".

4. In the "Object Explorer", under the "Security" folder, right-click on the "Logins" folder and select "New Login...".

5. Enter a Login name in the "Login name:" field.

6. Select "SQL authentication" and enter a password.

7. Uncheck "Enforce password expiration" and "User must change password at next login".

8. Select "ums_db" database in the "Default database:" field.

9. Under "Select a page", go to "User Mapping". 

10. Under "Users mapped to this login:", check the box next to "ums_db".

11. Under "Database role membership for master", check "db_owner", "db_datawriter", and "db_datareader".

12. Press "OK".


### Step 3: Configure Port
# ━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open "Sql Server Configuration Manager" using Windows Search.

2. Under "SQL Server Network Configuration", click on "Protocols for MSSQLSERVER".

3. Make sure "TCP/IP" is "Enabled".

4. Right-click on "TCP/IP" and click "Properties".

5. Go to "IP Addresses" tab in the "TCP/IP Properties" window.

6. Scroll down to "IPAII" and make sure that "TCP Dynamic Ports" is empty and "TCP Port" is set to "1433".

7. Click "OK".

8. Go to "SQL Server Services" in the "Sql Server Configuration Manager" window. 

9. Restart the SQL Server (e.g. "SQL Server (MSSQLSERVER)").

---
### Step 4: Setup the Backend
# ━━━━━━━━━━━━━━━━━━━━━━━━━

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
   ... or simply rename the ".env.example" file located in the `backend` folder to `.env`.

4. Open the `.env` file:

      ```env
      DB_SERVER=localhost\\SQLEXPRESS
      DB_DATABASE=ums_db
      DB_USER=<Login Name here>
      DB_PASSWORD=<Password here>
      DB_PORT=1433
      ```

5. Generate a secure JWT secret:

   - **Option 1:** Get the JWT manually:

      - Go to your terminal and type this:

      ```powershell
      node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
      ```

      - Copy and paste the output (the JWT) into your `.env` file.

   - **Option 2:** Get the JWT using the script.

      - Simply go to your terminal and:

         - Navigate to the backend folder using:

            ```powershell
            cd backend
            ```
         - Then run the script by typing:
         
         ```powershell
         npm run generate-jwt
         ```
         OR

         - Directly type this:

            (for powershell terminal)
            ```powershell
            cd backend; npm run generate-jwt
            ```
            
            (for command prompt)
            ```cmd
            cd backend & npm run generate-jwt
            ```

6. Start the backend:

   ```powershell
   npm run dev
   ```
   
   ✅ Backend running at `http://localhost:5000`

---
### Step 3: Setup the Frontend
# ━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open a **new terminal** (keep the backend running)

2. Navigate to the frontend folder (`cd frontend`):

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
# ━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open your browser and go to `http://localhost:5173`

2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

3. You should see the dashboard!

---

(Troubleshooting)[Troubleshooting.md]

---

# 🔧 Complete Configuration Reference
# ━━━━━━━━━━━━━━━━━━━━━━━━━

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

## 📚 Project Structure
# ━━━━━━━━━━━━━━━━━━━━━━━━━

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