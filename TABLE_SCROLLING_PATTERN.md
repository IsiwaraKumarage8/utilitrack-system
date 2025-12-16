# Table Horizontal Scrolling & Sticky Actions Column Pattern

This document explains the CSS and HTML pattern used for implementing horizontal scrolling tables with sticky action columns in the UtiliTrack System.

## Overview

This pattern allows tables to:
- Scroll horizontally when content width exceeds viewport
- Keep the Actions column visible and sticky on the right side
- Maintain pagination outside the scrollable area
- Provide smooth scrolling with custom scrollbar styling

## Implementation Pattern

### 1. HTML/JSX Structure

```jsx
<div className="page-name-page">
  {/* Filters and other content */}
  
  {/* Table Container - This is the scrollable wrapper */}
  <div className="table-container">
    <table className="page-name-table">
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          {/* ... more columns ... */}
          <th>Actions</th> {/* Last column will be sticky */}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
          {/* ... more data ... */}
          <td>
            {/* Action buttons */}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  {/* Pagination - Outside table-container so it doesn't scroll */}
  <div className="pagination">
    {/* Pagination controls */}
  </div>
</div>
```

### 2. CSS Pattern

#### Page Wrapper
```css
.page-name-page {
  padding: 24px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
```

#### Table Container (Scrollable Area)
```css
.page-name-page .table-container {
  background-color: #ffffff;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;                    /* Enable horizontal scrolling */
  -webkit-overflow-scrolling: touch;   /* Smooth scrolling on iOS */
  width: 100%;
  max-width: 100%;
  position: relative;
  display: block;                      /* Important for overflow to work */
  margin-bottom: 0;                    /* No gap before pagination */
}
```

#### Custom Scrollbar Styling
```css
.page-name-page .table-container::-webkit-scrollbar {
  height: 12px;
}

.page-name-page .table-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 0 0 12px 12px;
}

.page-name-page .table-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.page-name-page .table-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
```

#### Table Base Styles
```css
.page-name-page .data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

/* Set minimum width based on number of columns */
.page-name-page .data-table {
  min-width: 1400px;    /* Adjust based on your table's needs */
  width: max-content;   /* Table expands to fit content */
}
```

#### Sticky Actions Column
```css
/* Apply to both header and data cells in last column */
.page-name-page .data-table th:last-child,
.page-name-page .data-table td:last-child {
  position: sticky;
  right: 0;
  background-color: #f9fafb;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

/* Ensure proper background on hover */
.page-name-page .data-table tbody tr:hover td:last-child {
  background-color: #f9fafb;
}

/* Ensure white background for data cells */
.page-name-page .data-table td:last-child {
  background-color: #ffffff;
}

/* Maintain background on hover */
.page-name-page .data-table tbody tr:hover td:last-child {
  background-color: #f9fafb;
}
```

## Key Principles

### 1. CSS Scoping
Always scope your styles with the page-specific class to avoid conflicts:
```css
/* ✓ CORRECT */
.connections-page .table-container { }

/* ✗ WRONG - May conflict with other pages */
.table-container { }
```

### 2. Minimum Width
Set `min-width` on the table to ensure all content displays in single lines:
- 8-10 columns: `min-width: 1200px`
- 10-12 columns: `min-width: 1400px`
- 12+ columns: `min-width: 1600px`

### 3. Display Block
The table container MUST have `display: block` for `overflow-x: auto` to work properly.

### 4. Z-Index Hierarchy
- Sticky column: `z-index: 1`
- Regular cells: default (0)

Keep it simple - no need for higher z-index values.

### 5. White-Space
Ensure cells don't wrap text:
```css
.page-name-page .data-table th,
.page-name-page .data-table td {
  white-space: nowrap;
}
```

### 6. Pagination Placement
Always place pagination OUTSIDE the `.table-container` div so it remains fixed while the table scrolls.

## Working Examples

### Service Connections Table
- **File**: `frontend/src/pages/Connections/Connections.css`
- **Min Width**: 1400px (10 columns)
- **Pattern**: Reference implementation

### Meters Table
- **File**: `frontend/src/pages/Meters/Meters.css`
- **Min Width**: 1400px (9 columns)
- **Pattern**: Follows Service Connections pattern

### Customer Management Table
- **File**: `frontend/src/pages/Customers/Customers.css`
- **Min Width**: 1200px (8 columns)
- **Pattern**: Similar implementation

## Common Issues & Solutions

### Issue: Scrolling Not Working
**Cause**: Missing `display: block` on container  
**Solution**: Add `display: block` to `.table-container`

### Issue: Actions Column Not Sticky
**Cause**: Missing `position: sticky` or incorrect z-index  
**Solution**: Ensure `position: sticky`, `right: 0`, and `z-index: 1`

### Issue: Background Shows Through on Sticky Column
**Cause**: Missing background-color on sticky cells  
**Solution**: Set explicit `background-color` on `th:last-child` and `td:last-child`

### Issue: Pagination Scrolls With Table
**Cause**: Pagination inside `.table-container`  
**Solution**: Move pagination div outside the table container

### Issue: Column Overlap
**Cause**: Insufficient table min-width or missing white-space  
**Solution**: Increase `min-width` and add `white-space: nowrap` to cells

## Quick Implementation Checklist

- [ ] Page wrapper has `overflow-x: hidden`
- [ ] Table container has `overflow-x: auto` and `display: block`
- [ ] Table has appropriate `min-width` and `width: max-content`
- [ ] All selectors scoped with page-specific class
- [ ] Sticky column uses `position: sticky`, `right: 0`, `z-index: 1`
- [ ] Sticky column has explicit `background-color`
- [ ] Cells have `white-space: nowrap`
- [ ] Pagination is outside `.table-container`
- [ ] Custom scrollbar styles applied

## Browser Compatibility

This pattern works in:
- ✓ Chrome/Edge (Chromium) 56+
- ✓ Firefox 59+
- ✓ Safari 13+
- ✓ All modern browsers with CSS sticky support

**Note**: For older browsers, the sticky column will scroll with the table but horizontal scrolling will still work.
