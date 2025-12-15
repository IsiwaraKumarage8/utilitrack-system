# Remove Placeholder Data - Implementation Plan

**Objective:** Replace all mock/placeholder data with real API calls to ensure all components fetch data from the database through backend APIs.

**Status:** 🔴 Not Started  
**Last Updated:** December 16, 2025

---

## 📋 Implementation Checklist

### Phase 1: Create Missing API Modules (if needed)
- [ ] **1.1** Check if `meterApi.js` exists in `frontend/src/api/`
- [ ] **1.2** Check if `meterReadingApi.js` exists in `frontend/src/api/`
- [ ] **1.3** Check if `complaintApi.js` exists in `frontend/src/api/`
- [ ] **1.4** Check if `paymentApi.js` exists in `frontend/src/api/`
- [ ] **1.5** Create any missing API modules

### Phase 2: Backend API Verification
- [ ] **2.1** Verify `/api/meters` endpoints exist in backend
- [ ] **2.2** Verify `/api/meter-readings` endpoints exist in backend
- [ ] **2.3** Verify `/api/complaints` endpoints exist in backend
- [ ] **2.4** Verify `/api/payments` endpoints exist in backend
- [ ] **2.5** Create any missing backend routes/controllers/models

### Phase 3: Fix Complaints Page
- [ ] **3.1** Create/verify `complaintApi.js` with required methods
- [ ] **3.2** Update `Complaints.jsx` to fetch data from API
- [ ] **3.3** Remove `MOCK_COMPLAINTS` array
- [ ] **3.4** Implement proper error handling
- [ ] **3.5** Test complaints page functionality

### Phase 4: Fix Meters Page
- [ ] **4.1** Create/verify `meterApi.js` with required methods
- [ ] **4.2** Update `Meters.jsx` to fetch data from API
- [ ] **4.3** Remove `MOCK_METERS` array
- [ ] **4.4** Update `MeterDetails.jsx` to fetch reading & maintenance history
- [ ] **4.5** Remove mock data from `MeterDetails.jsx`
- [ ] **4.6** Update `MeterForm.jsx` to fetch connections from API
- [ ] **4.7** Remove `MOCK_CONNECTIONS` array
- [ ] **4.8** Test meters page functionality

### Phase 5: Fix Readings Page
- [ ] **5.1** Create/verify `meterReadingApi.js` with required methods
- [ ] **5.2** Update `Readings.jsx` to fetch data from API
- [ ] **5.3** Remove `MOCK_READINGS` array
- [ ] **5.4** Update `ReadingDetails.jsx` to fetch historical readings
- [ ] **5.5** Remove `getHistoricalReadings()` mock function
- [ ] **5.6** Update `RecordReadingForm.jsx` to fetch previous reading
- [ ] **5.7** Remove mock previous reading logic
- [ ] **5.8** Test readings page functionality

### Phase 6: Fix Payments Page
- [ ] **6.1** Create/verify `paymentApi.js` with required methods
- [ ] **6.2** Update `Payments.jsx` to fetch data from API
- [ ] **6.3** Remove `MOCK_PAYMENTS` array
- [ ] **6.4** Implement proper error handling
- [ ] **6.5** Test payments page functionality

### Phase 7: Fix Connection Form
- [ ] **7.1** Update `ConnectionForm.jsx` to fetch customers from API
- [ ] **7.2** Remove `MOCK_CUSTOMERS` array
- [ ] **7.3** Test connection form functionality

### Phase 8: Testing & Validation
- [ ] **8.1** Test all pages load data correctly
- [ ] **8.2** Verify error handling works for each page
- [ ] **8.3** Test CRUD operations (Create, Read, Update, Delete)
- [ ] **8.4** Verify pagination, filtering, and search work correctly
- [ ] **8.5** Test with empty data states
- [ ] **8.6** Verify loading states display properly
- [ ] **8.7** Check console for any errors or warnings

### Phase 9: Code Cleanup
- [ ] **9.1** Remove all TODO comments related to mock data
- [ ] **9.2** Remove unused mock data imports
- [ ] **9.3** Verify no hardcoded data remains
- [ ] **9.4** Update documentation if needed

---

## 📁 Files to Modify

### Frontend Components
1. `frontend/src/pages/Complaints/Complaints.jsx`
2. `frontend/src/pages/Meters/Meters.jsx`
3. `frontend/src/pages/Meters/MeterDetails.jsx`
4. `frontend/src/pages/Meters/MeterForm.jsx`
5. `frontend/src/pages/Meters/RecordReadingForm.jsx`
6. `frontend/src/pages/Readings/Readings.jsx`
7. `frontend/src/pages/Readings/ReadingDetails.jsx`
8. `frontend/src/pages/Payments/Payments.jsx`
9. `frontend/src/pages/Connections/ConnectionForm.jsx`

### API Modules to Create/Update
1. `frontend/src/api/meterApi.js`
2. `frontend/src/api/meterReadingApi.js`
3. `frontend/src/api/complaintApi.js`
4. `frontend/src/api/paymentApi.js`

### Backend (if needed)
1. Backend routes for meters, readings, complaints, payments
2. Backend controllers for each resource
3. Backend models for database queries

---

## 🎯 Success Criteria
- ✅ No component uses mock/placeholder data
- ✅ All data is fetched from database through backend APIs
- ✅ Proper error handling in place
- ✅ Loading states implemented
- ✅ All CRUD operations work correctly
- ✅ No console errors or warnings

---

## 📝 Notes
- Maintain consistent error handling patterns
- Preserve existing UI/UX behavior
- Ensure backward compatibility
- Test each phase before moving to the next
- Keep fallback data only for error states (like dashboard components)
