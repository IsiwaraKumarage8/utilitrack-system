import { UserPlus, FileText, CreditCard, BarChart } from 'lucide-react';
import Card from '../common/Card';

/**
 * Quick Actions Grid Component
 */
const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: 'Add New Customer',
      description: 'Register a new customer',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      icon: FileText,
      label: 'Generate Bill',
      description: 'Create a new bill',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      icon: CreditCard,
      label: 'Record Payment',
      description: 'Process a payment',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
    {
      icon: BarChart,
      label: 'View Reports',
      description: 'Generate reports',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
  ];
  
  return (
    <Card>
      <div className="mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-2 font-medium">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`relative ${action.color} ${action.hoverColor} text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-left group overflow-hidden animate-slideUp`}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-lg mb-2">{action.label}</h4>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">{action.description}</p>
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300"></div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
