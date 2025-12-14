# Database Integration Fixes - To-Do List

**Status**: 🔴 In Progress  
**Last Updated**: December 14, 2025

---

## 🔴 HIGH PRIORITY - Critical Fixes (Must Fix for System to Work)

### 1. Fix sp_GenerateBill Stored Procedure ✅
- [x] **Issue**: Procedure doesn't accept `due_date` parameter but backend tries to pass it
- [x] **Location**: `ums_db.sql` line ~795 and `backend/models/billingModel.js` line ~314
- [x] **Fix Options**:
  - Option A: Add `@due_date` parameter to stored procedure ✅ (IMPLEMENTED)
  - Option B: Remove due_date from backend call
- [x] **Test**: Generate a bill via API and verify due_date is correctly set
- **Solution Applied**: Added optional `@due_date DATE = NULL` parameter to stored procedure with default of 30 days if not provided. Backend now passes the calculated due_date parameter.

### 2. Implement Complaint Controller ✅
- [x] **Issue**: `backend/controllers/complaintController.js` is empty
- [x] **Required Actions**:
  - [x] Create complaintModel.js with CRUD operations
  - [x] Implement controller methods (getAll, getById, create, update, delete)
  - [x] Add filtering by status, type, priority
  - [x] Add search functionality
  - [x] Create routes in `backend/routes/complaintRoutes.js`
- [x] **Test**: CRUD operations via API
- **Solution Applied**: 
  - Created `complaintModel.js` with full CRUD operations
  - Implemented filtering by status, type, priority
  - Added search by complaint number, customer name, description
  - Created dedicated endpoints for customer complaints and assigned complaints
  - Added statistics endpoint for complaint metrics
  - Implemented status updates and assignment functionality
  - Auto-generates complaint numbers (COMP-YYYY-NNNN format)
  - Routes registered in server.js

### 3. Implement Meter Controller & Reading Management ✅
- [x] **Issue**: `backend/controllers/meterController.js` is empty
- [x] **Required Actions**:
  - [x] Create meterModel.js with meter CRUD operations
  - [x] Create meterReadingModel.js for readings management
  - [x] Implement meterController methods
  - [x] Implement meterReadingController methods
  - [x] Create routes for both meters and readings
  - [x] Integrate with `sp_BulkMeterReadingEntry` stored procedure
- [x] **Test**: Create meter, submit readings, verify calculations
- **Solution Applied**:
  - Created `meterModel.js` with full CRUD operations for meters
  - Created `meterReadingModel.js` for meter reading management
  - Single unified `meterController.js` handles both meters and readings
  - Integrated `sp_BulkMeterReadingEntry` SP for reading creation
  - Auto-calculates consumption and validates readings
  - Filter by meter status, reading type, unprocessed readings
  - Search by meter number, customer name, connection number
  - Statistics endpoints for both meters and readings
  - Maintenance tracking with last_maintenance_date
  - Routes registered in server.js

### 4. Fix Multi-Meter Query Issue in Billing ✅
- [x] **Issue**: Queries assume one meter per connection, may return duplicates
- [x] **Location**: `backend/models/billingModel.js` line ~58
- [x] **Fix**: Add DISTINCT or handle multiple meters properly
- [x] **Test**: Create connection with 2+ meters, verify bill generation
- **Solution Applied**:
  - Fixed `findById` query: Now joins Meter through Meter_Reading (via reading_id)
  - Fixed `findByBillNumber` query: Now joins Meter through Meter_Reading
  - Each bill is linked to a specific reading, which is linked to a specific meter
  - This ensures one-to-one relationship and prevents duplicate rows
  - Added meter_type to output for better information
  - Connections with multiple meters will have separate bills per meter

---

## 🟡 MEDIUM PRIORITY - Important Features

### 5. Implement Report Controller
- [ ] **Issue**: reportController.js exists but may be incomplete
- [ ] **Required Actions**:
  - [ ] Verify current implementation status
  - [ ] Create reportModel.js if missing
  - [ ] Add endpoint for `sp_GetDefaulters` procedure
  - [ ] Add revenue reports using `v_MonthlyRevenue` view
  - [ ] Add unpaid bills report using `v_UnpaidBills` view
  - [ ] Add payment history using `v_CustomerPaymentHistory` view
- [ ] **Test**: Generate various reports via API

### 6. Implement sp_ProcessPayment in Payment Processing
- [ ] **Issue**: Backend doesn't use `sp_ProcessPayment` stored procedure
- [ ] **Location**: `backend/models/paymentModel.js`
- [ ] **Fix**: Refactor payment creation to use stored procedure
- [ ] **Benefit**: Ensures consistent payment processing logic
- [ ] **Test**: Create payment and verify bill updates correctly

### 7. Create Scheduled Job for Overdue Bills
- [ ] **Issue**: `sp_MarkOverdueBills` is never called
- [ ] **Required Actions**:
  - [ ] Install node-cron or similar scheduler
  - [ ] Create `backend/jobs/billingJobs.js`
  - [ ] Schedule daily execution of `sp_MarkOverdueBills`
  - [ ] Add logging for job execution
  - [ ] Initialize job in server.js
- [ ] **Test**: Verify bills past due_date get marked as 'Overdue'

### 8. Optimize Queries Using Database Views
- [ ] **Issue**: Backend uses complex joins instead of optimized views
- [ ] **Views Available**:
  - [ ] Replace unpaid bills query with `v_UnpaidBills`
  - [ ] Use `v_CustomerPaymentHistory` in payment queries
  - [ ] Use `v_MonthlyRevenue` for revenue statistics
  - [ ] Use `v_ActiveConnections` for connection listings
- [ ] **Benefit**: Better performance, cleaner code
- [ ] **Test**: Compare query performance before/after

### 9. Add Missing API Endpoints
- [ ] **Meters & Readings**:
  - [ ] POST `/api/meters` - Create meter
  - [ ] GET `/api/meters/:id` - Get meter details
  - [ ] POST `/api/meter-readings` - Submit reading
  - [ ] POST `/api/meter-readings/bulk` - Bulk entry using SP
  - [ ] GET `/api/meter-readings/unprocessed` - Get readings without bills
- [ ] **Complaints**:
  - [ ] POST `/api/complaints` - Create complaint
  - [ ] GET `/api/complaints` - List complaints
  - [ ] PATCH `/api/complaints/:id` - Update complaint status
  - [ ] GET `/api/complaints/customer/:id` - Customer complaints
- [ ] **Reports**:
  - [ ] GET `/api/reports/defaulters` - Defaulting customers
  - [ ] GET `/api/reports/revenue` - Revenue analysis
  - [ ] GET `/api/reports/consumption` - Consumption trends

---

## 🟢 LOW PRIORITY - Enhancements

### 10. Implement Late Fee Calculation
- [ ] **Issue**: `fn_CalculateLateFee` UDF exists but unused
- [ ] **Required Actions**:
  - [ ] Add late fee calculation to bill display
  - [ ] Create API endpoint: GET `/api/billing/:id/late-fee`
  - [ ] Display late fees in frontend billing pages
  - [ ] Add late fee to payment calculations
- [ ] **Benefit**: Automated late fee management

### 11. Add Customer Balance Endpoint
- [ ] **Issue**: `fn_GetCustomerBalance` UDF exists but unused
- [ ] **Required Actions**:
  - [ ] Create endpoint: GET `/api/customers/:id/balance`
  - [ ] Use function to quickly get total outstanding balance
  - [ ] Display on customer detail pages
- [ ] **Benefit**: Quick balance lookups without complex queries

### 12. Implement Average Consumption Validation
- [ ] **Issue**: `fn_GetAvgConsumption` UDF exists but unused
- [ ] **Required Actions**:
  - [ ] Use in meter reading validation
  - [ ] Flag readings that exceed 150% of average
  - [ ] Alert field officers about unusual readings
  - [ ] Add visual indicators in UI
- [ ] **Benefit**: Detect meter faults or unusual consumption

### 13. Review and Handle Database Triggers
- [ ] **Issue**: Auto-calculation triggers may conflict with manual updates
- [ ] **Triggers to Review**:
  - [ ] `trg_CalculateBillingAmounts` - Verify backend doesn't override
  - [ ] `trg_UpdateBillAfterPayment` - Ensure payment flow uses this
  - [ ] `trg_CalculateConsumption` - Verify reading flow doesn't conflict
- [ ] **Test**: Verify all auto-calculations work correctly

### 14. Add User/Staff Management
- [ ] **Issue**: [User] table exists but no backend implementation
- [ ] **Required Actions**:
  - [ ] Create userModel.js
  - [ ] Create userController.js
  - [ ] Implement authentication endpoints
  - [ ] Add role-based access control
  - [ ] Link payments to staff members (received_by)
  - [ ] Link complaints to assigned staff
- [ ] **Benefit**: Full user management system

---

## 📋 TESTING CHECKLIST (After Fixes)

- [ ] Test customer CRUD operations
- [ ] Test service connection creation
- [ ] Test meter installation and reading submission
- [ ] Test bill generation from readings
- [ ] Test payment processing and bill updates
- [ ] Test complaint creation and resolution workflow
- [ ] Test all report endpoints
- [ ] Test scheduled job for overdue bills
- [ ] Test data integrity across all modules
- [ ] Load test with multiple concurrent users

---

## 📊 PROGRESS TRACKING

- **Total Items**: 14 major tasks
- **Completed**: 4
- **In Progress**: 0
- **Not Started**: 10
- **Overall Progress**: 29%

---

## 🎯 RECOMMENDED ORDER OF IMPLEMENTATION

1. **Week 1**: Items #1, #2, #3 (Critical controllers and SP fix)
2. **Week 2**: Items #4, #6, #9 (Fix queries, implement procedures, add endpoints)
3. **Week 3**: Items #5, #7, #8 (Reports, scheduled jobs, optimization)
4. **Week 4**: Items #10-14 (Enhancements and UDF implementation)

---

## 📝 NOTES

- Keep this file updated as you complete each task
- Mark items with ✅ when fully tested and working
- Add any new issues discovered during implementation
- Document any deviations from the original plan

---

**Next Step**: Start with #1 - Fix sp_GenerateBill Stored Procedure
