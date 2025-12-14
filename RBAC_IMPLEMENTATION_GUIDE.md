# Role-Based Access Control (RBAC) Implementation Guide

## ✅ What's Implemented

### 1. Authentication System
- ✅ Login page with JWT authentication
- ✅ AuthContext to manage user state globally
- ✅ Token storage and automatic re-authentication
- ✅ Protected routes (require login)

### 2. Role-Based Access
- ✅ Permission utility functions (`frontend/src/utils/permissions.js`)
- ✅ usePermissions hook for easy permission checking
- ✅ Role-based route protection (blocks unauthorized URL access)
- ✅ Updated menuConfig with correct role definitions

### 3. Backend Security
- ✅ JWT authentication middleware
- ✅ Role authorization middleware
- ✅ Login endpoint with role validation

---

## 🎯 How to Use Permissions in Components

### Example 1: Hide/Show Buttons Based on Role

```jsx
import { usePermissions } from '../hooks/usePermissions';

function CustomersPage() {
  const { can } = usePermissions();
  
  return (
    <div>
      <h1>Customers</h1>
      
      {/* Only Admin can add customers */}
      {can.addCustomer && (
        <button onClick={handleAddCustomer}>
          Add Customer
        </button>
      )}
      
      {/* Only Admin can edit */}
      {can.editCustomer && (
        <button onClick={handleEdit}>
          Edit
        </button>
      )}
      
      {/* Only Admin can delete */}
      {can.deleteCustomer && (
        <button onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
}
```

### Example 2: Check Specific Permissions

```jsx
import { usePermissions } from '../hooks/usePermissions';

function BillingPage() {
  const { can, isAdmin, isBillingClerk } = usePermissions();
  
  return (
    <div>
      {/* Only Admin and Billing Clerk can generate bills */}
      {can.generateBill && (
        <button onClick={handleGenerateBill}>
          Generate Bill
        </button>
      )}
      
      {/* Only Admin can cancel bills */}
      {isAdmin && (
        <button onClick={handleCancelBill}>
          Cancel Bill
        </button>
      )}
    </div>
  );
}
```

### Example 3: Conditional Rendering Based on Role

```jsx
import { usePermissions } from '../hooks/usePermissions';

function ReadingsPage() {
  const { isFieldOfficer, isAdmin, can } = usePermissions();
  
  return (
    <div>
      {/* Field Officers and Admin can record readings */}
      {can.recordReading && (
        <button>Record Reading</button>
      )}
      
      {/* Field Officer sees different UI */}
      {isFieldOfficer && (
        <div className="field-officer-view">
          <h2>My Assigned Readings</h2>
          {/* Show only readings assigned to this user */}
        </div>
      )}
      
      {/* Admin sees everything */}
      {isAdmin && (
        <div className="admin-view">
          <h2>All Readings</h2>
          {/* Show all readings */}
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Sidebar Menu Access by Role

### Admin (10 items)
- ✅ Dashboard
- ✅ Customers
- ✅ Service Connections
- ✅ Meters
- ✅ Meter Readings
- ✅ Billing
- ✅ Payments
- ✅ Complaints
- ✅ Reports
- ✅ Settings

### Field Officer (6 items)
- ✅ Dashboard (limited stats)
- ✅ Customers (view only)
- ✅ Service Connections (view only)
- ✅ Meters
- ✅ Meter Readings ← **PRIMARY TASK**
- ✅ Complaints (assigned to them)

### Cashier (5 items)
- ✅ Dashboard (payment stats)
- ✅ Customers (view only)
- ✅ Billing (view unpaid bills)
- ✅ Payments ← **PRIMARY TASK**
- ✅ Complaints (log complaints)

### Manager (9 items)
- ✅ Dashboard
- ✅ Customers (view only)
- ✅ Service Connections (view only)
- ✅ Meters (view only)
- ✅ Meter Readings (view only)
- ✅ Billing (view only)
- ✅ Payments (view only)
- ✅ Complaints (assign to staff)
- ✅ Reports ← **PRIMARY TASK**

### Billing Clerk (8 items)
- ✅ Dashboard
- ✅ Customers (view only)
- ✅ Service Connections (view only)
- ✅ Meters (view only)
- ✅ Meter Readings (view only)
- ✅ Billing ← **PRIMARY TASK**
- ✅ Payments (view status)
- ✅ Complaints (billing-related)

---

## 🔐 Backend Route Protection

### Example: Protect API Endpoints

```javascript
// In your route files (e.g., customerRoutes.js)
const { authenticate, authorize } = require('../middle-ware/authMiddleware');

// Anyone authenticated can view customers
router.get('/', authenticate, customerController.getAllCustomers);

// Only Admin can add customers
router.post('/', authenticate, authorize('Admin'), customerController.createCustomer);

// Only Admin can edit customers
router.put('/:id', authenticate, authorize('Admin'), customerController.updateCustomer);

// Only Admin can delete customers
router.delete('/:id', authenticate, authorize('Admin'), customerController.deleteCustomer);
```

### Multiple Roles Example

```javascript
// Admin, Manager, and Billing Clerk can generate bills
router.post('/generate', 
  authenticate, 
  authorize('Admin', 'Billing Clerk'), 
  billingController.generateBill
);

// Admin and Cashier can record payments
router.post('/payments', 
  authenticate, 
  authorize('Admin', 'Cashier'), 
  paymentController.recordPayment
);
```

---

## 🚀 Next Steps

### 1. Update Each Page Component
Add permission checks to buttons/actions in:
- ✅ Customers page
- ✅ Connections page
- ✅ Meters page
- ✅ Readings page
- ✅ Billing page
- ✅ Payments page
- ✅ Complaints page

### 2. Protect Backend Routes
Add `authenticate` and `authorize` middleware to all API endpoints.

### 3. Test Each Role
Create test users for each role and verify:
- Sidebar shows correct items
- Can't access unauthorized routes via URL
- Buttons are hidden for unauthorized actions
- API calls are blocked by backend

---

## 📝 Test Users

Create these users in your database for testing:

```sql
-- Admin
INSERT INTO [User] (username, password_hash, full_name, email, user_role, user_status)
VALUES ('admin', '$2a$10$...', 'Admin User', 'admin@utility.lk', 'Admin', 'Active');

-- Field Officer
INSERT INTO [User] (username, password_hash, full_name, email, user_role, user_status)
VALUES ('fieldofficer', '$2a$10$...', 'Field Officer', 'field@utility.lk', 'Field Officer', 'Active');

-- Cashier
INSERT INTO [User] (username, password_hash, full_name, email, user_role, user_status)
VALUES ('cashier', '$2a$10$...', 'Cashier User', 'cashier@utility.lk', 'Cashier', 'Active');

-- Manager
INSERT INTO [User] (username, password_hash, full_name, email, user_role, user_status)
VALUES ('manager', '$2a$10$...', 'Manager User', 'manager@utility.lk', 'Manager', 'Active');

-- Billing Clerk
INSERT INTO [User] (username, password_hash, full_name, email, user_role, user_status)
VALUES ('billingclerk', '$2a$10$...', 'Billing Clerk', 'billing@utility.lk', 'Billing Clerk', 'Active');
```

All default password: `password123`
