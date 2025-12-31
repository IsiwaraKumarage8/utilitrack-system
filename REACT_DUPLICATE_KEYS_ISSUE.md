# React Filtering Issue - Duplicate Keys Causing Stale Data

## Issue Summary
**Date Discovered**: December 31, 2025  
**Component**: `frontend/src/pages/Connections/Connections.jsx`  
**Severity**: High - User-facing bug affecting core filtering functionality

## Problem Description

### Symptoms
1. When clicking filter buttons (e.g., "Water"), the table would show **incorrect data**
2. Electricity connections would appear when filtering for Water
3. Disconnected connections would appear when filtering for Active status
4. **Workaround**: Clicking two filters in sequence (e.g., "Active" then "Water") would work correctly
5. The filter logic was executing correctly, but the displayed rows were wrong

### User Experience Impact
- Users could not trust the filtered results
- Required multiple clicks to get correct data
- Confusion about data accuracy
- Poor user experience with core functionality

## Root Cause

### Technical Analysis

**The filtering logic was working correctly**, but React was displaying stale/wrong data due to **duplicate keys in the table rows**.

#### Database Issue
The `Service_Connection` table contained duplicate `connection_id` values:
```
connection_id: 18 appeared multiple times
connection_id: 16 appeared multiple times
```

#### React Behavior with Duplicate Keys
```jsx
{paginatedConnections.map(connection => (
  <tr key={connection.connection_id}>  // ❌ Duplicate keys!
```

**What happened:**
1. React uses keys to track which elements changed, were added, or removed
2. When keys are duplicated, React assumes rows with the same key are the **same component instance**
3. React **reuses the existing DOM element** instead of creating a new one
4. This causes React to display old data in the "reused" row, even though the underlying data changed

**Console Warning:**
```
Encountered two children with the same key, `18`. 
Keys should be unique so that components maintain their identity across updates.
```

## Diagnosis Process

### Step 1: Filter Logic Verification
Added debug logging to verify filter was working:
```javascript
console.log('Filter:', utilityFilter, 'Connection utility:', connection.utility_name, 'Matches:', matchesUtility);
```

**Result**: ✅ Filter logic was correct - Electricity showed `Matches: false`, Water showed `Matches: true`

### Step 2: State Verification
Added logging to check state values:
```javascript
console.log('utilityFilter state:', utilityFilter);
console.log('Filtered connections:', filteredConnections.length);
```

**Result**: ✅ State was updating correctly - 27 total, 7 after filtering for Water

### Step 3: React Warning Analysis
Noticed React warnings in console:
```
Encountered two children with the same key, `18`
```

**Result**: 🎯 **Found the root cause** - Duplicate keys causing DOM reuse

## Solution Implemented

### Code Changes

**Before (Broken):**
```jsx
{paginatedConnections.map(connection => (
  <tr key={connection.connection_id}>
```

**After (Fixed):**
```jsx
{paginatedConnections.map((connection, index) => (
  <tr key={`${connection.connection_id}-${connection.connection_number}-${index}`}>
```

### Why This Works
- **Compound key**: Combines multiple fields to guarantee uniqueness
- `connection_id`: Database ID (may have duplicates)
- `connection_number`: Unique connection identifier
- `index`: Array position (ensures uniqueness even if above fields match)
- Forces React to treat each row as a distinct component
- React properly updates the DOM when data changes

## Prevention Strategies

### 1. Database Integrity
**Recommended Fix**: Add IDENTITY property to `connection_id` column
```sql
ALTER TABLE Service_Connection
ALTER COLUMN connection_id INT NOT NULL IDENTITY(1,1);
```

This ensures `connection_id` values are truly unique and auto-incrementing.

### 2. Code Review Checklist
When using `.map()` in React:
- ✅ Always use unique keys
- ✅ Never use array index alone as key (unless list is static and never reordered)
- ✅ Use compound keys if single field is not guaranteed unique
- ✅ Watch for React warnings in console during development

### 3. Key Selection Priority
1. **Best**: Unique database ID (if guaranteed unique)
2. **Good**: Natural unique identifier (e.g., `connection_number`)
3. **Acceptable**: Compound key (multiple fields + index)
4. **Never**: Array index alone for dynamic lists

### 4. Testing Filters
Always test filtering with:
- Single filter active
- Multiple filters combined
- Different filter sequences
- Edge cases (empty results, all results)

## Related Issues

### Similar Pattern in Other Components
Check these components for similar issues:
- `Customers.jsx` - Uses `customer.customer_id` as key ✅ (verified unique)
- `Meters.jsx` - Uses `meter.meter_id` as key (verify uniqueness)
- `Payments.jsx` - Uses `payment.payment_id` as key (verify uniqueness)
- `Complaints.jsx` - Uses `complaint.complaint_id` as key (verify uniqueness)

### General React Key Best Practices
```jsx
// ❌ BAD - Index as key for dynamic list
{items.map((item, index) => <div key={index}>{item}</div>)}

// ❌ BAD - Non-unique field
{items.map(item => <div key={item.status}>{item}</div>)}

// ✅ GOOD - Unique ID
{items.map(item => <div key={item.id}>{item}</div>)}

// ✅ GOOD - Compound key when needed
{items.map((item, idx) => <div key={`${item.id}-${item.code}-${idx}`}>{item}</div>)}
```

## Lessons Learned

1. **Filter logic correctness ≠ Display correctness**: A filter can work perfectly but still display wrong data due to React rendering issues

2. **React warnings are critical**: Don't ignore console warnings - they often point to real bugs

3. **Database integrity matters**: Duplicate IDs in the database cascade into frontend bugs

4. **Debugging approach**: Use console logs at multiple layers (state, filter logic, render) to isolate the issue

5. **Key uniqueness is non-negotiable**: React's reconciliation algorithm depends entirely on unique keys

## References

- [React Documentation: Lists and Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
- [Why Keys Matter in React](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)
- [Common Pitfalls with Keys](https://react.dev/learn/rendering-lists#rules-of-keys)

## Status
✅ **RESOLVED** - December 31, 2025  
**Solution**: Implemented compound key for table rows  
**Verification**: Filtering now works correctly on first click for all filter combinations
