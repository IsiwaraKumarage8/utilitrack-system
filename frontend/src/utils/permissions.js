/**
 * Role-Based Access Control (RBAC) Permission Utilities
 * 
 * This file contains helper functions to check user permissions
 * based on their role in the system.
 */

// Define all user roles
export const ROLES = {
  ADMIN: 'Admin',
  FIELD_OFFICER: 'Field Officer',
  CASHIER: 'Cashier',
  MANAGER: 'Manager',
  BILLING_CLERK: 'Billing Clerk'
};

// Define permissions for each module
export const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD: {
    VIEW_FULL: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_LIMITED: [ROLES.FIELD_OFFICER, ROLES.CASHIER, ROLES.BILLING_CLERK]
  },

  // Customer permissions
  CUSTOMERS: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BILLING_CLERK, ROLES.CASHIER, ROLES.FIELD_OFFICER],
    ADD: [ROLES.ADMIN],
    EDIT: [ROLES.ADMIN],
    DELETE: [ROLES.ADMIN]
  },

  // Service Connections permissions
  CONNECTIONS: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],
    ADD: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    EDIT: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    DELETE: [ROLES.ADMIN],
    DISCONNECT: [ROLES.ADMIN]
  },

  // Meters permissions
  METERS: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER, ROLES.BILLING_CLERK],
    ADD: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    EDIT: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    DELETE: [ROLES.ADMIN],
    REGISTER: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    MAINTENANCE: [ROLES.ADMIN, ROLES.FIELD_OFFICER]
  },

  // Meter Readings permissions
  READINGS: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER, ROLES.BILLING_CLERK],
    RECORD: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    EDIT: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    DELETE: [ROLES.ADMIN]
  },

  // Billing permissions
  BILLING: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BILLING_CLERK, ROLES.CASHIER],
    GENERATE: [ROLES.ADMIN, ROLES.BILLING_CLERK],
    EDIT: [ROLES.ADMIN, ROLES.BILLING_CLERK],
    DELETE: [ROLES.ADMIN],
    CANCEL: [ROLES.ADMIN],
    SEND_EMAIL: [ROLES.ADMIN, ROLES.BILLING_CLERK],
    DOWNLOAD_PDF: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BILLING_CLERK, ROLES.CASHIER]
  },

  // Payments permissions
  PAYMENTS: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER, ROLES.BILLING_CLERK],
    RECORD: [ROLES.ADMIN, ROLES.CASHIER],
    REFUND: [ROLES.ADMIN],
    PRINT_RECEIPT: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER]
  },

  // Complaints permissions
  COMPLAINTS: {
    VIEW_ALL: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_ASSIGNED: [ROLES.FIELD_OFFICER, ROLES.BILLING_CLERK],
    LOG: [ROLES.ADMIN, ROLES.FIELD_OFFICER, ROLES.CASHIER, ROLES.BILLING_CLERK],
    ASSIGN: [ROLES.ADMIN, ROLES.MANAGER],
    RESOLVE: [ROLES.ADMIN, ROLES.FIELD_OFFICER],
    CLOSE: [ROLES.ADMIN]
  },

  // Reports permissions
  REPORTS: {
    VIEW: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_BILLING: [ROLES.BILLING_CLERK],
    EXPORT: [ROLES.ADMIN, ROLES.MANAGER]
  },

  // Settings permissions
  SETTINGS: {
    VIEW: [ROLES.ADMIN],
    EDIT: [ROLES.ADMIN],
    USER_MANAGEMENT: [ROLES.ADMIN],
    TARIFF_MANAGEMENT: [ROLES.ADMIN],
    SYSTEM_CONFIG: [ROLES.ADMIN]
  }
};

/**
 * Check if user has permission for a specific action
 * @param {string} userRole - Current user's role
 * @param {Array<string>} allowedRoles - Array of roles allowed to perform this action
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userRole, allowedRoles) => {
  if (!userRole || !allowedRoles) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Check if user can view a specific page/module
 * @param {string} userRole - Current user's role
 * @param {string} module - Module name (e.g., 'CUSTOMERS', 'BILLING')
 * @returns {boolean}
 */
export const canView = (userRole, module) => {
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  
  // Check if user has any VIEW permission for this module
  return (
    hasPermission(userRole, modulePermissions.VIEW || []) ||
    hasPermission(userRole, modulePermissions.VIEW_ALL || []) ||
    hasPermission(userRole, modulePermissions.VIEW_LIMITED || []) ||
    hasPermission(userRole, modulePermissions.VIEW_ASSIGNED || [])
  );
};

/**
 * Check if user can add/create in a specific module
 * @param {string} userRole - Current user's role
 * @param {string} module - Module name
 * @returns {boolean}
 */
export const canAdd = (userRole, module) => {
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  return hasPermission(userRole, modulePermissions.ADD || []);
};

/**
 * Check if user can edit in a specific module
 * @param {string} userRole - Current user's role
 * @param {string} module - Module name
 * @returns {boolean}
 */
export const canEdit = (userRole, module) => {
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  return hasPermission(userRole, modulePermissions.EDIT || []);
};

/**
 * Check if user can delete in a specific module
 * @param {string} userRole - Current user's role
 * @param {string} module - Module name
 * @returns {boolean}
 */
export const canDelete = (userRole, module) => {
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  return hasPermission(userRole, modulePermissions.DELETE || []);
};

/**
 * Check if user is Admin
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

/**
 * Check if user is Manager
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export const isManager = (userRole) => {
  return userRole === ROLES.MANAGER;
};

/**
 * Check if user is Field Officer
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export const isFieldOfficer = (userRole) => {
  return userRole === ROLES.FIELD_OFFICER;
};

/**
 * Check if user is Cashier
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export const isCashier = (userRole) => {
  return userRole === ROLES.CASHIER;
};

/**
 * Check if user is Billing Clerk
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export const isBillingClerk = (userRole) => {
  return userRole === ROLES.BILLING_CLERK;
};

/**
 * Get user's accessible menu items based on role
 * @param {string} userRole - Current user's role
 * @returns {Array<string>} - Array of accessible page paths
 */
export const getAccessiblePages = (userRole) => {
  const pages = {
    [ROLES.ADMIN]: [
      '/dashboard', '/customers', '/connections', '/meters', 
      '/readings', '/billing', '/payments', '/complaints', 
      '/reports', '/settings'
    ],
    [ROLES.FIELD_OFFICER]: [
      '/dashboard', '/customers', '/connections', '/meters', 
      '/readings', '/complaints'
    ],
    [ROLES.CASHIER]: [
      '/dashboard', '/customers', '/billing', '/payments', '/complaints'
    ],
    [ROLES.MANAGER]: [
      '/dashboard', '/customers', '/connections', '/meters', 
      '/readings', '/billing', '/payments', '/complaints', '/reports'
    ],
    [ROLES.BILLING_CLERK]: [
      '/dashboard', '/customers', '/connections', '/meters', 
      '/readings', '/billing', '/payments', '/complaints'
    ]
  };

  return pages[userRole] || ['/dashboard'];
};

/**
 * Check if user can access a specific route
 * @param {string} userRole - Current user's role
 * @param {string} path - Route path to check
 * @returns {boolean}
 */
export const canAccessRoute = (userRole, path) => {
  const accessiblePages = getAccessiblePages(userRole);
  return accessiblePages.includes(path);
};
