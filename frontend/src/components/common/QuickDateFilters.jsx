import PropTypes from 'prop-types';
import './QuickDateFilters.css';

/**
 * QuickDateFilters Component
 * Preset date range buttons for common reporting periods
 */
const QuickDateFilters = ({ onSelect }) => {
  const getDateRange = (type) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (type) {
      case 'today':
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };

      case 'yesterday':
        start.setDate(today.getDate() - 1);
        return {
          start: start.toISOString().split('T')[0],
          end: start.toISOString().split('T')[0]
        };

      case 'thisWeek':
        // Start from Sunday
        start.setDate(today.getDate() - today.getDay());
        return {
          start: start.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };

      case 'lastWeek':
        // Previous Sunday to Saturday
        start.setDate(today.getDate() - today.getDay() - 7);
        end.setDate(start.getDate() + 6);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };

      case 'thisMonth':
        start.setDate(1);
        return {
          start: start.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };

      case 'lastMonth':
        start.setMonth(today.getMonth() - 1, 1);
        end.setMonth(today.getMonth(), 0); // Last day of previous month
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };

      case 'last30Days':
        start.setDate(today.getDate() - 30);
        return {
          start: start.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };

      case 'last90Days':
        start.setDate(today.getDate() - 90);
        return {
          start: start.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };

      case 'thisYear':
        start.setMonth(0, 1);
        return {
          start: start.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };

      case 'lastYear':
        start.setFullYear(today.getFullYear() - 1, 0, 1);
        end.setFullYear(today.getFullYear() - 1, 11, 31);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };

      default:
        return { start: null, end: null };
    }
  };

  const quickFilters = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Last Week', value: 'lastWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Last 30 Days', value: 'last30Days' },
    { label: 'Last 90 Days', value: 'last90Days' },
    { label: 'This Year', value: 'thisYear' },
    { label: 'Last Year', value: 'lastYear' }
  ];

  const handleClick = (value) => {
    const range = getDateRange(value);
    onSelect(range);
  };

  return (
    <div className="quick-date-filters">
      <div className="quick-date-filters__label">Quick Select:</div>
      <div className="quick-date-filters__grid">
        {quickFilters.map(filter => (
          <button
            key={filter.value}
            className="quick-date-filters__btn"
            onClick={() => handleClick(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

QuickDateFilters.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default QuickDateFilters;
