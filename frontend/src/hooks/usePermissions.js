/**
 * Custom React Hook for Permission Checking
 * 
 * This hook provides easy access to permission checking functions
 * throughout your React components.
 */

import { useAuth } from '../contexts/AuthContext';
import * as permissions from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.user_role;

  return {
    // User role info
    userRole,
    user,
    
    // Role checks
    isAdmin: permissions.isAdmin(userRole),
    isManager: permissions.isManager(userRole),
    isFieldOfficer: permissions.isFieldOfficer(userRole),
    isCashier: permissions.isCashier(userRole),
    isBillingClerk: permissions.isBillingClerk(userRole),
    
    // Permission check functions
    hasPermission: (allowedRoles) => permissions.hasPermission(userRole, allowedRoles),
    canView: (module) => permissions.canView(userRole, module),
    canAdd: (module) => permissions.canAdd(userRole, module),
    canEdit: (module) => permissions.canEdit(userRole, module),
    canDelete: (module) => permissions.canDelete(userRole, module),
    canAccessRoute: (path) => permissions.canAccessRoute(userRole, path),
    
    // Specific permissions (shortcuts)
    can: {
      // Customers
      viewCustomers: permissions.canView(userRole, 'CUSTOMERS'),
      addCustomer: permissions.canAdd(userRole, 'CUSTOMERS'),
      editCustomer: permissions.canEdit(userRole, 'CUSTOMERS'),
      deleteCustomer: permissions.canDelete(userRole, 'CUSTOMERS'),
      
      // Connections
      viewConnections: permissions.canView(userRole, 'CONNECTIONS'),
      addConnection: permissions.canAdd(userRole, 'CONNECTIONS'),
      editConnection: permissions.canEdit(userRole, 'CONNECTIONS'),
      deleteConnection: permissions.canDelete(userRole, 'CONNECTIONS'),
      
      // Meters
      viewMeters: permissions.canView(userRole, 'METERS'),
      addMeter: permissions.canAdd(userRole, 'METERS'),
      editMeter: permissions.canEdit(userRole, 'METERS'),
      deleteMeter: permissions.canDelete(userRole, 'METERS'),
      
      // Readings
      viewReadings: permissions.canView(userRole, 'READINGS'),
      recordReading: permissions.hasPermission(userRole, permissions.PERMISSIONS.READINGS.RECORD),
      editReading: permissions.canEdit(userRole, 'READINGS'),
      deleteReading: permissions.canDelete(userRole, 'READINGS'),
      
      // Billing
      viewBilling: permissions.canView(userRole, 'BILLING'),
      generateBill: permissions.hasPermission(userRole, permissions.PERMISSIONS.BILLING.GENERATE),
      editBill: permissions.canEdit(userRole, 'BILLING'),
      deleteBill: permissions.canDelete(userRole, 'BILLING'),
      
      // Payments
      viewPayments: permissions.canView(userRole, 'PAYMENTS'),
      recordPayment: permissions.hasPermission(userRole, permissions.PERMISSIONS.PAYMENTS.RECORD),
      refundPayment: permissions.hasPermission(userRole, permissions.PERMISSIONS.PAYMENTS.REFUND),
      
      // Complaints
      viewAllComplaints: permissions.hasPermission(userRole, permissions.PERMISSIONS.COMPLAINTS.VIEW_ALL),
      viewAssignedComplaints: permissions.hasPermission(userRole, permissions.PERMISSIONS.COMPLAINTS.VIEW_ASSIGNED),
      logComplaint: permissions.hasPermission(userRole, permissions.PERMISSIONS.COMPLAINTS.LOG),
      assignComplaint: permissions.hasPermission(userRole, permissions.PERMISSIONS.COMPLAINTS.ASSIGN),
      resolveComplaint: permissions.hasPermission(userRole, permissions.PERMISSIONS.COMPLAINTS.RESOLVE),
      closeComplaint: permissions.hasPermission(userRole, permissions.PERMISSIONS.COMPLAINTS.CLOSE),
      
      // Reports
      viewReports: permissions.canView(userRole, 'REPORTS'),
      exportReports: permissions.hasPermission(userRole, permissions.PERMISSIONS.REPORTS.EXPORT),
      
      // Settings
      viewSettings: permissions.canView(userRole, 'SETTINGS'),
      editSettings: permissions.canEdit(userRole, 'SETTINGS'),
      manageUsers: permissions.hasPermission(userRole, permissions.PERMISSIONS.SETTINGS.USER_MANAGEMENT),
    }
  };
};

export default usePermissions;
