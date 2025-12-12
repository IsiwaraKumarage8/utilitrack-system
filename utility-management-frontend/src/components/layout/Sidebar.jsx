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

/**
 * Enhanced Sidebar Navigation Component with Modern Design
 * @param {boolean} isOpen - Mobile sidebar open state
 * @param {function} onClose - Function to close mobile sidebar
 */
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Customers', path: '/customers', color: 'from-purple-500 to-pink-500' },
    { icon: Plug, label: 'Service Connections', path: '/connections', color: 'from-green-500 to-emerald-500' },
    { icon: Gauge, label: 'Meters', path: '/meters', color: 'from-orange-500 to-amber-500' },
    { icon: Activity, label: 'Meter Readings', path: '/readings', color: 'from-teal-500 to-cyan-500' },
    { icon: FileText, label: 'Billing', path: '/billing', color: 'from-indigo-500 to-blue-500' },
    { icon: CreditCard, label: 'Payments', path: '/payments', color: 'from-emerald-500 to-green-500' },
    { icon: AlertCircle, label: 'Complaints', path: '/complaints', color: 'from-red-500 to-rose-500' },
    { icon: BarChart, label: 'Reports', path: '/reports', color: 'from-violet-500 to-purple-500' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'from-slate-500 to-gray-500' },
  ];
  
  return (
    <>
      {/* Mobile Overlay with fade animation */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Header with gradient background */}
        <div className="relative flex items-center justify-between h-20 px-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/50 animate-pulse-slow">
              <Plug className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur-md opacity-50 -z-10"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                UtiliTrack
              </span>
              <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation Menu with relaxed spacing */}
        <nav className="px-5 py-9 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 10rem)' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`group relative flex items-center space-x-4 px-5 py-5 rounded-2xl transition-all duration-300 animate-slideIn ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/40 scale-[1.02]'
                    : 'text-slate-300 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-700/30 hover:text-white hover:translate-x-2 hover:shadow-lg'
                }`}
              >
                {/* Icon with gradient background */}
                <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 shadow-lg' 
                    : `bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20`
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
                  }`} />
                </div>
                
                {/* Label */}
                <span className="font-semibold text-sm flex-1">{item.label}</span>
                
                {/* Active indicator & arrow */}
                {isActive ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg shadow-white/50"></div>
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                )}
                
                {/* Hover gradient border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm">
          <div className="text-xs text-center space-y-1">
            <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              UtiliTrack v1.0
            </span>
            <p className="text-slate-400">© 2025 All Rights Reserved</p>
          </div>
        </div>
      </aside>
      
      {/* Add custom animations to your global CSS or index.css */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;