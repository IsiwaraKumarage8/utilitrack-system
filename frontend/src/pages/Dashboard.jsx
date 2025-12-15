import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './Dashboard/dashboards/AdminDashboard';
import './Dashboard.css';

/**
 * Main Dashboard Router Component
 * Routes to appropriate dashboard based on user role
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // Loading state
  if (loading || !user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Get user role (handle both 'role' and 'user_role' fields)
  const userRole = user.role || user.user_role;

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case 'Admin':
        return <AdminDashboard user={user} />;
      
      // Placeholder for other roles - will be implemented later
      case 'Field Officer':
      case 'Cashier':
      case 'Manager':
      case 'Billing Clerk':
        return <AdminDashboard user={user} />; // Temporary: show admin dashboard for all roles
      
      default:
        return (
          <div className="dashboard-error">
            <h2>Invalid User Role</h2>
            <p>Your account role is not recognized. Please contact support.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
