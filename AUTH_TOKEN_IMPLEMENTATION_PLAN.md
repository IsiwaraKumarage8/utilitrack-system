# Authentication & Token Management Implementation Plan

**Date Created:** December 31, 2025  
**Purpose:** Implement secure token validation, expiry checking, and proper logout functionality  
**Token Lifetime:** 24 hours (for security)

---

## SOLUTION 2: Token Validation/Expiry Checking (24 hours)

### 2.1 Create Token Expiry Utility
- [x] Create utility function to calculate token expiry timestamp
- [x] Function should add 24 hours (86400000ms) to current timestamp
- [x] Location: `frontend/src/utils/tokenUtils.js` (new file)

### 2.2 Update Login Flow to Store Expiry
- [x] Modify `login()` function in AuthContext.jsx
- [x] Store `tokenExpiry` in localStorage when user logs in
- [x] Use the utility function to calculate expiry timestamp
- [x] Verify expiry is stored correctly

### 2.3 Add Client-Side Expiry Check on App Load
- [x] Update `useEffect` in AuthContext.jsx
- [x] Check if stored token exists in localStorage
- [x] Check if `tokenExpiry` exists in localStorage
- [x] Compare current time with stored expiry
- [x] If expired, clear localStorage and don't auto-login
- [x] If not expired, proceed to backend validation

### 2.4 Add Utility to Check Token Expiry
- [x] Create `isTokenExpired()` function in tokenUtils.js
- [x] Function should compare Date.now() with stored expiry
- [x] Return boolean: true if expired, false if still valid

### 2.5 Test Token Expiry
- [x] Verify token expiry is calculated correctly on login
- [x] Verify expired tokens prevent auto-login
- [x] Verify valid tokens allow auto-login (pending backend validation)

### 2.6 Document Solution 2
- [x] Document all changes made for Solution 2
- [x] List files created and modified
- [x] Describe the implementation approach
- [x] Note any important details or considerations

**Status:** ✅ COMPLETED

---

## SOLUTION 2 DOCUMENTATION

### Overview
Implemented 24-hour token expiration checking on the client side. The system now calculates and stores token expiry timestamps, validates them on app load, and automatically logs out users with expired tokens.

### Files Created
1. **`frontend/src/utils/tokenUtils.js`** (New File)
   - Created utility functions for token expiry management
   - Functions included:
     - `calculateTokenExpiry()` - Returns timestamp 24 hours from now
     - `isTokenExpired(timestamp)` - Checks if token has expired
     - `getStoredToken()` - Retrieves token from localStorage
     - `getStoredTokenExpiry()` - Retrieves expiry from localStorage
     - `clearAuthStorage()` - Clears all auth data (user, token, tokenExpiry)
     - `getTimeUntilExpiry(timestamp)` - Calculates remaining time
   - Token lifetime constant: `TOKEN_LIFETIME_MS = 86400000` (24 hours)

### Files Modified
1. **`frontend/src/contexts/AuthContext.jsx`**
   - **Import added**: Imported `calculateTokenExpiry`, `isTokenExpired`, and `clearAuthStorage` from tokenUtils
   - **`useEffect` hook updated** (app initialization):
     - Now retrieves `tokenExpiry` from localStorage in addition to user and token
     - Performs client-side expiry check using `isTokenExpired()`
     - If expired: clears storage with `clearAuthStorage()`, sets loading to false, returns (no auto-login)
     - If valid: proceeds with session restoration as before
     - Added console log for debugging expired tokens
   - **`login()` function updated**:
     - Calculates token expiry using `calculateTokenExpiry()`
     - Stores expiry timestamp in localStorage as string: `localStorage.setItem('tokenExpiry', tokenExpiry.toString())`
     - All three items now stored: user, token, tokenExpiry
   - **`logout()` function updated**:
     - Replaced manual localStorage.removeItem calls with `clearAuthStorage()` utility
     - Ensures consistent cleanup of all auth-related data

### Implementation Approach
1. **Centralized utilities**: Created reusable token management functions in a dedicated utility file
2. **Client-side first check**: Fast token expiry validation before any network calls
3. **Graceful handling**: Expired tokens silently clear storage and show login page
4. **Consistent cleanup**: All logout paths use the same `clearAuthStorage()` function

### Important Details & Considerations
- **Token lifetime**: Set to 24 hours (86400000ms) for increased security per requirements
- **Backend JWT still 7 days**: Backend JWT configuration remains at 7 days, but client enforces 24h limit
- **Timestamp format**: Stored as string in localStorage, parsed to integer when checking
- **No network calls yet**: This is pure client-side validation; backend validation comes in Solution 4
- **Backward compatible**: If tokenExpiry is missing, system treats as expired (fail-safe)
- **Console logging**: Added log message when token expires for debugging purposes

### Testing Performed
- ✅ Login stores tokenExpiry in localStorage
- ✅ Expired token prevents auto-login on page refresh
- ✅ Valid token allows auto-login (pending backend validation in Solution 4)
- ✅ Logout clears all three localStorage items (user, token, tokenExpiry)

### Next Steps
Solution 3 will add backend logout endpoint and integrate it with the frontend logout flow.

---

## SOLUTION 3: Proper Logout Mechanism with Backend Call

### 3.1 Create Backend Logout Endpoint
- [x] Add POST `/api/auth/logout` route in authRoutes.js
- [x] Make route protected (require authentication)
- [x] Create logout controller function in authController.js
- [x] Log the logout action (optional: invalidate token if using token blacklist)
- [x] Return success response

### 3.2 Create Frontend Logout API Function
- [x] Create `logout()` function in `frontend/src/api/authApi.js`
- [x] Function should make POST request to `/api/auth/logout`
- [x] Include token in Authorization header
- [x] Handle response

### 3.3 Update Logout Function in AuthContext
- [x] Call backend logout API before clearing localStorage
- [x] Handle API call errors gracefully (still logout client-side even if backend fails)
- [x] Clear ALL localStorage items: user, token, tokenExpiry
- [x] Reset all auth state: user, token, isAuthenticated
- [x] Ensure proper error handling

### 3.4 Test Logout Functionality
- [x] Verify backend logout endpoint is called
- [x] Verify all localStorage items are cleared
- [x] Verify user is redirected to login page
- [x] Verify state is properly reset

### 3.5 Document Solution 3
- [x] Document all changes made for Solution 3
- [x] List files created and modified
- [x] Describe the backend and frontend integration
- [x] Note any important details or considerations

**Status:** ✅ COMPLETED

---

## SOLUTION 3 DOCUMENTATION

### Overview
Implemented proper logout mechanism with backend endpoint integration. The system now calls the backend to log the logout action before clearing client-side data, with graceful error handling to ensure logout always succeeds on the client even if the backend is unavailable.

### Files Created
None (utilized existing files)

### Files Modified

1. **`backend/controllers/authController.js`**
   - **Added `logout()` controller function**:
     - Protected endpoint (requires authentication via middleware)
     - Extracts userId and username from authenticated request
     - Logs logout action to console with user details
     - Includes comment about production token blacklisting/invalidation
     - Returns success response even on errors to ensure client-side logout completes
     - Graceful error handling with try-catch that always returns 200 success

2. **`backend/routes/authRoutes.js`**
   - **Added POST `/api/auth/logout` route**:
     - Protected with `authenticate` middleware
     - Maps to `authController.logout` function
     - Includes JSDoc route documentation
     - Added after change-password route

3. **`frontend/src/api/authApi.js`**
   - **Updated `logout()` function**:
     - Changed from synchronous to async function
     - Makes POST request to `/api/auth/logout` endpoint
     - Token automatically included via axios interceptor
     - Implements try-catch for error handling
     - Returns success even if backend call fails (ensures client logout happens)
     - Logs error to console if backend fails
   - **Updated response interceptor**:
     - Now clears `tokenExpiry` in addition to user and token on 401 errors
     - Ensures complete auth cleanup on unauthorized responses

4. **`frontend/src/contexts/AuthContext.jsx`**
   - **Added import**: `import * as authApi from '../api/authApi'`
   - **Updated `logout()` function**:
     - Changed to async function
     - Calls `authApi.logout()` to notify backend
     - Wrapped in try-catch-finally for robust error handling
     - Backend call failure logged but doesn't prevent logout
     - Finally block ensures client-side cleanup always happens
     - Clears state (user, token, isAuthenticated) and localStorage via `clearAuthStorage()`

### Implementation Approach
1. **Backend-first logging**: Server logs all logout actions for audit trail
2. **Graceful degradation**: Client always logs out even if backend fails
3. **Try-catch-finally pattern**: Ensures cleanup happens in all scenarios
4. **Consistent cleanup**: Uses shared `clearAuthStorage()` utility
5. **Security-first**: Backend endpoint is protected and requires valid token

### Important Details & Considerations
- **No token blacklist yet**: Current JWT implementation doesn't maintain a blacklist; tokens remain valid until expiry
- **Production enhancement**: Added comment about token invalidation for future production implementation
- **Always succeeds**: Logout always completes on client side regardless of backend status
- **Network resilience**: Works offline or when backend is down
- **Audit logging**: Backend logs who logged out and when
- **Error visibility**: Errors logged to console for debugging but hidden from user
- **Authorization header**: Token automatically included via axios interceptor

### Testing Performed
- ✅ Backend logout endpoint receives authenticated requests
- ✅ Logout action logged on server with user details
- ✅ All localStorage items cleared (user, token, tokenExpiry)
- ✅ Auth state properly reset (user, token, isAuthenticated all null/false)
- ✅ Logout succeeds even when backend is unreachable
- ✅ 401 errors from any API call now clear tokenExpiry

### Next Steps
Solution 4 will implement backend token validation on app load to verify tokens before auto-login.

---

## SOLUTION 4: Validate Token with Backend

### 4.1 Create Frontend Token Verification API Function
- [ ] Create `verifyToken()` function in `frontend/src/api/authApi.js`
- [ ] Function should make GET request to `/api/auth/verify`
- [ ] Include token in Authorization header
- [ ] Return user data if successful
- [ ] Handle 401/403 errors (invalid token)

### 4.2 Integrate Backend Validation in AuthContext
- [ ] After client-side expiry check passes, call backend verification
- [ ] Make API call to `/api/auth/verify` endpoint
- [ ] If verification succeeds, set user and isAuthenticated
- [ ] If verification fails (401/403), clear localStorage and stay on login
- [ ] Handle network errors gracefully

### 4.3 Add Error Handling for Token Validation
- [ ] Handle 401 Unauthorized (invalid/expired token)
- [ ] Handle 403 Forbidden (user status changed)
- [ ] Handle network errors (offline, server down)
- [ ] In all error cases, clear localStorage and require re-login

### 4.5 Document Solution 4
- [ ] Document all changes made for Solution 4
- [ ] List files created and modified
- [ ] Describe the backend validation flow
- [ ] Note error handling and edge cases

### 4.4 Test Backend Token Validation
- [ ] Test with valid token (should succeed)
- [ ] Test with expired token (should fail and clear storage)
- [ ] Test with invalid token (should fail and clear storage)
- [ ] Test with no backend available (should handle gracefully)

**Status:** ⏳ Not Started

---

## SOLUTION 5: Token Expiration Timestamps

### 5.1 Update localStorage Structure
- [ ] Ensure tokenExpiry is stored as timestamp (number)
- [ ] Ensure format is milliseconds since epoch (Date.now() compatible)
- [ ] Document the localStorage structure

### 5.2 Add Token Expiry Display (Optional)
- [ ] Consider showing token expiry in Settings or user menu
- [ ] Show remaining time until logout
- [ ] (This is optional - can skip if not needed)

### 5.3 Cleanup and Final Integration
- [ ] Remove any old/unused localStorage keys
- [ ] Ensure all auth flows use new expiry system
- [ ] Verify logout clears tokenExpiry
- [ ] Verify login sets tokenExpiry correctly

### 5.5 Document Solution 5
- [ ] Document all changes made for Solution 5
- [ ] List any final integration updates
- [ ] Provide final testing results
- [ ] Create comprehensive summary of entire implementation

### 5.4 Final Testing
- [ ] Test complete flow: login → store expiry → reload → auto-login
- [ ] Test expiry: login → wait/manipulate expiry → reload → forced login
- [ ] Test logout: login → logout → verify all cleared
- [ ] Test backend validation: login → reload → backend verifies

**Status:** ⏳ Not Started

---

## Progress Tracking

- **Solution 2 (Token Expiry - 24h):** ✅ COMPLETED
- **Solution 3 (Logout with Backend):** ✅ COMPLETED
- **Solution 4 (Backend Validation):** ⏳ Not Started
- **Solution 5 (Expiry Timestamps):** ⏳ Not Started

---

## Notes

- Token lifetime: **24 hours** (86400000 milliseconds)
- Backend JWT already configured for 7 days, but client-side enforces 24h
- Backend verification endpoint exists: `GET /api/auth/verify`
- No "Remember Me" feature needed
- No token refresh mechanism needed
- This is a coursework project

---

## Files to Modify/Create

### New Files
- [ ] `frontend/src/utils/tokenUtils.js`
- [ ] `frontend/src/api/authApi.js` (or check if exists and update)

### Modified Files
- [ ] `frontend/src/contexts/AuthContext.jsx`
- [ ] `backend/routes/authRoutes.js`
- [ ] `backend/controllers/authController.js`

---

## Current Implementation Status

**WAITING FOR APPROVAL TO START SOLUTION 2**
