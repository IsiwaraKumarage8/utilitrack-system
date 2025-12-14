👥 USER ROLES & ACCESS LEVELS
Based on your database, you have 5 user roles:

Admin
Field Officer
Cashier
Manager
Billing Clerk


🎯 ROLE-BASED ACCESS MATRIX
1. ADMIN (Full Access)
Description: System administrator with complete control
Sidebar Menu Access:

✅ Dashboard (full stats, all data)
✅ Customers (view, add, edit, delete)
✅ Service Connections (view, add, edit, disconnect)
✅ Meters (view, add, edit, register, maintenance)
✅ Meter Readings (view, record, edit, delete)
✅ Billing (view, generate, edit, cancel)
✅ Payments (view, record, refund)
✅ Complaints (view, assign, resolve, close)
✅ Reports (all reports, export)
✅ Settings (user management, tariff plans, system config)

Permissions:

Can do EVERYTHING
Can manage other users
Can modify tariff plans
Can override system rules
Can delete records


2. FIELD OFFICER (Meter Reading Focus)
Description: Goes to customer locations to read meters
Sidebar Menu Access:

✅ Dashboard (limited - own stats only)
✅ Customers (view only - to see customer details)
✅ Service Connections (view only - to see connection details)
✅ Meters (view, search)
✅ Meter Readings (view, RECORD, edit own readings)
❌ Billing (NO ACCESS)
❌ Payments (NO ACCESS)
✅ Complaints (view assigned to them, update status)
❌ Reports (NO ACCESS)
❌ Settings (NO ACCESS)

Permissions:

PRIMARY TASK: Record meter readings
Can view customer and meter details
Can update complaints assigned to them
CANNOT generate bills
CANNOT process payments
CANNOT delete anything
Can only edit readings they recorded

Dashboard Shows:

Readings recorded today
Pending readings assigned to them
Complaints assigned to them


3. CASHIER (Payment Processing Focus)
Description: Processes customer payments at office counter
Sidebar Menu Access:

✅ Dashboard (payment-focused stats)
✅ Customers (view only - to verify customer)
❌ Service Connections (NO ACCESS)
❌ Meters (NO ACCESS)
❌ Meter Readings (NO ACCESS)
✅ Billing (view unpaid/partially paid bills only)
✅ Payments (view, RECORD, print receipt)
✅ Complaints (view, log new complaints for customers)
❌ Reports (NO ACCESS)
❌ Settings (NO ACCESS)

Permissions:

PRIMARY TASK: Record payments
Can view customer bills
Can print receipts
Can log complaints from customers
CANNOT generate bills
CANNOT record meter readings
CANNOT delete anything
Cannot issue refunds (only Admin can)

Dashboard Shows:

Today's collections
Payments processed by them
Pending payments


4. MANAGER (Read-Only + Reports)
Description: Oversees operations, makes decisions based on data
Sidebar Menu Access:

✅ Dashboard (full overview, all stats)
✅ Customers (view only)
✅ Service Connections (view only)
✅ Meters (view only)
✅ Meter Readings (view only)
✅ Billing (view only)
✅ Payments (view only)
✅ Complaints (view, ASSIGN, update status)
✅ Reports (view all, export, analytics)
❌ Settings (limited - can't modify system settings)

Permissions:

PRIMARY TASK: View reports and analytics
Can assign complaints to staff
Can view all data (READ-ONLY)
CANNOT add/edit/delete any records
CANNOT process payments
CANNOT generate bills
Can export reports

Dashboard Shows:

Revenue analytics
Performance metrics
Complaint resolution rates
Staff performance


5. BILLING CLERK (Bill Generation Focus)
Description: Generates bills from meter readings
Sidebar Menu Access:

✅ Dashboard (billing-focused stats)
✅ Customers (view only - to verify customer)
✅ Service Connections (view only)
✅ Meters (view only)
✅ Meter Readings (view only - to select for billing)
✅ Billing (view, GENERATE, edit, send email)
❌ Payments (view only - can see payment status)
✅ Complaints (view billing-related complaints)
❌ Reports (limited - billing reports only)
❌ Settings (NO ACCESS)

Permissions:

PRIMARY TASK: Generate bills from meter readings
Can view unprocessed meter readings
Can generate bills
Can edit bill details before sending
Can send bills via email
CANNOT record payments
CANNOT delete bills
CANNOT modify tariff plans

Dashboard Shows:

Bills generated today
Unprocessed readings
Billing statistics


📊 ACCESS MATRIX TABLE
FeatureAdminField OfficerCashierManagerBilling ClerkDashboardFullLimitedPaymentsAnalyticsBillingCustomersFullViewViewViewViewService ConnectionsFullView❌ViewViewMetersFullView❌ViewViewMeter ReadingsFullRecord❌ViewViewBillingFull❌ViewViewGeneratePaymentsFull❌RecordViewViewComplaintsFullAssignedLogAssignViewReportsFull❌❌FullLimitedSettingsFull❌❌❌❌Delete Records✅❌❌❌❌Refund Payments✅❌❌❌❌Modify Tariffs✅❌❌❌❌User Management✅❌❌❌❌

🎨 SIDEBAR NAVIGATION BY ROLE
Admin Sidebar (All 10 items):
📊 Dashboard
👥 Customers
🔌 Service Connections
⚡ Meters
📈 Meter Readings
📄 Billing
💳 Payments
⚠️ Complaints
📊 Reports
⚙️ Settings
Field Officer Sidebar (5 items):
📊 Dashboard
👥 Customers (view only)
🔌 Service Connections (view only)
⚡ Meters
📈 Meter Readings ← PRIMARY TASK
⚠️ Complaints (assigned)
Cashier Sidebar (5 items):
📊 Dashboard
👥 Customers (view only)
📄 Billing (view only)
💳 Payments ← PRIMARY TASK
⚠️ Complaints (log)
Manager Sidebar (9 items):
📊 Dashboard
👥 Customers (view only)
🔌 Service Connections (view only)
⚡ Meters (view only)
📈 Meter Readings (view only)
📄 Billing (view only)
💳 Payments (view only)
⚠️ Complaints (assign)
📊 Reports ← PRIMARY TASK
Billing Clerk Sidebar (7 items):
📊 Dashboard
👥 Customers (view only)
🔌 Service Connections (view only)
⚡ Meters (view only)
📈 Meter Readings (view only)
📄 Billing ← PRIMARY TASK
💳 Payments (view status)
⚠️ Complaints (billing issues)

🔒 BUTTON/ACTION VISIBILITY BY ROLE
Customers Page:
ActionAdminField OfficerCashierManagerBilling ClerkView✅✅✅✅✅Add Customer✅❌❌❌❌Edit Customer✅❌❌❌❌Delete Customer✅❌❌❌❌
Meter Readings Page:
ActionAdminField OfficerCashierManagerBilling ClerkView✅✅❌✅✅Record Reading✅✅❌❌❌Edit Reading✅✅ (own)❌❌❌Delete Reading✅❌❌❌❌
Billing Page:
ActionAdminField OfficerCashierManagerBilling ClerkView✅❌✅ (unpaid)✅✅Generate Bill✅❌❌❌✅Edit Bill✅❌❌❌✅Cancel Bill✅❌❌❌❌Download PDF✅❌✅✅✅
Payments Page:
ActionAdminField OfficerCashierManagerBilling ClerkView✅❌✅✅✅ (status)Record Payment✅❌✅❌❌Print Receipt✅❌✅✅✅Refund✅❌❌❌❌
Complaints Page:
ActionAdminField OfficerCashierManagerBilling ClerkView All✅❌❌✅✅ (billing)View Assigned✅✅✅✅✅Log Complaint✅✅✅✅✅Assign✅❌❌✅❌Resolve✅✅ (assigned)❌❌❌Close✅❌❌❌❌

💡 IMPLEMENTATION APPROACH
You're correct - you'll conditionally render components based on user role!
Step 1: Store user role in context/state after login
javascript// After successful login
const userData = {
  user_id: 1,
  username: 'admin001',
  full_name: 'Rajesh Kumar',
  user_role: 'Admin',  // ← This is key!
  email: 'rajesh@utility.lk',
  token: 'jwt_token_here'
};

localStorage.setItem('user', JSON.stringify(userData));
Step 2: Create role-based sidebar config
javascript// In Sidebar.jsx
const menuItemsByRole = {
  Admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Plug, label: 'Service Connections', path: '/connections' },
    // ... all 10 items
  ],
  'Field Officer': [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Gauge, label: 'Meters', path: '/meters' },
    { icon: Activity, label: 'Meter Readings', path: '/readings' },
    { icon: AlertCircle, label: 'Complaints', path: '/complaints' },
  ],
  Cashier: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: FileText, label: 'Billing', path: '/billing' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: AlertCircle, label: 'Complaints', path: '/complaints' },
  ],
  // ... etc
};

// Then render based on role
const userRole = JSON.parse(localStorage.getItem('user')).user_role;
const menuItems = menuItemsByRole[userRole];
Step 3: Hide/show buttons based on role
javascript// In Customers.jsx
const user = JSON.parse(localStorage.getItem('user'));
const canEdit = user.user_role === 'Admin';

return (
  <div>
    {canEdit && (
      <button onClick={handleEdit}>Edit Customer</button>
    )}
  </div>
);