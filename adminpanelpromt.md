I'm building the remaining pages for a Utility Management System Admin Dashboard using React, Vite, and regular CSS (NO Tailwind). This system manages electricity, water, and gas utilities for customers.

CONTEXT - DATABASE STRUCTURE:
We have 10 entities in our SQL Server database:
1. Customer (customer_id, customer_type, first_name, last_name, company_name, email, phone, address, city, postal_code, status)
2. Utility_Type (utility_type_id, utility_name, unit_of_measurement, description, status)
3. Service_Connection (connection_id, customer_id, utility_type_id, connection_number, connection_date, connection_status, property_address)
4. Meter (meter_id, connection_id, meter_number, meter_type, manufacturer, installation_date, meter_status)
5. Meter_Reading (reading_id, meter_id, reading_date, current_reading, previous_reading, consumption, reading_type, reader_id)
6. Tariff_Plan (tariff_id, utility_type_id, tariff_name, customer_type, rate_per_unit, fixed_charge, effective_from, effective_to, tariff_status)
7. Billing (bill_id, connection_id, reading_id, tariff_id, bill_number, bill_date, due_date, consumption, total_amount, amount_paid, outstanding_balance, bill_status)
8. Payment (payment_id, bill_id, customer_id, payment_number, payment_date, payment_amount, payment_method, transaction_reference, received_by, payment_status)
9. User (user_id, username, full_name, email, phone, user_role, department, user_status)
10. Complaint (complaint_id, customer_id, connection_id, complaint_number, complaint_date, complaint_type, priority, description, assigned_to, complaint_status, resolution_date, resolution_notes)

TECH STACK:
- React 18 with Vite
- Regular CSS (separate .css files for each component)
- React Router DOM for navigation
- Axios for API calls (backend: http://localhost:5000/api)
- Lucide React for icons
- React Hot Toast for notifications
- React Hook Form for form handling

PAGES TO CREATE:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CUSTOMERS PAGE (/customers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Customer Management" with "+ Add Customer" button (top-right)
- Search bar with placeholder "Search by name, email, or phone..."
- Filter dropdown: "All Types" | "Residential" | "Commercial" | "Industrial" | "Government"
- Status filter: "All Status" | "Active" | "Inactive" | "Suspended"

DATA TABLE:
Columns: Avatar (initials) | Customer Name | Email | Phone | Customer Type (badge) | City | Status (badge) | Actions
- Avatar: Colored circle with initials (e.g., "NB" for Nuwan Bandara)
- Customer Type badges: 
  * Residential (blue)
  * Commercial (green)
  * Industrial (orange)
  * Government (purple)
- Status badges:
  * Active (green)
  * Inactive (gray)
  * Suspended (red)
- Actions: View (eye icon) | Edit (pencil icon) | Delete (trash icon)
- Pagination: 10 records per page with page numbers
- Empty state: "No customers found" with illustration

ADD/EDIT CUSTOMER MODAL:
Form fields:
- Customer Type (radio buttons: Residential, Commercial, Industrial, Government)
- First Name* (required)
- Last Name* (required)
- Company Name (only if Commercial/Industrial/Government)
- Email* (validation)
- Phone* (format: 0XXXXXXXXX)
- Address*
- City*
- Postal Code*
- Status (dropdown: Active, Inactive, Suspended)
Buttons: Cancel (gray) | Save (blue gradient)

VIEW CUSTOMER DETAILS MODAL:
Sections:
- Customer Information (left column): All customer details
- Service Connections (right column): List of active connections with utility icons
- Recent Bills: Last 5 bills with status
- Recent Complaints: Last 3 complaints with priority badges
Buttons: Edit | Close

CSS STYLING:
- Modern card-based design with box-shadow
- Smooth hover effects on table rows (background-color transition)
- Gradient buttons with hover state
- Modal backdrop with blur effect
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Badge styles with colored backgrounds and white text
- Search bar with icon inside (magnifying glass)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. SERVICE CONNECTIONS PAGE (/connections)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Service Connections" with "+ New Connection" button
- Filter tabs: All (count) | Active (count) | Disconnected | Suspended | Pending
- Search by connection number or customer name
- Utility filter: All | Electricity | Water | Gas

CARD GRID LAYOUT (instead of table):
Each connection card shows:
- Utility icon (top-left, colored: Electricity=yellow, Water=blue, Gas=orange)
- Connection number (bold)
- Customer name (link to customer details)
- Property address
- Connection date
- Status badge (top-right corner)
- Meter info: Meter number + type
- Quick actions: View Details | View Meter | View Bills
Grid: 3 cards per row on desktop, 2 on tablet, 1 on mobile

CONNECTION DETAILS MODAL:
Tabs: Overview | Meter Details | Billing History | Consumption Trends
- Overview: All connection info + customer details
- Meter Details: Current meter readings, last reading date, meter status
- Billing History: Table of last 10 bills
- Consumption Trends: Simple line chart (can be placeholder for now)

ADD CONNECTION FORM:
Steps (multi-step form with progress indicator):
Step 1: Select Customer (searchable dropdown)
Step 2: Select Utility Type (Electricity, Water, Gas - radio cards with icons)
Step 3: Connection Details (connection number, property address, connection date)
Step 4: Assign Meter (meter number, meter type, manufacturer, installation date)
Progress bar at top showing steps 1-4

CSS STYLING:
- Card-based grid layout with hover lift effect (transform: translateY(-5px))
- Colored utility icons with gradient backgrounds
- Tab navigation with underline indicator animation
- Multi-step form with animated transitions
- Progress bar with gradient fill
- Responsive grid using CSS Grid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. METERS PAGE (/meters)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Meter Management" with "+ Register Meter" button
- Filter by: Meter Status (All, Active, Faulty, Replaced, Removed)
- Filter by: Meter Type (All, Digital, Analog, Smart Meter, Industrial Meter)
- Filter by: Utility Type (All, Electricity, Water, Gas)
- Search by meter number or customer name

DATA TABLE:
Columns: Meter Number | Utility Type (icon + text) | Customer Name | Meter Type | Manufacturer | Installation Date | Last Maintenance | Status (badge) | Actions
- Utility icons: Bolt (electricity), Droplet (water), Flame (gas)
- Status badges:
  * Active (green)
  * Faulty (red)
  * Replaced (gray)
  * Removed (dark gray)
- Actions: View Details | Record Reading | Schedule Maintenance
- Color-code rows by status (very subtle background color)
- Sort by: Installation Date, Last Maintenance, Meter Number

METER DETAILS MODAL:
Left column:
- Meter Information (all meter fields)
- Connection Details (customer + connection info)
Right column:
- Reading History: Last 5 readings with consumption
- Maintenance History: Last 3 maintenance records
- Current Status: Large status indicator with color
Chart: Consumption trend (last 6 months - can be placeholder line chart)
Buttons: Edit | Record Reading | Schedule Maintenance | Close

RECORD METER READING FORM:
Fields:
- Meter Number (auto-filled, readonly)
- Customer Name (auto-filled, readonly)
- Reading Date* (date picker, default today)
- Current Reading* (number input)
- Previous Reading (auto-filled from last reading)
- Consumption (auto-calculated)
- Reading Type (dropdown: Actual, Estimated, Customer-Submitted)
- Reader Name (auto-filled from logged-in user)
- Notes (textarea)
Buttons: Cancel | Submit Reading

CSS STYLING:
- Table with alternating row colors (zebra striping)
- Icon badges with colored backgrounds for utilities
- Split-view modal (60-40 layout)
- Auto-calculate field with highlight animation
- Date picker with calendar icon
- Hover state for action buttons with tooltips

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. METER READINGS PAGE (/readings)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Meter Readings" with "+ Record Reading" button
- Date range filter: From Date - To Date (date pickers)
- Filter by: Utility Type, Reading Type (Actual, Estimated, Customer-Submitted)
- Search by meter number or customer name
- Quick filters: Today | This Week | This Month | Last 30 Days

DATA TABLE:
Columns: Reading Date | Meter Number | Customer Name | Utility Type (icon) | Previous Reading | Current Reading | Consumption (highlighted) | Reading Type (badge) | Reader Name | Actions
- Consumption column: Bold, larger font, colored (green if normal, orange if high)
- Reading Type badges:
  * Actual (green)
  * Estimated (orange)
  * Customer-Submitted (blue)
- Actions: View Details | Edit | Generate Bill
- Export button: "Export to CSV" (top-right)
- Summary cards above table: Total Readings Today | Average Consumption | Pending Readings

READING DETAILS MODAL:
- Complete reading information
- Before/After comparison (side-by-side)
- Consumption calculation breakdown
- Associated bills (if any)
- Reader information
- Timeline: Visual timeline showing this reading vs previous readings
Buttons: Edit | Generate Bill | Print | Close

BULK READING IMPORT:
- Upload CSV file button
- CSV template download link
- Preview table after upload (showing 5 rows)
- Validation messages (errors highlighted in red)
- Import button (only enabled if validation passes)

CSS STYLING:
- Consumption highlighting (conditional colors)
- Date range picker with calendar overlay
- Export button with download icon animation
- CSV upload with drag-and-drop zone (dashed border, hover effect)
- Reading comparison with side-by-side cards
- Timeline visualization with connecting lines

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. BILLING PAGE (/billing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Billing Management" with "+ Generate Bill" button
- Status tabs: All Bills (count) | Unpaid (count) | Paid | Partially Paid | Overdue (count) | Cancelled
- Date filter: Billing Period (dropdown: This Month, Last Month, Last 3 Months, Custom Range)
- Search by bill number or customer name
- Quick stats cards row:
  * Total Bills This Month (count)
  * Total Amount Billed (Rs.)
  * Total Collected (Rs.)
  * Outstanding Amount (Rs. in red)

CARD GRID LAYOUT (similar to connections):
Each bill card shows:
- Bill number (top, bold)
- Customer name + customer type badge
- Utility icon + type
- Billing period dates
- Consumption amount + unit
- Total amount (large, bold)
- Outstanding balance (if any, in red)
- Due date (with overdue indicator if past due)
- Status badge (top-right corner)
- Actions: View Details | Record Payment | Download PDF | Send Email
Grid: 3 cards per row

BILL DETAILS MODAL:
Printable invoice layout:
Header:
- Company logo/name
- Bill number, bill date
- Due date (highlighted if overdue)

Customer Details (left):
- Customer name, type
- Address
- Email, phone

Billing Details (right):
- Connection number
- Utility type
- Meter number
- Billing period
- Previous reading, current reading

Charges Breakdown:
- Consumption: [amount] × [rate] = Rs. [total]
- Fixed charge: Rs. [amount]
- Subtotal: Rs. [amount]
- Late fee (if applicable): Rs. [amount]
- Total amount: Rs. [amount] (large, bold)
- Amount paid: Rs. [amount]
- Outstanding balance: Rs. [amount] (bold, colored)

Payment History (if any):
Table showing: Payment Date | Payment Method | Amount | Transaction Ref

Buttons: Record Payment | Print | Download PDF | Send Email | Close

GENERATE BILL FORM:
Steps:
Step 1: Select Meter Reading (dropdown showing recent unprocessed readings)
Step 2: Review Calculation
  - Auto-filled: Customer, connection, consumption
  - Tariff applied (auto-selected based on utility + customer type)
  - Rate per unit (auto-filled)
  - Fixed charge (auto-filled)
  - CALCULATED TOTAL (large display)
Step 3: Set Due Date (date picker, default: +30 days)
Step 4: Review & Generate
  - Summary of bill
  - Generate button

CSS STYLING:
- Card layout with colored left border (status-based)
- Overdue bills have red pulsing border animation
- Invoice modal styled like printable document
- Calculation breakdown with horizontal separators
- Print-friendly styles (@media print)
- Status-based color coding throughout
- Step wizard with animated progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. PAYMENTS PAGE (/payments)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Payment Management" with "+ Record Payment" button
- Date filter: Payment Date (Today | This Week | This Month | Custom Range)
- Payment method filter: All | Cash | Card | Bank Transfer | Online | Cheque
- Payment status filter: All | Completed | Pending | Failed | Refunded
- Search by payment number, bill number, or customer name
- Summary cards:
  * Today's Collections (Rs.)
  * This Month's Collections (Rs.)
  * Pending Payments (count)
  * Failed Transactions (count)

DATA TABLE:
Columns: Payment Date | Payment Number | Customer Name | Bill Number | Payment Amount (bold, large) | Payment Method (icon + text) | Transaction Ref | Received By | Status (badge) | Actions
- Payment Method icons:
  * Cash (banknote icon)
  * Card (credit card icon)
  * Bank Transfer (building icon)
  * Online (smartphone icon)
  * Cheque (file icon)
- Status badges:
  * Completed (green)
  * Pending (orange)
  * Failed (red)
  * Refunded (gray)
- Actions: View Receipt | Print | Refund (if applicable)
- Highlight row green on hover for completed payments
- Total row at bottom showing sum of displayed payments

PAYMENT DETAILS / RECEIPT MODAL:
Receipt layout (printable):
Header:
- "PAYMENT RECEIPT" (centered, large)
- Receipt number
- Payment date & time

Payment Information:
- Payment Number
- Payment Amount (very large, bold)
- Payment Method
- Transaction Reference
- Payment Status

Bill Information:
- Bill Number
- Bill Date
- Bill Amount
- Previous Balance
- Amount Paid
- Remaining Balance

Customer Information:
- Customer Name
- Customer Type
- Email, Phone
- Address

Received By:
- Cashier/Staff name
- Date & Time

Footer:
- Company details
- Thank you message

Buttons: Print Receipt | Email Receipt | Download PDF | Close

RECORD PAYMENT FORM:
Section 1: Select Bill
- Search unpaid/partially paid bills
- Show: Bill Number, Customer Name, Total Amount, Outstanding Balance
- Select bill (radio button)

Section 2: Payment Details
- Payment Date* (date picker, default today)
- Payment Amount* (number, max = outstanding balance)
- Payment Method* (dropdown: Cash, Card, Bank Transfer, Online, Cheque)
- Transaction Reference (text, required for non-cash methods)
- Received By (auto-filled, readonly - current logged-in user)
- Notes (textarea, optional)

Section 3: Confirmation
- Summary of payment
- Show remaining balance after this payment
- Confirm & Process button

Auto-update bill status after payment:
- If payment = outstanding → Status: Paid
- If payment < outstanding → Status: Partially Paid

CSS STYLING:
- Receipt layout with border and padding (looks like paper)
- Payment amount displayed very prominently
- Method icons with colored circles
- Print-friendly receipt design
- Transaction reference shown in monospace font
- Success animation after payment (checkmark with green circle)
- Remaining balance calculation preview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. COMPLAINTS PAGE (/complaints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Complaint Management" with "+ Log Complaint" button
- Status tabs: All (count) | Open (count) | In Progress (count) | Resolved | Closed | Rejected
- Priority filter: All | Low | Medium | High | Urgent
- Complaint type filter: All | Billing Issue | Meter Fault | Service Disruption | Quality Issue | Connection Request | Other
- Search by complaint number or customer name
- Assigned to filter: All | My Complaints | Unassigned

KANBAN BOARD LAYOUT (instead of table):
3 columns: Open | In Progress | Resolved
Each complaint card shows:
- Complaint number (top)
- Priority badge (top-right: Low=gray, Medium=blue, High=orange, Urgent=red with pulse)
- Complaint type icon + label
- Customer name
- Complaint date (relative: "2 days ago")
- Short description (first 100 characters)
- Assigned to: User avatar + name (or "Unassigned")
- Actions: View Details | Assign | Change Status
Cards are draggable between columns
Card color accent based on priority (left border)

COMPLAINT DETAILS MODAL:
Left side (60%):
Header:
- Complaint Number
- Priority badge (large)
- Status badge (large)
- Customer Name (link to customer profile)
- Connection Number (if applicable)

Complaint Information:
- Complaint Type
- Complaint Date
- Description (full text, scrollable)
- Assigned To (with avatar)

Resolution Section (if resolved):
- Resolution Date
- Resolution Notes
- Resolved By

Timeline:
- Visual timeline showing: Created → Assigned → In Progress → Resolved
- Each step with timestamp and user

Right side (40%):
Actions Panel:
- Change Status (dropdown)
- Assign To (user dropdown)
- Change Priority (dropdown)
- Save Changes button

Quick Actions:
- Call Customer (phone icon + number)
- Email Customer (email icon + address)
- View Service Connection
- View Bills

Add Comment:
- Textarea for internal notes
- Add Comment button
- Comment history below (scrollable)

Buttons: Close Complaint | Print | Close Modal

LOG NEW COMPLAINT FORM:
Section 1: Customer & Connection
- Search Customer (dropdown with search)
- Related Connection (dropdown, filtered by customer)

Section 2: Complaint Details
- Complaint Type* (dropdown: Billing Issue, Meter Fault, Service Disruption, Quality Issue, Connection Request, Other)
- Priority* (radio buttons with colored indicators: Low, Medium, High, Urgent)
- Description* (textarea, min 50 characters)

Section 3: Assignment
- Assign To (user dropdown, filtered by role)
- Notes (internal notes, optional)

Auto-generate complaint number: COMP-YYYY-XXXX
Initial status: Open

CSS STYLING:
- Kanban board with 3 equal-width columns
- Drag-and-drop visual feedback (shadow on drag, highlight drop zone)
- Priority badges with pulsing animation for Urgent
- Timeline visualization with connecting lines and dots
- Comment section styled like chat (alternating left/right)
- Responsive: Kanban becomes stacked list on mobile
- Urgent complaints have red pulsing glow effect

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. REPORTS PAGE (/reports)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
- Page header: "Reports & Analytics"
- Date range selector: From Date - To Date (default: This Month)
- Quick filters: Today | This Week | This Month | Last Month | This Year | Custom
- Export All button (top-right): Download as PDF or Excel

REPORT CARDS GRID:
4 cards in a 2x2 grid, each representing a report type:

Card 1: Revenue Report
- Icon: Dollar sign
- Total Revenue (large number)
- Breakdown: By utility type (Electricity, Water, Gas)
- Mini bar chart showing comparison
- "View Details" button → Opens detailed modal

Card 2: Customer Statistics
- Icon: Users
- Total Customers (number)
- Breakdown: By customer type (Residential, Commercial, Industrial, Government)
- Pie chart
- "View Details" button

Card 3: Billing Summary
- Icon: File text
- Total Bills Generated (number)
- Paid vs Unpaid (progress bar)
- Outstanding amount (highlighted in red)
- "View Details" button

Card 4: Payment Analysis
- Icon: Credit card
- Total Payments Received (number)
- Breakdown: By payment method
- Trend line (up or down arrow with percentage)
- "View Details" button

Card 5: Consumption Trends
- Icon: Activity
- Average Consumption
- Breakdown: By utility type
- Line chart (3 lines for 3 utilities)
- "View Details" button

Card 6: Complaint Analytics
- Icon: Alert circle
- Total Complaints (number)
- Breakdown: By status (Open, In Progress, Resolved)
- Resolution rate (percentage)
- "View Details" button

DETAILED REPORT MODALS:
Each card opens a full-screen modal with:
- Report title
- Date range (editable)
- Detailed charts (larger versions)
- Data table with sortable columns
- Export options: PDF, Excel, CSV
- Print button
- Filters specific to that report
- Close button

REVENUE REPORT MODAL (example):
- Line chart: Revenue over time (daily/weekly/monthly toggle)
- Bar chart: Revenue by utility type
- Table: Date | Utility Type | Bills Generated | Amount Collected | Outstanding
- Summary: Total billed, Total collected, Collection rate (%)
- Filters: Utility Type, Customer Type
- Export buttons

CSS STYLING:
- Card grid with hover lift effect
- Mini charts inside cards (use canvas or SVG)
- Color-coded categories (consistent throughout)
- Full-screen modal with dark overlay
- Responsive charts (resize with window)
- Print-friendly report layout
- Export buttons with animated icons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GENERAL CSS REQUIREMENTS FOR ALL PAGES:

1. COLOR SCHEME:
   - Primary: #3B82F6 (blue)
   - Success: #10B981 (green)
   - Warning: #F59E0B (orange)
   - Danger: #EF4444 (red)
   - Background: #F9FAFB (light gray)
   - Card Background: #FFFFFF (white)
   - Text: #1F2937 (dark gray)
   - Text Secondary: #6B7280 (gray)
   - Border: #E5E7EB (light gray)

2. TYPOGRAPHY:
   - Font family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif
   - Headings: font-weight: 600 (semibold)
   - Body: font-size: 14px, line-height: 1.5
   - Large numbers: font-size: 24px, font-weight: 700 (bold)

3. SPACING:
   - Container padding: 24px
   - Card padding: 20px
   - Section spacing: 32px between major sections
   - Form field spacing: 16px margin-bottom
   - Button padding: 12px 24px

4. COMPONENTS:
   - Buttons: border-radius: 8px, padding: 10px 20px, font-weight: 500
   - Cards: border-radius: 12px, box-shadow: 0 1px 3px rgba(0,0,0,0.1)
   - Inputs: border-radius: 6px, border: 1px solid #E5E7EB, padding: 10px 12px
   - Modals: border-radius: 16px, max-width: 800px (or 1200px for large), backdrop: rgba(0,0,0,0.5) with backdrop-filter: blur(4px)
   - Tables: border-collapse: collapse, alternating row colors, hover effect
   - Badges: border-radius: 12px, padding: 4px 12px, font-size: 12px, font-weight: 500

5. ANIMATIONS:
   - Hover transitions: transition: all 0.2s ease
   - Modal open: fade-in + scale animation (0.95 to 1)
   - Loading states: spinner or skeleton screens
   - Success actions: green checkmark animation
   - Page transitions: fade between routes

6. RESPONSIVE BREAKPOINTS:
   - Mobile: max-width: 640px (1 column)
   - Tablet: 641px - 1024px (2 columns)
   - Desktop: 1025px+ (3-4 columns)
   Use CSS media queries

7. COMMON UI PATTERNS:
   - Empty states with illustrations and helpful text
   - Loading spinners for async operations
   - Toast notifications (top-right) for success/error messages
   - Confirmation dialogs for destructive actions (delete, refund, etc.)
   - Form validation errors (red text below input, red border on input)
   - Required field indicator (red asterisk)
   - Disabled button states (opacity: 0.5, cursor: not-allowed)

8. ACCESSIBILITY:
   - Proper semantic HTML (header, main, section, article)
   - ARIA labels for icon buttons
   - Focus states (outline: 2px solid #3B82F6)
   - Color contrast ratio minimum 4.5:1
   - Keyboard navigation support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE STRUCTURE TO CREATE:

src/
├── pages/
│   ├── Customers/
│   │   ├── Customers.jsx
│   │   ├── Customers.css
│   │   ├── CustomerForm.jsx
│   │   └── CustomerDetails.jsx
│   │
│   ├── ServiceConnections/
│   │   ├── ServiceConnections.jsx
│   │   ├── ServiceConnections.css
│   │   ├── ConnectionForm.jsx
│   │   └── ConnectionDetails.jsx
│   │
│   ├── Meters/
│   │   ├── Meters.jsx
│   │   ├── Meters.css
│   │   ├── MeterForm.jsx
│   │   ├── MeterDetails.jsx
│   │   └── RecordReadingForm.jsx
│   │
│   ├── MeterReadings/
│   │   ├── MeterReadings.jsx
│   │   ├── MeterReadings.css
│   │   ├── ReadingForm.jsx
│   │   └── ReadingDetails.jsx
│   │
│   ├── Billing/
│   │   ├── Billing.jsx
│   │   ├── Billing.css
│   │   ├── BillDetails.jsx
│   │   └── GenerateBillForm.jsx
│   │
│   ├── Payments/
│   │   ├── Payments.jsx
│   │   ├── Payments.css
│   │   ├── PaymentForm.jsx
│   │   └── PaymentReceipt.jsx
│   │
│   ├── Complaints/
│   │   ├── Complaints.jsx
│   │   ├── Complaints.css
│   │   ├── ComplaintForm.jsx
│   │   └── ComplaintDetails.jsx
│   │
│   └── Reports/
│       ├── Reports.jsx
│       ├── Reports.css
│       └── ReportModals/
│           ├── RevenueReport.jsx
│           ├── CustomerStats.jsx
│           └── ... (other report modals)
│
├── components/
│