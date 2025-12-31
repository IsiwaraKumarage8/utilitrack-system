/**
 * Token Utility Functions
 * Handles token expiry calculation and validation
 */

// Token lifetime: 24 hours in milliseconds
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000; // 86400000ms

/**
 * Calculate token expiry timestamp
 * @returns {number} Timestamp (ms since epoch) when token will expire
 */
export const calculateTokenExpiry = () => {
  return Date.now() + TOKEN_LIFETIME_MS;
};

/**
 * Check if token has expired
 * @param {number} expiryTimestamp - The expiry timestamp to check
 * @returns {boolean} True if token is expired, false if still valid
 */
export const isTokenExpired = (expiryTimestamp) => {
  if (!expiryTimestamp || typeof expiryTimestamp !== 'number') {
    return true; // If no expiry or invalid format, consider expired
  }
  return Date.now() >= expiryTimestamp;
};

/**
 * Get token from localStorage
 * @returns {string|null} Token string or null if not found
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get token expiry from localStorage
 * @returns {number|null} Expiry timestamp or null if not found
 */
export const getStoredTokenExpiry = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  return expiry ? parseInt(expiry, 10) : null;
};

/**
 * Clear all auth-related data from localStorage
 */
export const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
};

/**
 * Get remaining time until token expires
 * @param {number} expiryTimestamp - The expiry timestamp
 * @returns {number} Milliseconds until expiry (negative if already expired)
 */
export const getTimeUntilExpiry = (expiryTimestamp) => {
  if (!expiryTimestamp) return 0;
  return expiryTimestamp - Date.now();
};
