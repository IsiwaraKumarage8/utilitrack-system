# Login Testing Guide

## ✅ All User Credentials (Password: `password123`)

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
**Keep this terminal open!**

### 2. Start Frontend Server (in a NEW terminal)
```bash
cd frontend
npm run dev
```

### 3. Test Login Credentials

Once both servers are running, go to http://localhost:5173 (or the frontend URL shown) and try logging in with:

#### Admin User
- **Username**: `admin`
- **Password**: `password123`
- **Expected**: See ALL 10 sidebar items

#### Admin User (Alternative)
- **Username**: `jsmith`
- **Password**: `password123`
- **Expected**: See ALL 10 sidebar items

#### Manager
- **Username**: `mjohnson`
- **Password**: `password123`
- **Expected**: See 9 items (no Settings)

#### Field Officer  
- **Username**: `rperera`
- **Password**: `password123`
- **Expected**: See 6 items (Dashboard, Customers, Connections, Meters, Readings, Complaints)

#### Cashier
- **Username**: `sfernando`
- **Password**: `password123`
- **Expected**: See 5 items (Dashboard, Customers, Billing, Payments, Complaints)

#### Billing Clerk
- **Username**: `ndias`
- **Password**: `password123`
- **Expected**: See 8 items (all except Reports and Settings)

---

## 🧪 What to Test

### 1. Sidebar Menu
✅ Each role sees different menu items
✅ Try clicking on menu items you CAN see
❌ Try accessing URLs you shouldn't (e.g., cashier tries `/settings`)

### 2. URL Protection
- Login as Cashier (`sfernando` / `password123`)
- Try manually going to: `http://localhost:5173/settings`
- **Expected**: Redirected to dashboard with error toast

### 3. Role-Specific Dashboards
Each role should see different dashboard content:
- **Admin**: Everything
- **Manager**: Analytics and reports
- **Field Officer**: Assigned readings
- **Cashier**: Payment stats
- **Billing Clerk**: Billing stats

---

## 🐛 If Login Fails

### Check Backend Logs
Look for the DEBUG messages I added:
```
DEBUG: Login attempt for username: admin
DEBUG: User found: Yes
DEBUG: User role: Admin
DEBUG: User status: Active
DEBUG: Password hash length: 60
DEBUG: Comparing password...
DEBUG: Password valid: true
```

### Common Issues
1. **"Invalid username or password"** → Password hash might be wrong
2. **500 error** → Check backend console for errors
3. **Network error** → Backend server not running on port 5000
4. **CORS error** → Check backend CORS settings

---

## 📝 Complete User List

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | password123 | Admin | Operations |
| jsmith | password123 | Admin | Operations |
| mjohnson | password123 | Manager | Finance |
| dbandara | password123 | Manager | Customer Service |
| rperera | password123 | Field Officer | Operations |
| asilva | password123 | Field Officer | Operations |
| pweerasinghe | password123 | Field Officer | Operations |
| lranasinghe | password123 | Field Officer | Operations |
| sfernando | password123 | Cashier | Finance |
| kwijesinghe | password123 | Cashier | Finance |
| mgamage | password123 | Cashier | Finance |
| ndias | password123 | Billing Clerk | Finance |
| tgunasekara | password123 | Billing Clerk | Finance |

All passwords have been reset to: **password123**
