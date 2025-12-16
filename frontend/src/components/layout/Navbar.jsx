import { Bell, Menu, LogOut, User, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../common/Badge';
import './Navbar.css';

/**
 * Get dashboard title based on user role
 */
const getDashboardTitle = (role) => {
  if (!role) return 'Admin Dashboard';
  
  const roleMap = {
    'Admin': 'Admin Dashboard',
    'Manager': 'Manager Dashboard',
    'Field Officer': 'Field Officer Dashboard',
    'Cashier': 'Cashier Dashboard',
    'Billing Clerk': 'Billing Dashboard'
  };
  
  return roleMap[role] || `${role} Dashboard`;
};

/**
 * Enhanced Top Navbar Component with Premium Styling
 * @param {function} onMenuClick - Function to toggle mobile sidebar
 */
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      {/* Gradient overlay */}
      <div className="navbar__gradient-overlay"></div>
      
      {/* Left side - Menu button for mobile */}
      <div className="navbar__left">
        <button
          onClick={onMenuClick}
          className="navbar__menu-button"
        >
          <Menu />
        </button>
        <div>
          <h1 className="navbar__title">{getDashboardTitle(user?.role)}</h1>
          <p className="navbar__subtitle">Welcome back to your control center</p>
        </div>
      </div>

      
      {/* Right side - User info and actions */}
      <div className="navbar__right">
        {/* User Info */}
        <div className="navbar__user-section">
          <div className="navbar__user-info">
            <p className="navbar__user-name">{user?.username || 'Admin User'}</p>
            <Badge status="info">{user?.role || 'User'}</Badge>
          </div>
          <div className="navbar__user-avatar">
            <User />
            <div className="navbar__user-avatar-glow"></div>
          </div>
        </div>
        
        {/* Logout */}
        <button className="navbar__logout" onClick={handleLogout} title="Logout">
          <LogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
