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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`${action.color} ${action.hoverColor} text-white p-7 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl text-left group`}
            >
              <Icon className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-lg mb-2">{action.label}</h4>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
