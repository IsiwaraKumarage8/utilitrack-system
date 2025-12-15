I need to create role-specific dashboard layouts for my Utility Management System. Each user role (Admin, Field Officer, Cashier, Manager, Billing Clerk) should see a different dashboard with relevant information and quick actions based on their responsibilities.

CONTEXT:
Currently, we have one generic Dashboard component. We need to make it dynamic so it shows different content based on the logged-in user's role. The user role is stored in localStorage after login.

User object in localStorage:
```javascript
{
  user_id: 1,
  username: 'admin001',
  full_name: 'Rajesh Kumar',
  user_role: 'Admin', // Admin, Field Officer, Cashier, Manager, Billing Clerk
  email: 'rajesh@utility.lk',
  department: 'Administration',
  token: 'jwt_token_here'
}
```

FOLDER STRUCTURE:
frontend/src/
├── pages/
│   └── Dashboard/
│       ├── Dashboard.jsx (MODIFY - Main dashboard component)
│       ├── Dashboard.css (UPDATE - Add role-specific styles)
│       ├── dashboards/
│       │   ├── AdminDashboard.jsx (CREATE)
│       │   ├── FieldOfficerDashboard.jsx (CREATE)
│       │   ├── CashierDashboard.jsx (CREATE)
│       │   ├── ManagerDashboard.jsx (CREATE)
│       │   └── BillingClerkDashboard.jsx (CREATE)
│       └── components/
│           ├── StatsCard.jsx (existing - reuse)
│           ├── RecentActivity.jsx (existing - reuse)
│           ├── QuickActions.jsx (existing - reuse)
│           └── WelcomeCard.jsx (CREATE - personalized greeting)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DASHBOARD SPECIFICATIONS BY ROLE:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ADMIN DASHBOARD (Complete Overview)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:

Row 1: Welcome Card (Full Width)
- "Welcome back, [Full Name]"
- Current date and time
- Role badge: "Administrator"
- Quick summary: "You have 12 pending tasks"

Row 2: Stats Cards (4 cards)
1. Total Customers
   - Icon: Users (blue)
   - Number: 1,247
   - Trend: +5.2% from last month
   - Subtitle: "Active customers"

2. Active Connections
   - Icon: Plug (green)
   - Number: 3,842
   - Trend: +2.1% from last month
   - Subtitle: "Service connections"

3. Unpaid Bills
   - Icon: AlertCircle (orange)
   - Number: 89
   - Amount: Rs. 487,250
   - Subtitle: "Outstanding amount"

4. Today's Revenue
   - Icon: DollarSign (purple)
   - Amount: Rs. 125,430
   - Trend: +15.3% from yesterday
   - Subtitle: "Collected today"

Row 3: Charts (2 columns)
Left: Revenue Trends (Line Chart)
- Last 6 months revenue
- Compare electricity, water, gas

Right: Utility Distribution (Pie Chart)
- Percentage by utility type
- Color-coded sections

Row 4: Recent Activity (Table)
- Last 10 transactions (bills/payments)
- Columns: Time, Type, Customer, Amount, Status
- Real-time updates

Row 5: Quick Actions (4 buttons)
1. Add New Customer
2. Generate Bill
3. Record Payment
4. View Reports

Row 6: System Health (3 mini cards)
- Active Users: 8 staff online
- Pending Complaints: 15 open
- System Status: All systems operational

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. FIELD OFFICER DASHBOARD (Meter Reading Focus)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:

Row 1: Welcome Card
- "Welcome, [Full Name]"
- Current date
- Role badge: "Field Officer"
- Quick message: "You have 23 readings pending"

Row 2: My Stats Cards (4 cards)
1. Readings Today
   - Icon: CheckCircle (green)
   - Number: 18
   - Subtitle: "Completed readings"

2. Pending Readings
   - Icon: Clock (orange)
   - Number: 23
   - Subtitle: "Assigned to you"

3. This Week Total
   - Icon: Activity (blue)
   - Number: 87
   - Subtitle: "Readings recorded"

4. Avg. per Day
   - Icon: TrendingUp (purple)
   - Number: 12.4
   - Subtitle: "Your average"

Row 3: Assigned Readings List (Table with Map)
Left (70%): Pending Readings Table
- Connection Number
- Customer Name
- Address
- Utility Type
- Last Reading Date
- Action: "Record Reading" button

Right (30%): Route Map (Optional)
- Show customer locations on map
- Optimize route suggestion
- Or just show list view if map is complex

Row 4: Recent Readings (Your Activity)
- Last 10 readings you recorded
- Columns: Date, Meter Number, Customer, Consumption, Status
- Edit button (only for today's readings)

Row 5: Quick Actions (3 buttons)
1. Record New Reading (PRIMARY - Large, Blue)
2. View My Assignments
3. Report Issue

Row 6: Complaints Assigned to Me
- List of open complaints assigned
- Priority badges
- Quick update button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. CASHIER DASHBOARD (Payment Processing Focus)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:

Row 1: Welcome Card
- "Welcome, [Full Name]"
- Current date and time
- Role badge: "Cashier"
- Shift info: "Shift started at 9:00 AM"

Row 2: Today's Collection Stats (4 cards)
1. Today's Collections
   - Icon: DollarSign (green)
   - Amount: Rs. 45,230
   - Subtitle: "15 payments received"

2. Cash Payments
   - Icon: Banknote (blue)
   - Amount: Rs. 22,100
   - Subtitle: "8 transactions"

3. Card Payments
   - Icon: CreditCard (purple)
   - Amount: Rs. 18,400
   - Subtitle: "5 transactions"

4. Online/Bank
   - Icon: Building (orange)
   - Amount: Rs. 4,730
   - Subtitle: "2 transactions"

Row 3: Payment Processing Section
Left (60%): Customer Search & Bill Lookup
- Search bar: "Enter customer name, phone, or bill number"
- Recent searches
- Quick bill lookup

Right (40%): Unpaid Bills Summary
- Count of unpaid bills
- Total outstanding amount
- Top 5 overdue customers

Row 4: My Payments Today (Table)
- All payments you processed today
- Columns: Time, Payment Number, Customer, Amount, Method, Receipt
- Print Receipt button
- Real-time updates as you add payments

Row 5: Quick Actions (4 buttons)
1. Record Payment (PRIMARY - Large, Green)
2. Search Customer
3. View Unpaid Bills
4. Print Last Receipt

Row 6: Payment Methods Summary (Pie Chart)
- Distribution of payment methods today
- Cash, Card, Bank Transfer, Online breakdown

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. MANAGER DASHBOARD (Analytics & Oversight)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:

Row 1: Welcome Card
- "Welcome, [Full Name]"
- Current date
- Role badge: "Manager"
- Quick insight: "Revenue up 12% this month"

Row 2: Key Performance Indicators (5 cards - smaller)
1. Monthly Revenue
   - Amount: Rs. 1,245,000
   - Trend: +12.3%
   - Target: 95% of goal

2. Collection Rate
   - Percentage: 87.5%
   - Trend: +3.2%
   - Status: Good

3. Customer Growth
   - Number: +42 this month
   - Trend: +5.1%
   - Status: Above target

4. Avg. Bill Amount
   - Amount: Rs. 3,250
   - Trend: -2.1%
   - Status: Normal

5. Complaint Resolution
   - Rate: 92%
   - Trend: +5%
   - Status: Excellent

Row 3: Revenue Analytics (Full Width)
- Multi-line chart: Monthly revenue by utility type
- Last 12 months
- Filters: By utility, by customer type
- Export button

Row 4: Two Column Layout
Left: Top Performing Metrics
- Top 10 customers by revenue
- Top consuming areas (by city)
- Best collection months

Right: Areas of Concern
- Overdue bills (>60 days)
- High complaint areas
- Low collection rate zones
- Staff performance alerts

Row 5: Staff Performance Overview (Table)
- All staff members
- Columns: Name, Role, Tasks Completed Today, Performance Rating
- Filter by department

Row 6: Complaint Overview
- Open complaints by type (bar chart)
- Average resolution time
- Complaints assigned vs resolved

Row 7: Quick Actions (5 buttons)
1. View Full Reports
2. Export Data
3. Assign Complaint
4. Schedule Meeting
5. Send Announcement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. BILLING CLERK DASHBOARD (Bill Generation Focus)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:

Row 1: Welcome Card
- "Welcome, [Full Name]"
- Current date
- Role badge: "Billing Clerk"
- Task status: "18 readings pending billing"

Row 2: Billing Stats (4 cards)
1. Bills Generated Today
   - Icon: FileText (green)
   - Number: 12
   - Amount: Rs. 45,200
   - Subtitle: "Total billed"

2. Pending Readings
   - Icon: Clock (orange)
   - Number: 18
   - Subtitle: "Ready for billing"

3. This Month Total
   - Icon: TrendingUp (blue)
   - Number: 287
   - Amount: Rs. 1,125,000
   - Subtitle: "Bills generated"

4. Avg. Bill Amount
   - Icon: DollarSign (purple)
   - Amount: Rs. 3,920
   - Subtitle: "Average this month"

Row 3: Unprocessed Meter Readings (Priority Table)
- Readings without bills (sorted by date - oldest first)
- Columns: Reading Date, Meter Number, Customer, Utility, Consumption, Action
- "Generate Bill" button for each (quick action)
- Highlight readings >7 days old in orange
- Filter by utility type

Row 4: Bills Generated Today (Table)
- All bills you generated today
- Columns: Bill Number, Customer, Utility, Amount, Status, Actions
- Actions: View, Edit, Email, Download PDF
- Real-time updates

Row 5: Billing Summary Charts
Left: Bills by Utility Type (Bar Chart)
- Electricity, Water, Gas
- This month

Right: Bills by Customer Type (Donut Chart)
- Residential, Commercial, Industrial, Government

Row 6: Quick Actions (4 buttons)
1. Generate Bill (PRIMARY - Large, Blue)
2. View Unprocessed Readings
3. Bulk Bill Generation
4. Send Pending Bills via Email

Row 7: Recent Billing Activity
- Last 20 bills generated (by anyone)
- Real-time feed
- Shows: Time, Bill Number, Customer, Amount, Generated By

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMMON COMPONENTS TO CREATE:

1. WelcomeCard.jsx
Props: userName, userRole, date, quickMessage
- Personalized greeting
- Role-specific badge
- Current date/time
- Quick summary message

2. StatsCard.jsx (Already exists - enhance if needed)
Props: title, value, icon, trend, subtitle, color
- Icon with colored background
- Large value display
- Trend indicator (+/-)
- Subtitle text

3. QuickActionsCard.jsx
Props: actions[] (array of {label, icon, onClick, isPrimary})
- Grid of action buttons
- Primary action highlighted (larger, different color)
- Icon + label for each

4. RecentActivityTable.jsx
Props: title, data[], columns[], onRowClick
- Table with sorting
- Click row to view details
- Pagination if needed
- Empty state

5. ChartCard.jsx
Props: title, chartType, data, options
- Wrapper for charts (line, bar, pie)
- Title with export button
- Responsive sizing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAIN DASHBOARD COMPONENT STRUCTURE:

FILE: Dashboard.jsx
```javascript
import React, { useState, useEffect } from 'react';
import AdminDashboard from './dashboards/AdminDashboard';
import FieldOfficerDashboard from './dashboards/FieldOfficerDashboard';
import CashierDashboard from './dashboards/CashierDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import BillingClerkDashboard from './dashboards/BillingClerkDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Loading state
  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (user.user_role) {
      case 'Admin':
        return <AdminDashboard user={user} />;
      case 'Field Officer':
        return <FieldOfficerDashboard user={user} />;
      case 'Cashier':
        return <CashierDashboard user={user} />;
      case 'Manager':
        return <ManagerDashboard user={user} />;
      case 'Billing Clerk':
        return <BillingClerkDashboard user={user} />;
      default:
        return (
          <div className="dashboard-error">
            <p>Invalid user role</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPLEMENTATION REQUIREMENTS:

1. DATA FETCHING:
Each dashboard should fetch its own relevant data:
- Use appropriate API endpoints
- Show loading states while fetching
- Handle errors gracefully
- Real-time updates where appropriate

2. MOCK DATA (for now):
Create mock data for each dashboard to test UI
Later replace with actual API calls

3. STYLING:
- Follow existing Dashboard.css patterns
- Use same color scheme across all dashboards
- Consistent card styles
- Responsive design (mobile, tablet, desktop)
- Role-specific color accents:
  * Admin: Blue (#3B82F6)
  * Field Officer: Green (#10B981)
  * Cashier: Purple (#8B5CF6)
  * Manager: Orange (#F59E0B)
  * Billing Clerk: Cyan (#06B6D4)

4. INTERACTIVITY:
- All cards and tables should be interactive
- Click stats cards to see details
- Click table rows to view full info
- Quick action buttons should navigate to relevant pages
- Tooltips on hover for additional info

5. RESPONSIVE BEHAVIOR:
- Desktop (>1024px): Full layout as described
- Tablet (768-1024px): 2 column grid, stack charts
- Mobile (<768px): Single column, hide complex charts

6. ACCESSIBILITY:
- Proper semantic HTML
- ARIA labels for icon buttons
- Keyboard navigation
- Screen reader friendly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXAMPLE COMPONENT STRUCTURE:

AdminDashboard.jsx should have:
```javascript
import React, { useState, useEffect } from 'react';
import WelcomeCard from '../components/WelcomeCard';
import StatsCard from '../components/StatsCard';
import QuickActionsCard from '../components/QuickActionsCard';
import RecentActivityTable from '../components/RecentActivityTable';
import ChartCard from '../components/ChartCard';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch all required data
    // For now, use mock data
    setStats({
      totalCustomers: 1247,
      activeConnections: 3842,
      unpaidBills: 89,
      todayRevenue: 125430
    });
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <WelcomeCard
        userName={user.full_name}
        userRole={user.user_role}
        quickMessage="You have 12 pending tasks"
      />

      <div className="stats-grid">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="Users"
          trend="+5.2%"
          subtitle="Active customers"
          color="blue"
        />
        {/* ... more stats cards */}
      </div>

      {/* ... rest of dashboard components */}
    </div>
  );
};

export default AdminDashboard;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please create:
1. Main Dashboard.jsx (router component)
2. Five role-specific dashboard components
3. Shared components (WelcomeCard, enhanced StatsCard, etc.)
4. Mock data for each dashboard
5. CSS with role-specific styling
6. Responsive layouts
7. Loading and error states

Make each dashboard feel personalized and relevant to the user's daily tasks!

✅ WHAT THIS WILL CREATE:

✅ 5 different dashboard layouts (one per role)
✅ Role-specific stats and KPIs
✅ Personalized welcome messages
✅ Relevant quick actions for each role
✅ Role-appropriate data displays
✅ Consistent design language
✅ Responsive across all devices
✅ Mock data ready for testing