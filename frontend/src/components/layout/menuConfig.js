import { 
  LayoutDashboard, 
  Users, 
  Plug, 
  Gauge, 
  Activity, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  BarChart, 
  Settings
} from 'lucide-react';

/**
 * Sidebar Navigation Menu Configuration
 * Each item specifies which user roles are allowed to see it
 * 
 * User Roles: 'Admin', 'Field Officer', 'Cashier', 'Manager', 'Billing Clerk'
 * 
 * Based on RBAC matrix:
 * - Admin: All 10 items
 * - Field Officer: 6 items (Dashboard, Customers, Connections, Meters, Readings, Complaints)
 * - Cashier: 5 items (Dashboard, Customers, Billing, Payments, Complaints)
 * - Manager: 9 items (All except Settings)
 * - Billing Clerk: 8 items (All except Reports and Settings)
 */
export const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
    colorClass: 'blue',
    allowedRoles: [], // Empty means all roles can access
  },
  {
    icon: Users,
    label: 'Customers',
    path: '/customers',
    colorClass: 'purple',
    allowedRoles: ['Admin', 'Manager', 'Billing Clerk', 'Cashier', 'Field Officer'],
  },
  {
    icon: Plug,
    label: 'Service Connections',
    path: '/connections',
    colorClass: 'green',
    allowedRoles: ['Admin', 'Manager', 'Field Officer', 'Billing Clerk'],
  },
  {
    icon: Gauge,
    label: 'Meters',
    path: '/meters',
    colorClass: 'orange',
    allowedRoles: ['Admin', 'Manager', 'Field Officer', 'Billing Clerk'],
  },
  {
    icon: Activity,
    label: 'Meter Readings',
    path: '/readings',
    colorClass: 'teal',
    allowedRoles: ['Admin', 'Manager', 'Field Officer', 'Billing Clerk'],
  },
  {
    icon: FileText,
    label: 'Billing',
    path: '/billing',
    colorClass: 'indigo',
    allowedRoles: ['Admin', 'Manager', 'Billing Clerk', 'Cashier'],
  },
  {
    icon: CreditCard,
    label: 'Payments',
    path: '/payments',
    colorClass: 'emerald',
    allowedRoles: ['Admin', 'Manager', 'Cashier', 'Billing Clerk'],
  },
  {
    icon: AlertCircle,
    label: 'Complaints',
    path: '/complaints',
    colorClass: 'red',
    allowedRoles: ['Admin', 'Manager', 'Field Officer', 'Cashier', 'Billing Clerk'],
  },
  {
    icon: BarChart,
    label: 'Reports',
    path: '/reports',
    colorClass: 'violet',
    allowedRoles: ['Admin', 'Manager'],
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    colorClass: 'slate',
    allowedRoles: ['Admin'],
  },
];

