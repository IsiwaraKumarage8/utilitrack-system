import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Main Dashboard Layout Component
 * Wraps all dashboard pages with sidebar and navbar
 */
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
