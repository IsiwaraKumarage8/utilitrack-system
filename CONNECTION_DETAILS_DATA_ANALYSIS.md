# Connection Details Modal - Data Analysis Document

## Overview
**Component**: `ConnectionDetails.jsx`  
**Purpose**: Display comprehensive details about a service connection when user clicks the "eye" icon  
**Current Implementation**: Centered modal dialog  
**Planned Change**: Convert to side panel (similar to CustomerForm and ConnectionForm)

---

## Data Sources & Flow

### 1. Primary Data Source: Connection Object (Props)
**Passed from parent**: `Connections.jsx` → `ConnectionDetails`

**Trigger**: 
```javascript
const handleViewConnection = (connection) => {
  setSelectedConnection(connection);  // Sets the connection object
  setShowDetails(true);               // Opens the modal
};
```

**Data Structure** (from `Service_Connection` table join query):

```javascript
connection = {
  // Connection fields
  connection_id: Number,
  customer_id: Number,
  utility_type_id: Number,
  connection_number: String,        // e.g., "CONN-2024-001"
  connection_date: Date,            // Installation date
  disconnection_date: Date,         // NULL if active
  connection_status: String,        // "Active", "Disconnected", "Suspended", "Pending"
  property_address: String,
  notes: String,                    // Optional notes
  created_at: Date,
  updated_at: Date,
  
  // Customer details (from Customer table JOIN)
  customer_name: String,            // "First Last"
  customer_type: String,            // "Residential", "Commercial", etc.
  customer_email: String,
  customer_phone: String,
  
  // Utility details (from Utility_Type table JOIN)
  utility_name: String,             // "Electricity", "Water", "Gas", etc.
  unit_of_measurement: String,
  
  // Meter details (from Meter table LEFT JOIN)
  meter_number: String,             // May be NULL
  meter_type: String,               // "Digital", "Analog", "Smart Meter"
  meter_id: Number,                 // Used to fetch readings
  
  // Tariff details (from Tariff_Plan table LEFT JOIN)
  tariff_name: String,              // May be NULL
  tariff_plan: String,              // Plan name
  rate_per_unit: Decimal,
  
  // Consumption (subquery from Meter_Reading)
  current_consumption: Number,      // Latest reading consumption
  last_reading_date: Date           // Date of last reading
}
```

### 2. Additional Data Fetched by Component

#### A. Meter Readings
**API Endpoint**: `GET /api/meter-readings/meter/:meterId`  
**API Function**: `meterReadingApi.getReadingsByMeterId(connection.meter_id)`  
**Condition**: Only if `connection.meter_id` exists  
**Limit**: Latest 5 readings

**Data Structure**:
```javascript
meterReadings = [
  {
    reading_id: Number,
    meter_id: Number,
    reading_date: Date,
    previous_reading: Number,
    current_reading: Number,
    consumption: Number,            // current - previous
    reader_name: String,            // Who recorded the reading
    notes: String
  },
  // ... up to 4 more
]
```

**Backend Source**: 
- Table: `Meter_Reading`
- Query joins: `Meter_Reading` → `User` (for reader_name)
- Ordered by: `reading_date DESC`

#### B. Billing History
**API Endpoint**: `GET /api/billing/customer/:customerId`  
**API Function**: `billingApi.getBillsByCustomer(connection.customer_id)`  
**Post-processing**: Filters bills for this specific `connection_id`, takes latest 3

**Data Structure**:
```javascript
billingHistory = [
  {
    bill_id: Number,
    bill_number: String,            // e.g., "BILL-2024-001"
    connection_id: Number,
    customer_id: Number,
    bill_status: String,            // "Paid", "Unpaid", "Partially Paid"
    total_amount: Decimal,
    due_date: Date,
    payment_date: Date,             // NULL if unpaid
    billing_period_start: Date,
    billing_period_end: Date
  },
  // ... up to 2 more
]
```

**Backend Source**:
- Table: `Billing`
- Query joins: `Billing` → `Payment` (for payment info)
- Ordered by: `billing_period_end DESC`

---

## Display Sections

### Section 1: Header
**Data Displayed**:
- Utility icon (based on `utility_name`)
- Utility name (`connection.utility_name`)
- Meter number or connection number (primary identifier)
- Status badge (`connection.connection_status`)

**Styling**: Blue background bar with utility badge, title, and status

### Section 2: Connection Information
**Layout**: 2-column grid

**Fields Displayed**:
1. Customer → `connection.customer_name`
2. Connection Number → `connection.connection_number`
3. Tariff Plan → `connection.tariff_plan`
4. Installation Date → `connection.connection_date` (formatted)
5. Property Address → `connection.property_address` (full width with MapPin icon)
6. Notes → `connection.notes` (full width, only if exists)

### Section 3: Current Status (Conditional)
**Condition**: Only shown if `connection.connection_status === 'Active'` AND `connection.current_consumption` exists

**Card Display**:
- Activity icon
- Label: "Current Consumption"
- Value: `{current_consumption} {unit}` (unit varies by utility type)
- Last reading date: `connection.last_reading_date`

**Unit Labels**:
- Electricity: "kWh"
- Water: "Cubic Meters"
- Gas: "Cubic Meters"
- Sewage: "Cubic Meters"
- Street Lighting: "kWh"

### Section 4: Recent Meter Readings
**Layout**: Scrollable list in left column

**States**:
- Loading: "Loading meter readings..."
- Empty: "No meter readings found"
- Data: List of reading cards

**Each Reading Card Shows**:
- Reading date (formatted)
- Consumption amount with unit
- Previous reading → Current reading (arrow between)
- Reader name (if available): "Read by {reader_name}"

**Data Source**: `meterReadings` state (fetched from API)

### Section 5: Billing History
**Layout**: Scrollable list in right column

**States**:
- Loading: "Loading billing history..."
- Empty: "No billing history found"
- Data: List of bill cards

**Each Bill Card Shows**:
- Bill number/ID
- Status badge (colored by status)
- Total amount: "Rs {amount}" (formatted to 2 decimals)
- Footer: Either "Paid: {date}" or "Due: {date}"

**Data Source**: `billingHistory` state (fetched from API)

### Section 6: Footer Actions
**Buttons**:
1. Close (secondary) → `onClose()`
2. Edit Connection (primary) → `onEdit(connection)`

---

## API Dependencies

### Required API Files:
1. **`meterReadingApi.js`** - Already exists
   - Function: `getReadingsByMeterId(meterId)`
   - Endpoint: GET `/api/meter-readings/meter/:meterId`

2. **`billingApi.js`** - Already exists
   - Function: `getBillsByCustomer(customerId)`
   - Endpoint: GET `/api/billing/customer/:customerId`

### Backend Controllers:
1. **`meterReadingController.js`**
   - Method: `getReadingsByMeterId()`
   - Joins: Meter_Reading → User (for reader_name)

2. **`billingController.js`**
   - Method: `getBillsByCustomer()`
   - Returns all bills for a customer (filtered client-side by connection_id)

---

## Helper Functions

### 1. `getUtilityIcon(utilityType)`
Returns appropriate icon component for utility type:
- Electricity → Zap
- Water → Droplet
- Gas → Flame
- Sewage → Wind
- Street Lighting → Lightbulb

### 2. `getStatusVariant(status)`
Maps status to Badge color variant:
- Active → 'success' (green)
- Disconnected → 'danger' (red)
- Suspended → 'warning' (orange)
- Pending → 'info' (blue)
- Paid → 'success'
- Unpaid → 'danger'
- Partially Paid → 'warning'

### 3. `getUnitLabel(utilityType)`
Returns measurement unit for utility type:
- Electricity → "kWh"
- Water/Gas/Sewage → "Cubic Meters"
- Street Lighting → "kWh"

---

## Loading States

### Initial Load:
- Component loads with `loading: true`
- Calls `fetchConnectionData()` on mount
- Shows loading messages in meter readings and billing sections

### Data Flow:
1. Check if `connection.meter_id` exists → fetch meter readings
2. Check if `connection.customer_id` exists → fetch billing history
3. Set `loading: false` when both complete (or fail)

### Error Handling:
- Meter readings fetch error: Set empty array, log error
- Billing history fetch error: Set empty array, log error
- Both errors are caught individually (non-blocking)

---

## Conversion Plan Notes

### CSS Classes to Update:
- `modal-overlay` → `sidepanel-overlay`
- `modal-content` → `sidepanel-container`
- `connection-details-modal` → Remove (use sidepanel styling)
- `modal-header` → `sidepanel-header`
- `modal-body` → `sidepanel-body`
- `modal-footer` → `sidepanel-footer`
- `modal-title` → `sidepanel-title`
- `modal-close` → `sidepanel-close`

### Layout Considerations:
- **Width**: Needs wider panel than CustomerForm due to dual-column layout in body
  - Suggested: 800px (vs 600px for CustomerForm, 700px for ConnectionForm)
- **Two-column section**: Meter readings and billing history side-by-side
  - May need to stack vertically on smaller screens

### Unique Animation Name:
- Use `connectionDetailsSidePanelSlideIn` to avoid conflicts

### Data Integrity:
- All required data already passed via props ✅
- API calls handled in useEffect ✅
- No changes needed to data fetching logic ✅

---

## Component Props

```javascript
ConnectionDetails.propTypes = {
  connection: Object,      // Full connection object from table
  onClose: Function,       // Close modal/panel
  onEdit: Function        // Open edit form with connection data
}
```

**Usage in Parent**:
```jsx
{showDetails && (
  <ConnectionDetails
    connection={selectedConnection}
    onClose={() => setShowDetails(false)}
    onEdit={() => {
      setShowDetails(false);
      handleEditConnection(selectedConnection);
    }}
  />
)}
```

---

## Summary

**Total Data Fields Displayed**: ~20+  
**External API Calls**: 2 (meter readings, billing history)  
**Conditional Sections**: 2 (current consumption, notes)  
**Interactive Elements**: 2 buttons (Close, Edit)  

**Complexity Level**: Medium-High
- More complex than CustomerForm (view-only with external data)
- Similar to a detailed dashboard panel
- Requires careful handling of loading states and empty data

**Ready for Conversion**: ✅ All data sources documented and understood
