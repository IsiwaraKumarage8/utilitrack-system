I'm building an Admin Dashboard for a Utility Management System using React, Vite, and Tailwind CSS. This system manages electricity, water, and gas utilities for customers (residential, commercial, industrial, government).

DATABASE STRUCTURE:
- Customer (customer_id, name, email, phone, address, customer_type, status)
- Service_Connection (connection_id, customer_id, utility_type_id, connection_number, connection_status)
- Meter (meter_id, connection_id, meter_number, meter_type, meter_status)
- Meter_Reading (reading_id, meter_id, reading_date, current_reading, consumption)
- Billing (bill_id, connection_id, bill_number, bill_date, due_date, total_amount, amount_paid, outstanding_balance, bill_status)
- Payment (payment_id, bill_id, payment_number, payment_date, payment_amount, payment_method)
- Complaint (complaint_id, customer_id, complaint_type, priority, complaint_status, description)
- User (user_id, username, full_name, user_role: Admin/Field Officer/Cashier/Manager/Billing Clerk)

TECH STACK:
- React 18 with Vite
- Tailwind CSS for styling
- React Router DOM for navigation
- Axios for API calls (backend runs on http://localhost:5000)
- Lucide React for icons
- React Hot Toast for notifications

PROJECT REQUIREMENTS:

1. CREATE A RESPONSIVE ADMIN DASHBOARD LAYOUT:
   - Fixed sidebar on the left (width: 250px, dark blue/slate background)
   - Top navbar showing: admin name, role badge, notifications icon, logout button
   - Main content area on the right with proper padding
   - Sidebar should be collapsible on mobile devices

2. SIDEBAR NAVIGATION MENU:
   - Dashboard (home icon) - route: /dashboard
   - Customers (users icon) - route: /customers
   - Service Connections (plug icon) - route: /connections
   - Meters (gauge icon) - route: /meters
   - Meter Readings (activity icon) - route: /readings
   - Billing (file-text icon) - route: /billing
   - Payments (credit-card icon) - route: /payments
   - Complaints (alert-circle icon) - route: /complaints
   - Reports (bar-chart icon) - route: /reports
   - Settings (settings icon) - route: /settings
   
   Each menu item should:
   - Highlight when active (brighter background, left border accent)
   - Show icon + text label
   - Have smooth hover effects

3. DASHBOARD PAGE (HOME) SHOULD INCLUDE:
   
   A. STATS CARDS ROW (4 cards):
      - Total Customers (with count and trend indicator)
      - Active Connections (count + percentage)
      - Unpaid Bills (count + total amount in Rs.)
      - Today's Revenue (amount in Rs.)
      
      Each card should have:
      - Icon on the left (in a colored circular background)
      - Number/amount prominently displayed
      - Label text below
      - Small trend indicator (+5% this month)
      - Colored accents (blue, green, orange, purple)

   B. CHARTS SECTION (2 columns):
      - Left: Revenue Trends (Line chart - last 6 months)
      - Right: Utility Distribution (Pie chart - Electricity, Water, Gas percentages)
      Use placeholder data for now.

   C. RECENT ACTIVITY TABLE:
      - Last 10 recent payments/bills
      - Columns: Date, Customer Name, Bill Number, Amount, Status
      - Color-coded status badges (Paid: green, Unpaid: red, Partial: orange)
      - "View All" button at bottom

   D. QUICK ACTIONS SECTION:
      - 4 action buttons in a grid:
        * Add New Customer
        * Generate Bill
        * Record Payment
        * View Reports
      - Each button should have icon + label + subtle hover effect

4. FILE STRUCTURE TO CREATE:

src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          (navigation sidebar)
│   │   ├── Navbar.jsx           (top navigation bar)
│   │   └── DashboardLayout.jsx  (wrapper with sidebar + navbar)
│   │
│   ├── dashboard/
│   │   ├── StatsCard.jsx        (reusable stats card component)
│   │   ├── RevenueChart.jsx     (line chart component)
│   │   ├── UtilityPieChart.jsx  (pie chart component)
│   │   ├── RecentActivity.jsx   (recent transactions table)
│   │   └── QuickActions.jsx     (action buttons grid)
│   │
│   └── common/
│       ├── Button.jsx           (reusable button component)
│       ├── Card.jsx             (reusable card wrapper)
│       └── Badge.jsx            (status badge component)
│
├── pages/
│   ├── Dashboard.jsx            (main dashboard page)
│   ├── Customers.jsx            (placeholder for now)
│   ├── Billing.jsx              (placeholder for now)
│   └── Payments.jsx             (placeholder for now)
│
├── App.jsx                      (main app with routes)
└── main.jsx                     (entry point)

5. DESIGN GUIDELINES:
   - Use a modern, clean design with plenty of white space
   - Color scheme:
     * Primary: Blue (#3B82F6)
     * Success: Green (#10B981)
     * Warning: Orange (#F59E0B)
     * Danger: Red (#EF4444)
     * Background: Light gray (#F9FAFB)
     * Text: Dark gray (#1F2937)
   - Use shadow-sm for cards
   - Round corners (rounded-lg) for cards and buttons
   - Smooth transitions for hover effects (transition-all duration-200)
   - Mobile responsive (hide sidebar on small screens, show hamburger menu)

6. ROUTING SETUP:
   - Set up React Router with these routes
   - Wrap dashboard routes in DashboardLayout component
   - For now, other pages can just show "Coming Soon" placeholder

7. PLACEHOLDER DATA:
   Create mock data objects for:
   - Stats (totalCustomers: 1247, activeConnections: 3842, unpaidBills: 89, todayRevenue: 487250)
   - Recent activity (10 sample payment records)
   - Chart data (6 months of revenue data, utility distribution percentages)

8. RESPONSIVE BEHAVIOR:
   - Desktop (>1024px): Full sidebar visible, 4 stats cards in row
   - Tablet (768-1024px): Sidebar collapsible, 2 stats cards per row
   - Mobile (<768px): Sidebar hidden (hamburger menu), 1 stat card per row, stack charts vertically

9. IMPORTANT IMPLEMENTATION NOTES:
   - Use Tailwind CSS classes exclusively for styling
   - Use Lucide React for all icons
   - Make components reusable and props-based
   - Add proper TypeScript-style JSDoc comments
   - Use functional components with hooks
   - Implement proper prop validation where needed

10. START BY CREATING:
    - DashboardLayout component (with Sidebar + Navbar)
    - Dashboard page with all sections
    - Reusable components (StatsCard, Card, Button, Badge)
    - Basic routing setup in App.jsx

Please generate the complete code for these components with proper Tailwind styling, modern design, and placeholder data. Make it production-ready and visually impressive. Include proper spacing, hover effects, and smooth transitions.