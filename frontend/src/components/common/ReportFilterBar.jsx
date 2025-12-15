import { useState, useEffect, useRef } from 'react';
import { Calendar, Filter, RotateCcw, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import QuickDateFilters from './QuickDateFilters';
import './ReportFilterBar.css';

/**
 * ReportFilterBar Component
 * Comprehensive filter controls for reports with date range, utility type, and export options
 */
const ReportFilterBar = ({ filters, onFilterChange, onReset, onExport }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const utilityTypes = ['All', 'Electricity', 'Water', 'Gas', 'Sewage', 'Street Lighting'];
  const customerTypes = ['All', 'Residential', 'Commercial', 'Industrial'];

  const handleDateRangeChange = (field, value) => {
    onFilterChange({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const handleQuickDateSelect = (range) => {
    onFilterChange({ dateRange: range });
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDateRangeDisplay = () => {
    const { start, end } = filters.dateRange;
    if (!start && !end) return 'Select Date Range';
    if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
    if (start) return `From ${formatDate(start)}`;
    if (end) return `Until ${formatDate(end)}`;
  };

  return (
    <div className="report-filter-bar">
      <div className="report-filter-bar__header">
        <div className="report-filter-bar__header-left">
          <Filter size={18} />
          <span className="report-filter-bar__title">Filters</span>
        </div>
        <div className="report-filter-bar__header-right">
          <button 
            className="report-filter-bar__reset-btn"
            onClick={onReset}
            title="Reset all filters"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          {onExport && (
            <button 
              className="report-filter-bar__export-btn"
              onClick={onExport}
              title="Export report data"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      <div className="report-filter-bar__controls">
        {/* Date Range Filter */}
        <div className="report-filter-bar__control">
          <label className="report-filter-bar__label">
            <Calendar size={14} />
            Date Range
          </label>
          <div className="report-filter-bar__date-wrapper" ref={datePickerRef}>
            <button
              className="report-filter-bar__date-toggle"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {getDateRangeDisplay()}
              <Calendar size={16} className="report-filter-bar__date-icon" />
            </button>
            
            {showDatePicker && (
              <div className="report-filter-bar__date-picker">
                <QuickDateFilters onSelect={handleQuickDateSelect} />
                
                <div className="report-filter-bar__date-inputs">
                  <div className="report-filter-bar__date-input-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.start || ''}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      max={filters.dateRange.end || undefined}
                      className="report-filter-bar__date-input"
                    />
                  </div>
                  <div className="report-filter-bar__date-input-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.end || ''}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      min={filters.dateRange.start || undefined}
                      className="report-filter-bar__date-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Utility Type Filter */}
        <div className="report-filter-bar__control">
          <label className="report-filter-bar__label">Utility Type</label>
          <select
            value={filters.utilityType}
            onChange={(e) => onFilterChange({ utilityType: e.target.value })}
            className="report-filter-bar__select"
          >
            {utilityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Customer Type Filter */}
        <div className="report-filter-bar__control">
          <label className="report-filter-bar__label">Customer Type</label>
          <select
            value={filters.customerType}
            onChange={(e) => onFilterChange({ customerType: e.target.value })}
            className="report-filter-bar__select"
          >
            {customerTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

ReportFilterBar.propTypes = {
  filters: PropTypes.shape({
    dateRange: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string
    }),
    utilityType: PropTypes.string,
    customerType: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onExport: PropTypes.func
};

export default ReportFilterBar;
