I need to create three pages for my Utility Management System: Billing, Payments, and Complaints. These pages should follow the EXACT same design style, CSS patterns, and UI components as my existing Customers page.

IMPORTANT: 
- Analyze my existing Customers page structure, CSS styling, and component patterns
- Use the SAME card/table layouts, colors, spacing, fonts, and animations
- Reuse existing CSS classes where possible
- Maintain consistent design language across all pages
- Use the same loading, error, and empty state components

EXISTING DESIGN SYSTEM TO FOLLOW:
- Primary color: #3B82F6 (blue)
- Success: #10B981 (green)
- Warning: #F59E0B (orange)  
- Danger: #EF4444 (red)
- Background: #F9FAFB
- Card background: White with shadow
- Border radius: 8-12px
- Font family: System fonts
- Button styles: Same as Customers page
- Badge styles: Same as Customers page
- Table styles: Same as Customers page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE STRUCTURES:

BILLING TABLE:
```sql
CREATE TABLE Billing (
    bill_id INT IDENTITY(1,1) PRIMARY KEY,
    connection_id INT NOT NULL,
    reading_id INT NOT NULL,
    tariff_id INT NOT NULL,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    bill_date DATE NOT NULL DEFAULT GETDATE(),
    due_date DATE NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    consumption DECIMAL(10,2) NOT NULL,
    rate_per_unit DECIMAL(10,2) NOT NULL,
    fixed_charge DECIMAL(10,2) DEFAULT 0.00,
    consumption_charge DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    outstanding_balance DECIMAL(10,2) NOT NULL,
    bill_status VARCHAR(20) DEFAULT 'Unpaid',
    CONSTRAINT CHK_bill_status CHECK (bill_status IN ('Unpaid', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')),
    notes VARCHAR(500) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

PAYMENT TABLE:
```sql
CREATE TABLE Payment (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    bill_id INT NOT NULL,
    customer_id INT NOT NULL,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    payment_date DATE NOT NULL DEFAULT GETDATE(),
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    CONSTRAINT CHK_payment_method CHECK (payment_method IN ('Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque')),
    transaction_reference VARCHAR(100) NULL,
    received_by INT NULL,
    payment_status VARCHAR(20) DEFAULT 'Completed',
    CONSTRAINT CHK_payment_status CHECK (payment_status IN ('Completed', 'Pending', 'Failed', 'Refunded')),
    notes VARCHAR(500) NULL,
    created_at DATETIME DEFAULT GETDATE()
);
```

COMPLAINT TABLE:
```sql
CREATE TABLE Complaint (
    complaint_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    connection_id INT NULL,
    complaint_number VARCHAR(50) NOT NULL UNIQUE,
    complaint_date DATE NOT NULL DEFAULT GETDATE(),
    complaint_type VARCHAR(50) NOT NULL,
    CONSTRAINT CHK_complaint_type CHECK (complaint_type IN ('Billing Issue', 'Meter Fault', 'Service Disruption', 'Quality Issue', 'Connection Request', 'Other')),
    priority VARCHAR(20) DEFAULT 'Medium',
    CONSTRAINT CHK_priority CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    description VARCHAR(1000) NOT NULL,
    assigned_to INT NULL,
    complaint_status VARCHAR(20) DEFAULT 'Open',
    CONSTRAINT CHK_complaint_status CHECK (complaint_status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Rejected')),
    resolution_date DATE NULL,
    resolution_notes VARCHAR(1000) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOLDER STRUCTURE:

frontend/src/
├── pages/
│   ├── Customers/
│   │   ├── Customers.jsx (EXISTING - use as reference)
│   │   └── Customers.css (EXISTING - use as reference)
│   │
│   ├── Billing/
│   │   ├── Billing.jsx (CREATE THIS)
│   │   └── Billing.css (CREATE THIS - follow Customers.css style)
│   │
│   ├── Payments/
│   │   ├── Payments.jsx (CREATE THIS)
│   │   └── Payments.css (CREATE THIS - follow Customers.css style)
│   │
│   └── Complaints/
│       ├── Complaints.jsx (CREATE THIS)
│       └── Complaints.css (CREATE THIS - follow Customers.css style)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 1: BILLING PAGE

LAYOUT & FEATURES:

Page Header:
- Title: "Billing Management" (H1, same style as Customers page)
- Subtitle: "Manage bills and generate invoices"
- Action button: "+ Generate Bill" (top-right, primary blue button)

Summary Stats Cards (4 cards in a row - same card style as Dashboard):
1. Total Bills This Month
   - Icon: FileText (blue circle background)
   - Number: Count of bills
   - Label: "Total Bills"

2. Total Amount Billed
   - Icon: DollarSign (green circle background)
   - Amount: Rs. XXX,XXX
   - Label: "Total Billed"

3. Total Collected
   - Icon: CheckCircle (green circle background)
   - Amount: Rs. XXX,XXX
   - Label: "Collected"

4. Outstanding Amount
   - Icon: AlertCircle (red circle background)
   - Amount: Rs. XXX,XXX (red text)
   - Label: "Outstanding"

Filter Section (same style as Customers page filters):
- Status Tabs (horizontal tabs):
  * All Bills (with count badge)
  * Unpaid (with count badge, orange)
  * Paid (with count badge, green)
  * Partially Paid (with count badge, yellow)
  * Overdue (with count badge, red)
  * Cancelled (with count badge, gray)

- Search bar: "Search by bill number or customer name..."
- Date filter dropdown: "This Month" | "Last Month" | "Last 3 Months" | "Custom Range"

Data Display (TABLE FORMAT - same style as Customers table):
Columns:
1. Bill Number (bold, clickable)
2. Customer Name
3. Utility Type (icon + text badge: Electricity/Water/Gas)
4. Bill Date
5. Due Date (highlight red if overdue)
6. Total Amount (bold, Rs. format)
7. Outstanding Balance (red if > 0)
8. Status (colored badge)
9. Actions (3 icon buttons: View | Download | Payment)

Table Features:
- Alternating row colors (same as Customers)
- Hover effect on rows
- Sort by clicking column headers
- 10 rows per page with pagination
- Loading spinner while fetching
- Empty state: "No bills found"
- Error state with retry button

Status Badge Colors:
- Unpaid: Orange background
- Paid: Green background
- Partially Paid: Yellow background
- Overdue: Red background with pulse animation
- Cancelled: Gray background

Action Buttons:
- View Details: Eye icon (blue on hover)
- Download PDF: Download icon (green on hover)
- Record Payment: CreditCard icon (orange on hover)

Row Click Behavior:
- Clicking anywhere on row opens Bill Details modal

MOCK DATA (10-15 sample records):
```javascript
const mockBills = [
  {
    bill_id: 1,
    bill_number: 'BILL-2024-0001',
    customer_name: 'Nuwan Bandara',
    customer_type: 'Residential',
    utility_type: 'Electricity',
    bill_date: '2024-10-01',
    due_date: '2024-10-31',
    billing_period_start: '2024-08-31',
    billing_period_end: '2024-09-30',
    consumption: 130.50,
    rate_per_unit: 25.00,
    fixed_charge: 500.00,
    consumption_charge: 3262.50,
    total_amount: 3762.50,
    amount_paid: 0.00,
    outstanding_balance: 3762.50,
    bill_status: 'Unpaid'
  },
  // ... more bills with different statuses
];
```

CSS Requirements:
- Use exact same table structure as Customers.css
- Same card styling for stats
- Same button styling
- Same badge styling
- Same spacing and typography
- Responsive: Stack cards on mobile, hide some columns on tablet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 2: PAYMENTS PAGE

LAYOUT & FEATURES:

Page Header:
- Title: "Payment Management"
- Subtitle: "View and manage customer payments"
- Action button: "+ Record Payment"

Summary Stats Cards (4 cards):
1. Today's Collections
   - Icon: TrendingUp
   - Amount: Rs. XXX,XXX
   - Label: "Today's Revenue"

2. This Month's Collections
   - Icon: Calendar
   - Amount: Rs. XXX,XXX
   - Label: "Monthly Revenue"

3. Pending Payments
   - Icon: Clock
   - Count: XX payments
   - Label: "Pending"

4. Failed Transactions
   - Icon: XCircle
   - Count: XX payments
   - Label: "Failed"

Filter Section:
- Date filter: "Today" | "This Week" | "This Month" | "Custom Range"
- Payment method filter dropdown: "All Methods" | "Cash" | "Card" | "Bank Transfer" | "Online" | "Cheque"
- Status filter: "All" | "Completed" | "Pending" | "Failed" | "Refunded"
- Search bar: "Search by payment number, bill number, or customer..."

Data Display (TABLE FORMAT):
Columns:
1. Payment Date
2. Payment Number (bold, clickable)
3. Customer Name
4. Bill Number (link to bill)
5. Payment Amount (large, bold, green)
6. Payment Method (icon + text badge)
7. Transaction Ref
8. Received By (staff name)
9. Status (badge)
10. Actions (View Receipt | Print | Refund)

Payment Method Icons & Colors:
- Cash: Banknote icon, green badge
- Card: CreditCard icon, blue badge
- Bank Transfer: Building icon, purple badge
- Online: Smartphone icon, cyan badge
- Cheque: FileText icon, orange badge

Status Badge Colors:
- Completed: Green
- Pending: Orange
- Failed: Red
- Refunded: Gray

Special Features:
- Highlight completed payments with light green row background on hover
- Show total amount at bottom of table (sum of displayed payments)
- "Export to CSV" button (top-right)

MOCK DATA:
```javascript
const mockPayments = [
  {
    payment_id: 1,
    payment_number: 'PAY-2024-0001',
    payment_date: '2024-10-05',
    customer_name: 'Anushka Silva',
    customer_id: 2,
    bill_number: 'BILL-2024-0003',
    bill_id: 3,
    payment_amount: 5125.00,
    payment_method: 'Bank Transfer',
    transaction_reference: 'BT-20241005-001',
    received_by: 'Nisha Perera',
    payment_status: 'Completed'
  },
  // ... more payments
];
```

CSS Requirements:
- Same table design as Customers and Billing
- Payment amount column: Larger font, bold, green color
- Same card styling for stats
- Same filters and search styling
- Responsive design

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 3: COMPLAINTS PAGE

LAYOUT & FEATURES:

Page Header:
- Title: "Complaint Management"
- Subtitle: "Track and resolve customer complaints"
- Action button: "+ Log Complaint"

Summary Stats Cards (4 cards):
1. Total Complaints
   - Icon: AlertCircle
   - Count: XXX complaints
   - Label: "Total"

2. Open Complaints
   - Icon: AlertTriangle
   - Count: XX (red)
   - Label: "Open"

3. In Progress
   - Icon: Clock
   - Count: XX (orange)
   - Label: "In Progress"

4. Resolution Rate
   - Icon: CheckCircle
   - Percentage: XX%
   - Label: "Resolved"

Filter Section:
- Status tabs: All | Open | In Progress | Resolved | Closed | Rejected
- Priority filter: All | Low | Medium | High | Urgent
- Complaint type dropdown: All | Billing Issue | Meter Fault | Service Disruption | Quality Issue | Connection Request | Other
- Assigned filter: All | My Complaints | Unassigned
- Search: "Search by complaint number or customer..."

Data Display (CARD GRID LAYOUT - different from table):
Instead of table, use CARD GRID (3 columns on desktop, 2 on tablet, 1 on mobile)

Each complaint card shows:
- Complaint number (top-left, bold)
- Priority badge (top-right corner with pulse animation if Urgent)
- Complaint type icon + label
- Customer name (clickable)
- Complaint date (relative time: "2 days ago")
- Description (first 100 characters + "...")
- Assigned to: Avatar circle + name (or "Unassigned" in gray)
- Status badge (bottom)
- Quick actions bar: View Details | Assign | Change Status

Card Styling:
- White background with shadow
- Border-radius: 12px
- Padding: 20px
- Left border accent (4px) colored by priority:
  * Low: Gray
  * Medium: Blue
  * High: Orange
  * Urgent: Red with pulse glow
- Hover: Lift effect (translateY(-5px) + increased shadow)

Priority Badge Styles:
- Low: Gray, small
- Medium: Blue, medium
- High: Orange, medium
- Urgent: Red with pulse animation, larger

Status Badge Colors:
- Open: Orange
- In Progress: Blue
- Resolved: Green
- Closed: Gray
- Rejected: Red

Complaint Type Icons:
- Billing Issue: DollarSign icon
- Meter Fault: AlertCircle icon
- Service Disruption: ZapOff icon
- Quality Issue: ThumbsDown icon
- Connection Request: Plug icon
- Other: HelpCircle icon

MOCK DATA:
```javascript
const mockComplaints = [
  {
    complaint_id: 1,
    complaint_number: 'COMP-2024-0001',
    customer_id: 1,
    customer_name: 'Nuwan Bandara',
    complaint_date: '2024-09-15',
    complaint_type: 'Billing Issue',
    priority: 'Medium',
    description: 'Bill amount seems higher than usual for September. Requesting verification of meter reading.',
    assigned_to: 'Rajesh Kumar',
    assigned_to_id: 1,
    complaint_status: 'Resolved',
    resolution_date: '2024-09-18',
    resolution_notes: 'Meter reading verified. High usage due to AC during hot weather.'
  },
  {
    complaint_id: 4,
    complaint_number: 'COMP-2024-0004',
    customer_id: 4,
    customer_name: 'Malini Fernando',
    complaint_date: '2024-11-01',
    complaint_type: 'Service Disruption',
    priority: 'Urgent',
    description: 'Frequent power outages in the area for the past 3 days. Each outage lasts 2-3 hours.',
    assigned_to: 'Rajesh Kumar',
    assigned_to_id: 1,
    complaint_status: 'In Progress',
    resolution_date: null,
    resolution_notes: null
  },
  // ... more complaints with different statuses and priorities
];
```

CSS Requirements:
- Card grid layout using CSS Grid
- Same color scheme as other pages
- Urgent complaints: Red pulsing border glow animation
- Same stats cards styling
- Same filters styling
- Hover effects on cards
- Responsive: 3 cols → 2 cols → 1 col

Special CSS for urgent pulse:
```css
.complaint-card.urgent {
  border-left: 4px solid #ef4444;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
  }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMMON FEATURES FOR ALL THREE PAGES:

1. Loading State:
- Center spinner with "Loading [page name]..." text
- Same spinner design as Customers page

2. Error State:
- Error icon + message
- "Retry" button
- Same styling as Customers page

3. Empty State:
- Empty icon + "No [items] found" message
- "Add New" or "Refresh" button
- Same styling as Customers page

4. Pagination (for table pages):
- Same pagination component as Customers
- 10 items per page
- Previous/Next buttons + page numbers
- Current page highlighted

5. Search Functionality:
- Debounced search (500ms delay)
- Search icon inside input (left side)
- Clear button (X) when text entered
- Same input styling as Customers

6. Filter Functionality:
- Dropdowns with same styling as Customers
- Tabs with underline indicator
- Active state highlighting

7. Date Formatting:
- All dates: 'YYYY-MM-DD' or 'DD MMM YYYY'
- Relative dates: "2 days ago", "Yesterday", "Today"
- Use date-fns library if needed

8. Currency Formatting:
- All amounts: Rs. X,XXX.XX
- Large amounts in bold
- Negative/overdue in red

9. Icons:
- Use Lucide React icons (same as Customers)
- Icon size: 20px for table actions, 24px for buttons
- Icon colors match theme

10. Responsive Breakpoints:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPLEMENTATION CHECKLIST FOR EACH PAGE:

✓ Import necessary dependencies (React, useState, useEffect, icons)
✓ Define state variables (data, loading, error, filters, search)
✓ Create mock data array (10-15 records with variety)
✓ Implement useEffect for initial data load (mock setTimeout 1000ms)
✓ Implement search function with debounce
✓ Implement filter functions
✓ Implement pagination logic
✓ Create JSX structure matching layout described
✓ Add loading state UI
✓ Add error state UI
✓ Add empty state UI
✓ Create separate CSS file with all styles
✓ Make fully responsive
✓ Add hover effects and transitions
✓ Test all interactions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CSS STRUCTURE TEMPLATE (for each page):
```css
/* Page Container */
.{page}-page {
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  /* Same as Customers page */
}

/* Stats Cards */
.stats-grid {
  /* Same as Dashboard/Customers */
}

.stat-card {
  /* Same styling */
}

/* Filters Section */
.filters-section {
  /* Same as Customers page */
}

/* Table / Card Grid */
.{page}-table {
  /* Same table styling as Customers */
}

/* OR for card grid (Complaints) */
.complaints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

/* Loading, Error, Empty States */
/* Copy from Customers.css */

/* Responsive */
@media (max-width: 1024px) {
  /* Tablet adjustments */
}

@media (max-width: 768px) {
  /* Mobile adjustments */
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT REMINDERS:

1. **ANALYZE CUSTOMERS PAGE FIRST** - Look at the exact CSS classes, structure, spacing, colors used
2. **REUSE CSS PATTERNS** - Don't reinvent the wheel, copy successful patterns
3. **MAINTAIN CONSISTENCY** - All three pages should feel like part of the same app
4. **USE MOCK DATA** - Don't worry about API integration yet, focus on UI
5. **TEST RESPONSIVENESS** - Check on different screen sizes
6. **ADD SMOOTH ANIMATIONS** - Hover effects, transitions (0.2s ease)
7. **PROPER SPACING** - Same padding, margins, gaps as Customers
8. **ACCESSIBLE** - Proper semantic HTML, ARIA labels where needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please create all three pages (Billing, Payments, Complaints) with:
- Complete JSX components
- Separate CSS files matching Customers page style
- Mock data arrays
- All filters and search functionality (client-side)
- Loading, error, empty states
- Fully responsive layouts
- Smooth animations and interactions
- Professional, polished UI

Start with Billing page first, then Payments, then Complaints.
Make them production-ready and visually consistent with the existing app!