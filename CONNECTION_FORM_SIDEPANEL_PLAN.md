# Connection Form Side Panel Conversion Plan

## Overview
Convert ConnectionForm from a centered modal dialog to a side panel that slides in from the right, matching the implementation done for CustomerForm.

## Current Structure
- **File**: `frontend/src/pages/Connections/ConnectionForm.jsx`
- **CSS File**: `frontend/src/pages/Connections/ConnectionForm.css`
- **Current Implementation**: Modal dialog using `modal-overlay`, `modal-container`, `modal-header`, `modal-body`, `modal-footer`
- **Special Features**: 
  - Multi-step form (4 steps with step indicator)
  - Customer selection dropdown
  - Dynamic tariff options based on utility type
  - Form validation

## Target Design (Based on CustomerForm)
- Side panel slides in from the right
- Overlay with backdrop blur
- Fixed header with title and close button
- Scrollable body content
- Fixed footer with action buttons
- Smooth slide-in animation
- Responsive design

## Implementation Phases

### Phase 1: Update JSX Class Names ✅ READY
**Objective**: Replace all modal-specific class names with sidepanel equivalents

**Changes Required in ConnectionForm.jsx**:
- `modal-overlay` → `sidepanel-overlay`
- `modal-container` → `sidepanel-container` (remove `connection-form-modal` class)
- `modal-header` → `sidepanel-header`
- `modal-body` → `sidepanel-body`
- `modal-footer` → `sidepanel-footer`

**Note**: Keep all form-specific classes like `step-indicator`, `form-row`, `form-group`, etc.

### Phase 2: Rewrite CSS ✅ READY
**Objective**: Create new side panel styling matching CustomerForm implementation

**File**: `frontend/src/pages/Connections/ConnectionForm.css`

**New CSS Structure**:
```css
/* 1. Overlay */
.sidepanel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

/* 2. Container */
.sidepanel-container {
  background: #1F2937;
  width: 700px; /* Wider than CustomerForm due to multi-step form */
  max-width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  animation: connectionSidePanelSlideIn 0.3s ease-out;
}

/* 3. Animation (unique name to avoid conflicts) */
@keyframes connectionSidePanelSlideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 4. Header - Fixed */
.sidepanel-header {
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
  flex-shrink: 0;
}

/* 5. Body - Scrollable */
.sidepanel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  min-height: 0;
}

/* 6. Footer - Fixed */
.sidepanel-footer {
  padding: 1.5rem;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-shrink: 0;
  background: #1F2937;
}
```

**Preserve Existing Styles**:
- `.step-indicator` and related step styles
- `.form-row`, `.form-group`, `.form-label`, `.form-input`, etc.
- `.validation-message`
- All utility-specific styling

**Responsive Design**:
```css
@media (max-width: 768px) {
  .sidepanel-container {
    width: 85vw;
  }
}

@media (max-width: 480px) {
  .sidepanel-container {
    width: 100vw;
  }
}
```

### Phase 3: Add Input Placeholders ✅ READY
**Objective**: Add helpful placeholder text to all form inputs

**Placeholders to Add**:
- Step 1 (Customer Selection):
  - `customer_id`: "Select a customer"
  
- Step 2 (Utility & Connection):
  - `utility_type`: "Select utility type"
  - `connection_number`: "e.g., CONN-2024-001"
  - `connection_date`: "YYYY-MM-DD"
  - `property_address`: "Enter property address"
  
- Step 3 (Meter Details):
  - `meter_number`: "e.g., MTR-12345"
  - `meter_type`: "Select meter type"
  - `initial_reading`: "Enter initial reading"
  
- Step 4 (Tariff & Status):
  - `tariff_plan`: "Select tariff plan"
  - `connection_status`: "Select status"
  - `notes`: "Add any additional notes (optional)"

### Phase 4: Fix Styling Issues ⏳ PENDING
**Objective**: Address any visual issues discovered during testing

**Potential Issues to Check**:
- [ ] Form labels visibility (may need `color: #F9FAFB !important`)
- [ ] Step indicator positioning in side panel
- [ ] Scrolling behavior with multi-step form
- [ ] Button spacing and alignment
- [ ] Navigation buttons (Previous/Next) visibility
- [ ] Responsive behavior on smaller screens

### Phase 5: Testing ⏳ PENDING
**Test Cases**:
- [ ] Side panel slides in smoothly
- [ ] All 4 steps navigate correctly
- [ ] Customer dropdown loads and selects properly
- [ ] Tariff options update based on utility type
- [ ] Form validation works on all steps
- [ ] Submit button only active on final step
- [ ] Close button and overlay click work
- [ ] Scrolling works for long content
- [ ] Responsive design on tablet/mobile
- [ ] Edit mode populates form correctly

### Phase 6: Documentation ⏳ PENDING
**Update Files**:
- Mark all phases complete in this plan
- Add notes about any deviations from CustomerForm pattern

## Design Decisions

### Width: 700px vs 600px
ConnectionForm uses 700px (vs CustomerForm's 600px) because:
- Multi-step indicator needs more horizontal space
- Form has more complex fields (utility types, tariffs)
- Step navigation buttons need room

### Animation Name
Use `connectionSidePanelSlideIn` (not `sidePanelSlideIn`) to avoid any potential conflicts with other components.

### Step Indicator
Keep the step indicator inside the body section (not in header) to maintain the visual flow of the form.

## Reference Implementation
See `frontend/src/pages/Customers/CustomerForm.jsx` and `CustomerForm.css` for the complete side panel pattern.

---
**Created**: 2025-12-31
**Status**: Planning Complete - Ready for Implementation
