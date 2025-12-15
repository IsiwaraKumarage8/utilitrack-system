import { Plug, X } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import { menuItems } from './menuConfig';
import './Sidebar.css';

/**
 * Get panel name based on user role
 */
const getPanelName = (role) => {
  if (!role) return 'Admin Panel';
  
  const roleMap = {
    'Admin': 'Admin Panel',
    'Manager': 'Manager Panel',
    'Field Officer': 'Field Officer Panel',
    'Cashier': 'Cashier Panel',
    'Billing Clerk': 'Billing Panel'
  };
  
  return roleMap[role] || `${role} Panel`;
};

/**
 * Enhanced Sidebar Navigation Component with Modern Design
 * @param {boolean} isOpen - Mobile sidebar open state
 * @param {function} onClose - Function to close mobile sidebar
 * @param {string} userRole - Current user's role (Admin, Field Officer, Cashier, Manager, Billing Clerk)
 */
const Sidebar = ({ isOpen, onClose, userRole = 'Admin' }) => {
  
  return (
    <>
      {/* Mobile Overlay with fade animation */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo/Header with gradient background */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <Plug />
              <div className="sidebar__logo-icon-glow"></div>
            </div>
            <div>
              <span className="sidebar__logo-text">
                UtiliTrack
              </span>
              <p className="sidebar__logo-subtitle">{getPanelName(userRole)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="sidebar__close"
          >
            <X />
          </button>
        </div>
        
        {/* Navigation Menu with relaxed spacing */}
        <nav className="sidebar__nav">
          {menuItems.map((item, index) => (
            <SidebarNavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              colorClass={item.colorClass}
              index={index}
              onClose={onClose}
              allowedRoles={item.allowedRoles}
              currentUserRole={userRole}
            />
          ))}
        </nav>
        
        {/* Footer with gradient */}
        <div className="sidebar__footer">
          <div className="sidebar__footer-content">
            <span className="sidebar__footer-version">
              UtiliTrack v1.0
            </span>
            <p className="sidebar__footer-copyright">© 2025 All Rights Reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;