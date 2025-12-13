import { UserPlus, FileText, CreditCard, BarChart } from 'lucide-react';
import Card from '../common/Card';
import './QuickActions.css';

/**
 * Quick Actions Grid Component
 */
const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: 'Add New Customer',
      description: 'Register a new customer',
      colorClass: 'blue',
    },
    {
      icon: FileText,
      label: 'Generate Bill',
      description: 'Create a new bill',
      colorClass: 'green',
    },
    {
      icon: CreditCard,
      label: 'Record Payment',
      description: 'Process a payment',
      colorClass: 'orange',
    },
    {
      icon: BarChart,
      label: 'View Reports',
      description: 'Generate reports',
      colorClass: 'purple',
    },
  ];
  
  return (
    <Card>
      <div className="quick-actions__header">
        <h3 className="quick-actions__title">Quick Actions</h3>
        <p className="quick-actions__subtitle">Common tasks and shortcuts</p>
      </div>
      <div className="quick-actions__grid">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`quick-actions__button quick-actions__button--${action.colorClass}`}
            >
              {/* Glow effect */}
              <div className="quick-actions__button-glow"></div>
              
              <div className="quick-actions__button-content">
                <div className="quick-actions__icon-wrapper">
                  <Icon />
                </div>
                <h4 className="quick-actions__label">{action.label}</h4>
                <p className="quick-actions__description">{action.description}</p>
              </div>
              
              {/* Animated border */}
              <div className="quick-actions__button-border"></div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
