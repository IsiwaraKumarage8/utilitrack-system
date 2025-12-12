import { Bell, Menu, LogOut, User, Search } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * Enhanced Top Navbar Component with Premium Styling
 * @param {function} onMenuClick - Function to toggle mobile sidebar
 */
const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="relative bg-gradient-to-r from-white via-blue-50/30 to-white shadow-lg border-b border-blue-100/50 h-20 px-8 flex items-center justify-between backdrop-blur-sm">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      {/* Left side - Menu button for mobile */}
      <div className="relative flex items-center space-x-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group"
        >
          <Menu className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 font-medium">Welcome back to your control center</p>
        </div>
      </div>
      
      {/* Right side - User info and actions */}
      <div className="relative flex items-center space-x-6">
        {/* Search */}
        <button className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group">
          <Search className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm text-gray-600 group-hover:text-blue-600">Search...</span>
        </button>
        
        {/* Notifications */}
        <button className="relative p-3 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 transition-all duration-300 group hover:scale-110">
          <Bell className="w-5 h-5 text-orange-600 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/50 animate-pulse">3</span>
        </button>
        
        {/* User Info */}
        <div className="flex items-center space-x-4 pl-6 border-l-2 border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Admin User</p>
            <Badge status="info">Administrator</Badge>
          </div>
          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 hover:scale-110 transition-transform cursor-pointer group">
            <User className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-md opacity-50 -z-10"></div>
          </div>
        </div>
        
        {/* Logout */}
        <button className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-600 transition-all duration-300 hover:scale-110 group">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
