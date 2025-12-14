import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
            <DashboardLayout userRole={user?.role || 'Admin'}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/meters" element={<Meters />} />
                <Route path="/readings" element={<Readings />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
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
