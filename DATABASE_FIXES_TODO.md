# Database Integration Fixes - To-Do List

**Status**: 🔴 In Progress  
**Last Updated**: December 14, 2025

---

## 🔴 HIGH PRIORITY - Critical Fixes (Must Fix for System to Work)

### 1. Fix sp_GenerateBill Stored Procedure
- [ ] **Issue**: Procedure doesn't accept `due_date` parameter but backend tries to pass it
- [ ] **Location**: `ums_db.sql` line ~795 and `backend/models/billingModel.js` line ~314
- [ ] **Fix Options**:
  - Option A: Add `@due_date` parameter to stored procedure
  - Option B: Remove due_date from backend call
- [ ] **Test**: Generate a bill via API and verify due_date is correctly set

### 2. Implement Complaint Controller
- [ ] **Issue**: `backend/controllers/complaintController.js` is empty
- [ ] **Required Actions**:
  - [ ] Create complaintModel.js with CRUD operations
  - [ ] Implement controller methods (getAll, getById, create, update, delete)
  - [ ] Add filtering by status, type, priority
  - [ ] Add search functionality
  - [ ] Create routes in `backend/routes/complaintRoutes.js`
- [ ] **Test**: CRUD operations via API

### 3. Implement Meter Controller & Reading Management
- [ ] **Issue**: `backend/controllers/meterController.js` is empty
- [ ] **Required Actions**:
  - [ ] Create meterModel.js with meter CRUD operations
  - [ ] Create meterReadingModel.js for readings management
  - [ ] Implement meterController methods
  - [ ] Implement meterReadingController methods
  - [ ] Create routes for both meters and readings
  - [ ] Integrate with `sp_BulkMeterReadingEntry` stored procedure
- [ ] **Test**: Create meter, submit readings, verify calculations

### 4. Fix Multi-Meter Query Issue in Billing
- [ ] **Issue**: Queries assume one meter per connection, may return duplicates
- [ ] **Location**: `backend/models/billingModel.js` line ~58
- [ ] **Fix**: Add DISTINCT or handle multiple meters properly
- [ ] **Test**: Create connection with 2+ meters, verify bill generation

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
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 14
- **Overall Progress**: 0%

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
