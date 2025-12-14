import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { canAccessRoute } from './utils/permissions';
import Auth from './pages/Auth/Auth';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers/Customers';
import Connections from './pages/Connections/Connections';
import Meters from './pages/Meters/Meters';
import Readings from './pages/Readings/Readings';
import Billing from './pages/Billing/Billing';
import Payments from './pages/Payments/Payments';
import Complaints from './pages/Complaints/Complaints';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Role-based Protected Route wrapper
const RoleProtectedRoute = ({ children, path }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user's role has access to this route
  if (!canAccessRoute(user.user_role, path)) {
    toast.error('Access denied. You do not have permission to view this page.');
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
        } />
        
        {/* Redirect root based on authentication */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
        } />
        
        {/* Dashboard Routes - Protected */}
        <Route path="/*" element={
          <ProtectedRoute>
            <DashboardLayout userRole={user?.user_role || 'Admin'}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={
                  <RoleProtectedRoute path="/customers">
                    <Customers />
                  </RoleProtectedRoute>
                } />
                <Route path="/connections" element={
                  <RoleProtectedRoute path="/connections">
                    <Connections />
                  </RoleProtectedRoute>
                } />
                <Route path="/meters" element={
                  <RoleProtectedRoute path="/meters">
                    <Meters />
                  </RoleProtectedRoute>
                } />
                <Route path="/readings" element={
                  <RoleProtectedRoute path="/readings">
                    <Readings />
                  </RoleProtectedRoute>
                } />
                <Route path="/billing" element={
                  <RoleProtectedRoute path="/billing">
                    <Billing />
                  </RoleProtectedRoute>
                } />
                <Route path="/payments" element={
                  <RoleProtectedRoute path="/payments">
                    <Payments />
                  </RoleProtectedRoute>
                } />
                <Route path="/complaints" element={
                  <RoleProtectedRoute path="/complaints">
                    <Complaints />
                  </RoleProtectedRoute>
                } />
                <Route path="/reports" element={
                  <RoleProtectedRoute path="/reports">
                    <Reports />
                  </RoleProtectedRoute>
                } />
                <Route path="/settings" element={
                  <RoleProtectedRoute path="/settings">
                    <Settings />
                  </RoleProtectedRoute>
                } />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
