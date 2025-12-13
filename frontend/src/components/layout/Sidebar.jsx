import { Link, useLocation } from 'react-router-dom';
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
  Settings,
  X,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

/**
 * Enhanced Sidebar Navigation Component with Modern Design
 * @param {boolean} isOpen - Mobile sidebar open state
 * @param {function} onClose - Function to close mobile sidebar
 */
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', colorClass: 'blue' },
    { icon: Users, label: 'Customers', path: '/customers', colorClass: 'purple' },
    { icon: Plug, label: 'Service Connections', path: '/connections', colorClass: 'green' },
    { icon: Gauge, label: 'Meters', path: '/meters', colorClass: 'orange' },
    { icon: Activity, label: 'Meter Readings', path: '/readings', colorClass: 'teal' },
    { icon: FileText, label: 'Billing', path: '/billing', colorClass: 'indigo' },
    { icon: CreditCard, label: 'Payments', path: '/payments', colorClass: 'emerald' },
    { icon: AlertCircle, label: 'Complaints', path: '/complaints', colorClass: 'red' },
    { icon: BarChart, label: 'Reports', path: '/reports', colorClass: 'violet' },
    { icon: Settings, label: 'Settings', path: '/settings', colorClass: 'slate' },
  ];
  
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
              <p className="sidebar__logo-subtitle">Admin Panel</p>
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
              >
                {/* Icon with gradient background */}
                <div className="sidebar__nav-item-icon">
                  <Icon />
                </div>
                
                {/* Label */}
                <span className="sidebar__nav-item-label">{item.label}</span>
                
                {/* Active indicator & arrow */}
                {isActive ? (
                  <div className="sidebar__nav-item-indicator">
                    <div className="sidebar__nav-item-dot"></div>
                  </div>
                ) : (
                  <ChevronRight className="sidebar__nav-item-arrow" />
                )}
                
                {/* Hover gradient border effect */}
                <div className={`sidebar__nav-item-hover-gradient sidebar__nav-item-hover-gradient--${item.colorClass}`}></div>
              </Link>
            );
          })}
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