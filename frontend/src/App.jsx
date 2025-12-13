import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers/Customers';
import Connections from './pages/Connections/Connections';
import Meters from './pages/Meters/Meters';
import Readings from './pages/Readings/Readings';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import Complaints from './pages/Complaints';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  // TODO: Replace with actual user role from authentication
  const userRole = 'Admin';

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard Routes */}
        <Route path="/*" element={
          <DashboardLayout userRole={userRole}>
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
        } />
      </Routes>
    </Router>
  );
}

export default App;
