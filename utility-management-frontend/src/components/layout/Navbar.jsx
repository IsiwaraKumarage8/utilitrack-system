import { Bell, Menu, LogOut, User } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * Top Navbar Component
 * @param {function} onMenuClick - Function to toggle mobile sidebar
 */
const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white shadow-sm h-16 px-6 flex items-center justify-between">
      {/* Left side - Menu button for mobile */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>
      
      {/* Right side - User info and actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User Info */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin User</p>
            <Badge status="info">Administrator</Badge>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Logout */}
        <button className="p-2 rounded-md hover:bg-red-50 text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
