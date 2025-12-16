# Meter Readings - API Integration TODO

## Current Status

The Meter Readings page is **fully functional** but currently operates **without live API integration** for historical data and associated bills in the ReadingDetails modal.

### What Works Now
✅ Table displays all meter readings (from MOCK_READINGS data)
✅ Search, filters, and pagination work correctly
✅ Horizontal scrolling with sticky actions column
✅ Modal shows reading details with proper dark theme styling
✅ Modal displays all data from the current reading (reading type, consumption, comparison, etc.)
✅ All action buttons functional (View, Edit, Generate Bill)
✅ Edit Reading button opens RecordReadingModal
✅ Generate Bill button opens GenerateBillModal

### What's Missing
❌ Historical readings data (shows empty state)
❌ Associated bills data (shows empty state)

---

## Why API Integration Was Removed

The API integration for historical readings and associated bills was causing **white screen crashes** because:

1. **Backend Not Running** - API calls to `http://localhost:5000` fail if backend server isn't active
2. **Missing Endpoints** - Some endpoints may not exist or return different data formats
3. **Component Crashes** - React components crash when API responses don't match expected structure
4. **Import Errors** - Import issues with `billingApi` (default export vs named export)

**Decision:** Remove API calls to ensure stable, working UI. Add them back once backend is confirmed working.

---

## Prerequisites for API Integration

Before adding API integration back, ensure:

### 1. Backend Server Running
```bash
cd d:\utilitrack-system\backend
node server.js
```
- Verify server runs on `http://localhost:5000`
- Check for any startup errors

### 2. Required API Endpoints Exist

**Historical Readings Endpoint:**
- **Endpoint:** `GET /api/meter-readings/meter/:meterId/history?limit=5`
- **Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "reading_id": 1,
      "reading_date": "2024-11-13",
      "current_reading": 1450.00,
      "consumption": 120.00,
      "reading_type": "Actual"
    }
  ]
}
```

**Associated Bills Endpoint:**
- **Endpoint:** `GET /api/billing/customer/:customerId`
- **Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "bill_id": 1,
      "bill_number": "BILL-001",
      "meter_id": 1,
      "billing_date": "2024-12-01",
      "total_amount": 1250.00,
      "payment_status": "Paid"
    }
  ]
}
```

### 3. Test API Endpoints Manually

Use Postman or browser to test:
```
http://localhost:5000/api/meter-readings/meter/1/history?limit=5
http://localhost:5000/api/billing/customer/1
```

Verify responses match expected format.

---

## Implementation Steps

### Step 1: Verify meterReadingApi.js
**File:** `frontend/src/api/meterReadingApi.js`

Check if `getHistoricalReadings()` method exists:
```javascript
export const meterReadingApi = {
  getHistoricalReadings: async (meterId, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_URL}/meter-readings/meter/${meterId}/history?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching historical readings:', error);
      throw error;
    }
  }
};
```

### Step 2: Verify billingApi.js Export
**File:** `frontend/src/api/billingApi.js`

Ensure it's exported correctly (default export):
```javascript
const billingApi = {
  getBillsByCustomer: async (customerId) => {
    // ... implementation
  }
};

export default billingApi;  // Must be default export
```

### Step 3: Update ReadingDetails.jsx
**File:** `frontend/src/pages/Readings/ReadingDetails.jsx`

Add the imports:
```javascript
import { useState, useEffect } from 'react';
import { meterReadingApi } from '../../api/meterReadingApi';
import billingApi from '../../api/billingApi';  // Default import
```

Add the state and effect:
```javascript
const ReadingDetails = ({ reading, onClose, onEdit }) => {
  const [historicalReadings, setHistoricalReadings] = useState([]);
  const [associatedBills, setAssociatedBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reading?.reading_id) {
      fetchReadingData();
    }
  }, [reading?.reading_id]);  // Use reading_id as dependency

  const fetchReadingData = async () => {
    setLoading(true);
    
    // Fetch historical readings
    try {
      const historyResponse = await meterReadingApi.getHistoricalReadings(
        reading.meter_id, 
        5
      );
      if (historyResponse?.success && Array.isArray(historyResponse?.data)) {
        setHistoricalReadings(historyResponse.data);
      } else {
        setHistoricalReadings([]);
      }
    } catch (err) {
      console.warn('Could not fetch historical readings:', err);
      setHistoricalReadings([]);
    }

    // Fetch associated bills
    try {
      const billsResponse = await billingApi.getBillsByCustomer(
        reading.customer_id
      );
      if (billsResponse?.success && Array.isArray(billsResponse?.data)) {
        const relatedBills = billsResponse.data.filter(
          bill => bill.meter_id === reading.meter_id
        );
        setAssociatedBills(relatedBills.slice(0, 3));
      } else {
        setAssociatedBills([]);
      }
    } catch (err) {
      console.warn('Could not fetch associated bills:', err);
      setAssociatedBills([]);
    }

    setLoading(false);
  };
  
  // ... rest of component
};
```

---

## Testing Checklist

After implementing API integration:

- [ ] Backend server is running without errors
- [ ] Test historical readings endpoint in browser/Postman
- [ ] Test billing endpoint in browser/Postman
- [ ] Clear browser cache and refresh
- [ ] Open Meter Readings page - table should load
- [ ] Click eye icon on any reading - modal should open (not white screen)
- [ ] Check browser console for errors
- [ ] Verify historical readings section shows data OR shows "No historical readings"
- [ ] Verify associated bills section shows data OR shows "No bills generated"
- [ ] Test edit and generate bill buttons still work

---

## Debugging Tips

If white screen appears:

1. **Check browser console (F12)** for exact error message
2. **Check backend terminal** for API request logs
3. **Verify response format** matches expected structure
4. **Add console.logs** in fetchReadingData to see what data is returned
5. **Check network tab** to see if API calls are being made
6. **Verify imports** - billingApi should be default import, not `{ billingApi }`

Common Issues:
- `billingApi is not a function` → Wrong import (should be default import)
- `Cannot read property 'data' of undefined` → API response format mismatch
- Infinite loop → useEffect dependency array issue (use `reading?.reading_id`)

---

## Notes

- The modal **already displays all current reading data** from the reading prop
- Historical readings and bills are **supplementary features**
- The page is **fully functional** without these API calls
- Only add API integration when backend is stable and tested
- Always use try-catch blocks to prevent crashes
- Always validate response structure before setting state

---

## Related Files

- `frontend/src/pages/Readings/ReadingDetails.jsx` - Modal component
- `frontend/src/api/meterReadingApi.js` - Meter reading API methods
- `frontend/src/api/billingApi.js` - Billing API methods
- `backend/routes/meterRoutes.js` - Backend meter endpoints
- `backend/routes/billingRoutes.js` - Backend billing endpoints
