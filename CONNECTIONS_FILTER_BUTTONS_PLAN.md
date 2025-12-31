# Connections Page - Filter Buttons Functionality Plan

## Overview
Add click functionality to the filter buttons for Utility Type and Status filters on the Connections page.

## Current State
- ✅ Filter buttons UI is complete with color coding
- ✅ State variables exist: `utilityFilter` and `statusFilter`
- ✅ Filter logic in `useMemo` is working correctly
- ✅ Visual active states are showing based on current filter values
- ❌ Buttons have no onClick handlers - they don't do anything when clicked

## Implementation Plan

### Phase 1: Add Click Handlers to Utility Filter Buttons ⏳ READY

**Objective**: Make utility type filter buttons functional

**Changes in Connections.jsx**:

1. **"All" button** - Reset utility filter
   ```jsx
   onClick={() => setUtilityFilter('All')}
   ```

2. **"Electricity" button**
   ```jsx
   onClick={() => setUtilityFilter('Electricity')}
   ```

3. **"Water" button**
   ```jsx
   onClick={() => setUtilityFilter('Water')}
   ```

4. **"Gas" button**
   ```jsx
   onClick={() => setUtilityFilter('Gas')}
   ```

5. **"Sewage" button**
   ```jsx
   onClick={() => setUtilityFilter('Sewage')}
   ```

6. **"Street Lighting" button**
   ```jsx
   onClick={() => setUtilityFilter('Street Lighting')}
   ```

### Phase 2: Add Click Handlers to Status Filter Buttons ⏳ READY

**Objective**: Make status filter buttons functional

**Changes in Connections.jsx**:

1. **"All" button** - Reset status filter
   ```jsx
   onClick={() => setStatusFilter('All')}
   ```

2. **"Active" button**
   ```jsx
   onClick={() => setStatusFilter('Active')}
   ```

3. **"Disconnected" button**
   ```jsx
   onClick={() => setStatusFilter('Disconnected')}
   ```

4. **"Suspended" button**
   ```jsx
   onClick={() => setStatusFilter('Suspended')}
   ```

5. **"Pending" button**
   ```jsx
   onClick={() => setStatusFilter('Pending')}
   ```

### Phase 3: Testing ⏳ PENDING

**Test Cases**:
- [ ] Click "Electricity" - should show only electricity connections
- [ ] Click "Water" - should show only water connections
- [ ] Click "Active" - should show only active connections
- [ ] Click "Disconnected" - should show only disconnected connections
- [ ] Combine filters - e.g., "Water" + "Active" should show only active water connections
- [ ] Click "All" on utility - should reset utility filter
- [ ] Click "All" on status - should reset status filter
- [ ] Verify pagination resets to page 1 when filters change (already implemented via useEffect)
- [ ] Verify active button styling updates correctly
- [ ] Verify filtered count is correct

### Phase 4: Enhancements (Optional) ⏳ PENDING

**Possible improvements**:
- Show count badges on filter buttons (e.g., "Electricity (15)")
- Add keyboard shortcuts for filters
- Add "Clear all filters" button
- Persist filter selections to localStorage
- Add filter animation transitions

## Technical Notes

### Existing State Management
```javascript
const [utilityFilter, setUtilityFilter] = useState('All');
const [statusFilter, setStatusFilter] = useState('All');
```

### Existing Filter Logic
```javascript
const filteredConnections = useMemo(() => {
  return connections.filter(connection => {
    const matchesSearch = /* search logic */;
    const matchesUtility = utilityFilter === 'All' || connection.utility_name === utilityFilter;
    const matchesStatus = statusFilter === 'All' || connection.connection_status === statusFilter;
    return matchesSearch && matchesUtility && matchesStatus;
  });
}, [connections, searchQuery, utilityFilter, statusFilter]);
```

### Page Reset on Filter Change
```javascript
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, utilityFilter, statusFilter]);
```

## Implementation Strategy

Use `multi_replace_string_in_file` to add all onClick handlers in a single operation for efficiency. Each button needs:
- `onClick` attribute added
- Handler that calls the appropriate setter function
- Proper string matching for the replacement

## Expected Behavior

**Before**: Buttons show visual states but don't respond to clicks
**After**: 
- Clicking a button filters the table immediately
- Active state updates to show selected filter
- Table shows only matching rows
- Pagination resets to page 1
- Multiple filters work together (AND logic)

## Risks & Considerations

1. **Filter value matching**: Ensure button values exactly match database values
   - "Street Lighting" must match backend data
   - Status values must be case-sensitive matches

2. **Performance**: useMemo should prevent unnecessary re-filtering

3. **UX**: Visual feedback is already in place via active states

---

**Status**: Ready to implement Phase 1 & 2
**Next Step**: Add onClick handlers to all filter buttons
