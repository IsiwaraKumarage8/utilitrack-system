import Card from '../common/Card';

/**
 * Stats Card Component
 * @param {ReactNode} icon - Icon component
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} trend - Trend indicator text
 * @param {string} color - Card accent color (blue, green, orange, purple)
 */
const StatsCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-5">
        {/* Icon */}
        <div className={`p-4 rounded-xl ${colorClasses[color]} flex-shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-2 font-medium">{trend}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
