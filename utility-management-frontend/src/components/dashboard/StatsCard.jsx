/**
 * Enhanced Stats Card Component with Premium Gradients and Animations
 * @param {ReactNode} icon - Icon component
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} trend - Trend indicator text
 * @param {string} color - Card accent color (blue, green, orange, purple)
 */
const StatsCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => {
  const colorStyles = {
    blue: {
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      glow: 'shadow-blue-500/40',
      bg: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-500 to-cyan-500',
    },
    green: {
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      glow: 'shadow-green-500/40',
      bg: 'from-green-50 to-emerald-50',
      iconBg: 'from-green-500 to-emerald-500',
    },
    orange: {
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      glow: 'shadow-orange-500/40',
      bg: 'from-orange-50 to-amber-50',
      iconBg: 'from-orange-500 to-amber-500',
    },
    purple: {
      gradient: 'from-purple-500 via-violet-600 to-fuchsia-600',
      glow: 'shadow-purple-500/40',
      bg: 'from-purple-50 to-fuchsia-50',
      iconBg: 'from-purple-500 to-fuchsia-500',
    },
  };
  
  const style = colorStyles[color];
  
  return (
    <div className={`relative group bg-gradient-to-br ${style.bg} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl ${style.glow} transition-all duration-500 hover:scale-105 overflow-hidden`}>
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative flex items-center space-x-5">
        {/* Icon with gradient and glow */}
        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${style.iconBg} flex-shrink-0 shadow-xl ${style.glow} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.iconBg} rounded-2xl blur-lg opacity-50 -z-10 group-hover:blur-xl transition-all duration-300`}></div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">{title}</p>
          <p className={`text-4xl font-black bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent mt-2 group-hover:scale-105 transition-transform duration-300`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <span className="text-sm text-green-600 font-semibold">{trend}</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
