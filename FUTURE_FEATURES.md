# Future Features & Enhancements

This document lists features that have been implemented in the backend but are **not currently integrated** into the core system workflow. These are available for future use when business requirements expand.

---

## 📊 Implemented Features for Future Use

### 1. Late Fee Calculation System

**Status**: ✅ Fully implemented, ready to use  
**Database Function**: `fn_CalculateLateFee`  
**Backend Endpoints**: 
- `GET /api/billing/:id/late-fee`
- `GET /api/billing/:id/with-late-fee`

**Description**:
Automatically calculates late fees for overdue bills based on days past due date.

**Current Implementation**:
- **Calculation Method**: Fixed fee of Rs. 100 per month overdue
- **Formula**: `CEILING(days_overdue / 30) × 100`
- **Conditions**: Only applies when `days_overdue > 0` AND `outstanding_balance > 0`

**Alternative Calculation Methods** (available in UDF comments):
1. **Percentage-based**: 2% of outstanding balance per month
2. **Tiered approach**: Rs. 100 (1-30 days), Rs. 250 (31-60 days), Rs. 500 (60+ days)

**Usage Examples**:
```bash
# Get late fee amount only
GET /api/billing/123/late-fee
Response: {
  "bill_id": 123,
  "late_fee": 200.00,
  "calculated_date": "2025-12-14"
}

# Get complete bill with late fee
GET /api/billing/123/with-late-fee
Response: {
  "bill_id": 123,
  "total_amount": 1500.00,
  "outstanding_balance": 1500.00,
  "late_fee": 200.00,
  "total_due_with_late_fee": 1700.00,
  "days_overdue": 45,
  ...
}
```

**To Activate**:
1. Update payment processing to include late fees
2. Display late fees in frontend billing pages
3. Add late fees to bill generation process
4. Update receipt/invoice templates to show late fees

**Database Location**: `ums_db.sql` lines 654-696

---

### 2. Customer Balance Tracking

**Status**: ✅ Fully implemented, ready to use  
**Database Function**: `fn_GetCustomerBalance`  
**Backend Endpoints**: 
- `GET /api/customers/:id/balance`
- `GET /api/customers/:id/with-balance`

**Description**:
Provides quick lookup of customer's total outstanding balance across all their service connections and bills.

**Current Implementation**:
- **Calculation**: Sums all `outstanding_balance` from Billing table for customer
- **Scope**: Includes all service connections (electricity, water, gas, etc.)
- **Filters**: Only bills with `outstanding_balance > 0`

**Usage Examples**:
```bash
# Get balance only
GET /api/customers/456/balance
Response: {
  "customer_id": 456,
  "total_outstanding_balance": 3250.00
}

# Get customer with full balance details
GET /api/customers/456/with-balance
Response: {
  "customer_id": 456,
  "first_name": "John",
  "last_name": "Doe",
  "total_outstanding_balance": 3250.00,
  "connection_count": 2,
  "unpaid_bills_count": 3,
  ...
}
```

**To Activate**:
1. Add balance display to customer detail pages
2. Show balance summary on customer dashboard
3. Use in customer search/filter (e.g., "customers with balance > Rs. 5000")
4. Include in customer statements/reports

**Database Location**: `ums_db.sql` lines 700-718

---

## 🔧 Additional Utility Functions Available

### 3. Average Consumption Validation

**Database Function**: `fn_GetAvgConsumption(@meter_id, @months)`  
**Status**: ⚠️ Created but not implemented in backend  
**Database Location**: `ums_db.sql` lines 722-745

**Purpose**:
- Calculate average consumption for a meter over specified months
- Useful for detecting unusual consumption patterns
- Can flag readings that exceed 150% of average

**Potential Use Cases**:
- Meter reading validation
- Fraud detection
- Meter malfunction alerts
- Customer consumption analysis

**To Implement**:
1. Add method to `meterReadingModel.js`
2. Create validation endpoint
3. Add frontend alerts for unusual readings
4. Integrate into meter reading submission workflow

---

## 📋 Integration Checklist

When activating any of these features:

- [ ] Update frontend components to display new data
- [ ] Add user interface controls/buttons
- [ ] Update API documentation
- [ ] Add validation/error handling
- [ ] Create user notifications
- [ ] Update reports to include new metrics
- [ ] Train staff on new functionality
- [ ] Update user manual/help documentation

---

## 🎯 Recommended Priority for Activation

1. **High Priority**: Customer Balance Tracking
   - Most useful for customer service
   - Easy to integrate into existing UI
   - Provides immediate value

2. **Medium Priority**: Late Fee Calculation
   - Requires business policy decisions
   - Needs billing process updates
   - May require legal/regulatory compliance

3. **Low Priority**: Average Consumption Validation
   - Nice-to-have for anomaly detection
   - Can be added incrementally
   - Requires configuration and threshold setting

---

## 📝 Notes

- All features are fully tested and working in the backend
- Database functions are optimized and use proper indexing
- No database schema changes required to activate
- Frontend integration is the main remaining task
- All features maintain backward compatibility

---

**Last Updated**: December 14, 2025  
**Maintained By**: Development Team
