import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Individual Sidebar Navigation Item Component
 * @param {object} icon - Lucide icon component
 * @param {string} label - Display label
 * @param {string} path - Route path
 * @param {string} colorClass - Color theme class
 * @param {number} index - Animation delay index
 * @param {function} onClose - Callback to close mobile sidebar
 * @param {array} allowedRoles - Array of roles that can see this item
 * @param {string} currentUserRole - Current logged-in user's role
 */
const SidebarNavItem = ({ 
  icon: Icon, 
  label, 
  path, 
  colorClass, 
  index, 
  onClose,
  allowedRoles = [],
  currentUserRole = 'Admin'
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  // If allowedRoles is empty, show to all roles
  // Otherwise, check if current user's role is in the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUserRole)) {
    return null;
  }
  
  return (
    <Link
      to={path}
      onClick={onClose}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
    >
      {/* Icon with gradient background */}
      <div className="sidebar__nav-item-icon">
        <Icon />
      </div>
      
      {/* Label */}
      <span className="sidebar__nav-item-label">{label}</span>
      
      {/* Active indicator & arrow */}
      {isActive ? (
        <div className="sidebar__nav-item-indicator">
          <div className="sidebar__nav-item-dot"></div>
        </div>
      ) : (
        <ChevronRight className="sidebar__nav-item-arrow" />
      )}
      
      {/* Hover gradient border effect */}
      <div className={`sidebar__nav-item-hover-gradient sidebar__nav-item-hover-gradient--${colorClass}`}></div>
    </Link>
  );
};

export default SidebarNavItem;
