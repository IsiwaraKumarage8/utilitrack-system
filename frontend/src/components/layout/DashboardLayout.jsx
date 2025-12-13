import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DashboardLayout.css';

/**
 * Main Dashboard Layout Component
 * Wraps all dashboard pages with sidebar and navbar
 * @param {string} userRole - Current user's role for role-based menu filtering
 */
const DashboardLayout = ({ children, userRole = 'Admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} userRole={userRole} />
      
      {/* Main Content Area */}
      <div className="dashboard-layout__content">
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} />
        
        {/* Page Content */}
        <main className="dashboard-layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
