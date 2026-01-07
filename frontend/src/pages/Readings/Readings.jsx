import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Zap, Droplet, Flame, Download, Eye, Edit2, FileText, Calendar, Lock } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ReadingDetails from './ReadingDetails';
import RecordReadingModal from './RecordReadingModal';
import GenerateBillModal from '../Billing/GenerateBillModal';
import meterReadingApi from '../../api/meterReadingApi';
import './Readings.css';

// Mock data - TODO: Replace with API call
// Note: In production, fetch via JOINs with Meter, Service_Connection, Customer, Utility_Type, and User tables
const MOCK_READINGS = [
  {
    reading_id: 1,
    meter_id: 1,
    reading_date: '2024-12-13',
    previous_reading: 1450.00,
    current_reading: 1580.00,
    consumption: 130.00,
    reading_type: 'Actual',
    reader_id: 1,
    notes: '',
    // FROM JOINs:
    meter_number: 'MTR-ELEC-2020-00001',
    customer_name: 'Nuwan Bandara',
    customer_id: 1,
    utility_name: 'Electricity',
    utility_type_id: 1,
    reader_name: 'John Doe',
    connection_number: 'ELEC-2020-001'
  },
  {
    reading_id: 2,
    meter_id: 2,
    reading_date: '2024-12-13',
    previous_reading: 850.00,
    current_reading: 895.00,
    consumption: 45.00,
    reading_type: 'Actual',
    reader_id: 1,
    notes: '',
    meter_number: 'MTR-WATER-2020-00001',
    customer_name: 'Nuwan Bandara',
    customer_id: 1,
    utility_name: 'Water',
    utility_type_id: 2,
    reader_name: 'John Doe',
    connection_number: 'WATER-2020-001'
  },
  {
    reading_id: 3,
    meter_id: 3,
    reading_date: '2024-12-12',
    previous_reading: 3200.00,
    current_reading: 3485.00,
    consumption: 285.00,
    reading_type: 'Actual',
    reader_id: 2,
    notes: 'High consumption noted',
    meter_number: 'MTR-ELEC-2020-00003',
    customer_name: 'Samantha Silva',
    customer_id: 3,
    utility_name: 'Electricity',
    utility_type_id: 1,
    reader_name: 'Jane Smith',
    connection_number: 'ELEC-2020-003'
  },
  {
    reading_id: 4,
    meter_id: 4,
    reading_date: '2024-12-12',
    previous_reading: 425.00,
    current_reading: 468.00,
    consumption: 43.00,
    reading_type: 'Actual',
    reader_id: 2,
    notes: '',
    meter_number: 'MTR-WATER-2020-00003',
    customer_name: 'Samantha Silva',
    customer_id: 3,
    utility_name: 'Water',
    utility_type_id: 2,
    reader_name: 'Jane Smith',
    connection_number: 'WATER-2020-003'
  },
  {
    reading_id: 5,
    meter_id: 5,
    reading_date: '2024-12-11',
    previous_reading: 8450.00,
    current_reading: 8720.00,
    consumption: 270.00,
    reading_type: 'Actual',
    reader_id: 1,
    notes: 'Industrial meter - normal consumption',
    meter_number: 'MTR-ELEC-2020-00005',
    customer_name: 'Rajesh Kumar',
    customer_id: 5,
    utility_name: 'Electricity',
    utility_type_id: 1,
    reader_name: 'John Doe',
    connection_number: 'ELEC-2020-005'
  },
  {
    reading_id: 6,
    meter_id: 6,
    reading_date: '2024-12-10',
    previous_reading: 125.00,
    current_reading: 142.00,
    consumption: 17.00,
    reading_type: 'Actual',
    reader_id: 2,
    notes: '',
    meter_number: 'MTR-GAS-2023-00001',
    customer_name: 'Samantha Silva',
    customer_id: 3,
    utility_name: 'Gas',
    utility_type_id: 3,
    reader_name: 'Jane Smith',
    connection_number: 'GAS-2023-001'
  },
  {
    reading_id: 7,
    meter_id: 1,
    reading_date: '2024-11-15',
    previous_reading: 1320.00,
    current_reading: 1450.00,
    consumption: 130.00,
    reading_type: 'Actual',
    reader_id: 1,
    notes: '',
    meter_number: 'MTR-ELEC-2020-00001',
    customer_name: 'Nuwan Bandara',
    customer_id: 1,
    utility_name: 'Electricity',
    utility_type_id: 1,
    reader_name: 'John Doe',
    connection_number: 'ELEC-2020-001'
  },
  {
    reading_id: 8,
    meter_id: 3,
    reading_date: '2024-11-12',
    previous_reading: 3050.00,
    current_reading: 3200.00,
    consumption: 150.00,
    reading_type: 'Estimated',
    reader_id: 2,
    notes: 'Customer not available, estimated based on average',
    meter_number: 'MTR-ELEC-2020-00003',
    customer_name: 'Samantha Silva',
    customer_id: 3,
    utility_name: 'Electricity',
    utility_type_id: 1,
    reader_name: 'Jane Smith',
    connection_number: 'ELEC-2020-003'
  },
  {
    reading_id: 9,
    meter_id: 2,
    reading_date: '2024-11-13',
    previous_reading: 810.00,
    current_reading: 850.00,
    consumption: 40.00,
    reading_type: 'Customer-Submitted',
    reader_id: null,
    notes: 'Submitted via customer portal',
    meter_number: 'MTR-WATER-2020-00001',
    customer_name: 'Nuwan Bandara',
    customer_id: 1,
    utility_name: 'Water',
    utility_type_id: 2,
    reader_name: 'Self-Reported',
    connection_number: 'WATER-2020-001'
  },
  {
    reading_id: 10,
    meter_id: 5,
    reading_date: '2024-11-11',
    previous_reading: 8200.00,
    current_reading: 8450.00,
    consumption: 250.00,
    reading_type: 'Actual',
    reader_id: 1,
    notes: '',
    meter_number: 'MTR-ELEC-2020-00005',
    customer_name: 'Rajesh Kumar',
    customer_id: 5,
    utility_name: 'Electricity',
    utility_type_id: 1,
    reader_name: 'John Doe',
    connection_number: 'ELEC-2020-005'
  }
];

const Readings = () => {
  // Permissions
  const { can, isFieldOfficer } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [quickFilter, setQuickFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showGenerateBillModal, setShowGenerateBillModal] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [selectedMeterForReading, setSelectedMeterForReading] = useState(null);

  const itemsPerPage = 10;

  // Quick filter date ranges
  const applyQuickFilter = (filter) => {
    setQuickFilter(filter);
    const today = new Date();
    const from = new Date();

    switch (filter) {
      case 'Today':
        setDateRange({ from: today.toISOString().split('T')[0], to: today.toISOString().split('T')[0] });
        break;
      case 'This Week':
        from.setDate(today.getDate() - today.getDay());
        setDateRange({ from: from.toISOString().split('T')[0], to: today.toISOString().split('T')[0] });
        break;
      case 'This Month':
        from.setDate(1);
        setDateRange({ from: from.toISOString().split('T')[0], to: today.toISOString().split('T')[0] });
        break;
      case 'Last 30 Days':
        from.setDate(today.getDate() - 30);
        setDateRange({ from: from.toISOString().split('T')[0], to: today.toISOString().split('T')[0] });
        break;
      default:
        setDateRange({ from: '', to: '' });
    }
  };

  // Filter readings
  const filteredReadings = useMemo(() => {
    return MOCK_READINGS.filter(reading => {
      const matchesSearch = 
        reading.meter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reading.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUtility = utilityFilter === 'All' || reading.utility_name === utilityFilter;
      const matchesType = typeFilter === 'All' || reading.reading_type === typeFilter;

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const readingDate = new Date(reading.reading_date);
        if (dateRange.from) {
          matchesDate = matchesDate && readingDate >= new Date(dateRange.from);
        }
        if (dateRange.to) {
          matchesDate = matchesDate && readingDate <= new Date(dateRange.to);
        }
      }

      return matchesSearch && matchesUtility && matchesType && matchesDate;
    }).sort((a, b) => new Date(b.reading_date) - new Date(a.reading_date));
  }, [searchQuery, utilityFilter, typeFilter, dateRange]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayReadings = MOCK_READINGS.filter(r => r.reading_date === today);
    const totalConsumption = filteredReadings.reduce((sum, r) => sum + r.consumption, 0);
    const avgConsumption = filteredReadings.length > 0 ? totalConsumption / filteredReadings.length : 0;

    return {
      todayCount: todayReadings.length,
      avgConsumption: avgConsumption.toFixed(2),
      totalReadings: filteredReadings.length
    };
  }, [filteredReadings]);

  // Pagination
  const totalPages = Math.ceil(filteredReadings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReadings = filteredReadings.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleViewDetails = (reading) => {
    setSelectedReading(reading);
    setShowDetails(true);
  };

  const handleEditReading = (reading) => {
    setSelectedReading(reading);
    setShowRecordModal(true);
  };

  const handleGenerateBill = () => {
    setShowGenerateBillModal(true);
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Exporting to CSV...');
  };

  // Utility helpers
  const getUtilityIcon = (utilityType) => {
    const icons = {
      'Electricity': <Zap size={18} />,
      'Water': <Droplet size={18} />,
      'Gas': <Flame size={18} />
    };
    return icons[utilityType] || <Zap size={18} />;
  };

  const getUtilityColor = (utilityType) => {
    const colors = {
      'Electricity': 'electricity',
      'Water': 'water',
      'Gas': 'gas'
    };
    return colors[utilityType] || 'electricity';
  };

  const getReadingTypeVariant = (type) => {
    const variants = {
      'Actual': 'success',
      'Estimated': 'warning',
      'Customer-Submitted': 'primary'
    };
    return variants[type] || 'secondary';
  };

  const getConsumptionClass = (consumption) => {
    if (consumption > 200) return 'consumption-high';
    if (consumption < 50) return 'consumption-low';
    return 'consumption-normal';
  };

  return (
    <div className="readings-page">
      {/* Page Header */}
      <div className="readings-header">
        <div>
          <h1 className="page-title">Meter Readings</h1>
          <p className="page-subtitle">
            {can.recordReading ? 'Track and manage utility meter readings' : 'View utility meter readings'}
            {!can.recordReading && <span className="view-only-badge"> (View Only)</span>}
          </p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md" onClick={handleExportCSV}>
            <Download />
            <span>Export CSV</span>
          </Button>
          {can.recordReading && (
            <Button variant="primary" size="md" onClick={() => setShowRecordModal(true)}>
              <Plus />
              <span>Record Reading</span>
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon primary">
            <Calendar size={24} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Readings Today</span>
            <span className="summary-value">{summaryStats.todayCount}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon success">
            <Zap size={24} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Avg. Consumption</span>
            <span className="summary-value">{summaryStats.avgConsumption} kWh</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon info">
            <FileText size={24} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Readings</span>
            <span className="summary-value">{summaryStats.totalReadings}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="readings-filters">
        {/* Search Bar */}
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by meter number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Date Range */}
        <div className="date-range">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => {
              setDateRange(prev => ({ ...prev, from: e.target.value }));
              setQuickFilter('Custom');
            }}
            placeholder="From Date"
            className="date-input"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => {
              setDateRange(prev => ({ ...prev, to: e.target.value }));
              setQuickFilter('Custom');
            }}
            placeholder="To Date"
            className="date-input"
          />
        </div>

        {/* Utility Filter */}
        <select
          value={utilityFilter}
          onChange={(e) => setUtilityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Utilities</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Gas">Gas</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Types</option>
          <option value="Actual">Actual</option>
          <option value="Estimated">Estimated</option>
          <option value="Customer-Submitted">Customer-Submitted</option>
        </select>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        {['All', 'Today', 'This Week', 'This Month', 'Last 30 Days'].map(filter => (
          <button
            key={filter}
            className={`quick-filter-btn ${quickFilter === filter ? 'active' : ''}`}
            onClick={() => applyQuickFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Readings Table */}
      {paginatedReadings.length === 0 ? (
        <div className="empty-state">
          <p>No readings found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="readings-table">
            <thead>
              <tr>
                <th>Reading Date</th>
                <th>Meter Number</th>
                <th>Customer Name</th>
                <th>Utility Type</th>
                <th>Previous Reading</th>
                <th>Current Reading</th>
                <th>Consumption</th>
                <th>Reading Type</th>
                <th>Reader Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReadings.map(reading => (
                <tr key={reading.reading_id}>
                  <td>{new Date(reading.reading_date).toLocaleDateString()}</td>
                  <td className="meter-number">{reading.meter_number}</td>
                  <td>{reading.customer_name}</td>
                  <td>
                    <div className="utility-cell">
                      <div className={`utility-icon utility-icon--${getUtilityColor(reading.utility_name)}`}>
                        {getUtilityIcon(reading.utility_name)}
                      </div>
                      {reading.utility_name || 'N/A'}
                    </div>
                  </td>
                  <td>{reading.previous_reading.toFixed(2)}</td>
                  <td>{reading.current_reading.toFixed(2)}</td>
                  <td>
                    <span className={`consumption ${getConsumptionClass(reading.consumption)}`}>
                      {reading.consumption.toFixed(2)} kWh
                    </span>
                  </td>
                  <td>
                    <Badge status={getReadingTypeVariant(reading.reading_type)}>
                      {reading.reading_type}
                    </Badge>
                  </td>
                  <td>{reading.reader_name}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewDetails(reading)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {can.editReading && (
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditReading(reading)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {can.generateBill && (
                        <button
                          className="action-btn bill"
                          onClick={handleGenerateBill}
                          title="Generate Bill"
                        >
                          <FileText size={18} />
                        </button>
                      )}
                      {!can.editReading && !can.generateBill && (
                        <span className="view-only-text" title="View only access">
                          <Lock size={14} />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showDetails && (
        <ReadingDetails
          reading={selectedReading}
          onClose={() => setShowDetails(false)}
          onEdit={handleEditReading}
          onGenerateBill={handleGenerateBill}
        />
      )}

      {showRecordModal && (
        <RecordReadingModal
          meter={selectedReading}
          onClose={() => {
            setShowRecordModal(false);
            setSelectedReading(null);
          }}
          onSave={async () => {
            setShowRecordModal(false);
            setSelectedReading(null);
            // Fetch fresh data from API
            try {
              const response = await meterReadingApi.getAllReadings();
              if (response && response.success) {
                // Since this is using mock data, we'll keep it as is
                // In production, you'd update the readings state here
                window.location.reload();
              }
            } catch (error) {
              console.error('Error refreshing readings:', error);
              window.location.reload();
            }
          }}
        />
      )}

      {showGenerateBillModal && (
        <GenerateBillModal
          isOpen={showGenerateBillModal}
          onClose={() => setShowGenerateBillModal(false)}
          onSuccess={() => {
            setShowGenerateBillModal(false);
            // Refresh the page to show updated data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Readings;
