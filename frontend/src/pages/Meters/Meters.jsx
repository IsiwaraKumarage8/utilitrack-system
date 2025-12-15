import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Zap, Droplet, Flame, Eye, Edit2, Activity, Wrench } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MeterForm from './MeterForm';
import MeterDetails from './MeterDetails';
import RecordReadingForm from './RecordReadingForm';
import meterApi from '../../api/meterApi';
import './Meters.css';

const Meters = () => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showRecordReading, setShowRecordReading] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [sortField, setSortField] = useState('installation_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const itemsPerPage = 10;

  // Fetch meters from API
  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await meterApi.getAllMeters();
      
      if (response && response.success) {
        setMeters(response.data || []);
      } else {
        setMeters([]);
      }
    } catch (err) {
      console.error('Error fetching meters:', err);
      setError(err.message || 'Failed to load meters. Please ensure the backend server is running.');
      setMeters([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort meters
  const filteredMeters = useMemo(() => {
    let filtered = meters.filter(meter => {
      const matchesSearch = 
        meter.meter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meter.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meter.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || meter.meter_status === statusFilter;
      const matchesType = typeFilter === 'All' || meter.meter_type === typeFilter;
      const matchesUtility = utilityFilter === 'All' || meter.utility_type === utilityFilter;

      return matchesSearch && matchesStatus && matchesType && matchesUtility;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'installation_date' || sortField === 'last_maintenance_date') {
        aVal = aVal ? new Date(aVal) : new Date(0);
        bVal = bVal ? new Date(bVal) : new Date(0);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [meters, searchQuery, statusFilter, typeFilter, utilityFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredMeters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeters = filteredMeters.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleAddMeter = () => {
    setFormMode('add');
    setSelectedMeter(null);
    setShowForm(true);
  };

  const handleEditMeter = (meter) => {
    setFormMode('edit');
    setSelectedMeter(meter);
    setShowForm(true);
  };

  const handleViewMeter = (meter) => {
    setSelectedMeter(meter);
    setShowDetails(true);
  };

  const handleRecordReading = (meter) => {
    setSelectedMeter(meter);
    setShowRecordReading(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Utility icon and color mapping
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

  const getStatusVariant = (status) => {
    const variants = {
      'Active': 'success',
      'Faulty': 'danger',
      'Replaced': 'secondary',
      'Removed': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getStatusRowClass = (status) => {
    const classes = {
      'Active': 'row-active',
      'Faulty': 'row-faulty',
      'Replaced': 'row-replaced',
      'Removed': 'row-removed'
    };
    return classes[status] || '';
  };

  if (loading) {
    return (
      <div className="meters-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading meters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meters-page">
        <div className="error-state">
          <Activity size={48} />
          <h2>Failed to Load Meters</h2>
          <p>{error}</p>
          <Button variant="primary" onClick={fetchMeters}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="meters-page">
      {/* Page Header */}
      <div className="meters-header">
        <div>
          <h1 className="page-title">Meter Management</h1>
          <p className="page-subtitle">Monitor and manage utility meters</p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddMeter}>
          <Plus size={20} />
          <span>Register Meter</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="meters-filters">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by meter number, customer name, or manufacturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Faulty">Faulty</option>
          <option value="Replaced">Replaced</option>
          <option value="Removed">Removed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Types</option>
          <option value="Digital">Digital</option>
          <option value="Analog">Analog</option>
          <option value="Smart Meter">Smart Meter</option>
        </select>

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
      </div>

      {/* Meters Table */}
      {paginatedMeters.length === 0 ? (
        <div className="empty-state">
          <p>No meters found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="meters-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('meter_number')} className="sortable">
                  Meter Number {sortField === 'meter_number' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Utility Type</th>
                <th>Customer Name</th>
                <th>Meter Type</th>
                <th>Manufacturer</th>
                <th onClick={() => handleSort('installation_date')} className="sortable">
                  Installation Date {sortField === 'installation_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('last_maintenance_date')} className="sortable">
                  Last Maintenance {sortField === 'last_maintenance_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMeters.map(meter => (
                <tr key={meter.meter_id} className={getStatusRowClass(meter.meter_status)}>
                  <td className="meter-number">{meter.meter_number}</td>
                  <td>
                    <div className={`utility-badge ${getUtilityColor(meter.utility_type)}`}>
                      {getUtilityIcon(meter.utility_type)}
                      <span>{meter.utility_type}</span>
                    </div>
                  </td>
                  <td>{meter.customer_name}</td>
                  <td>{meter.meter_type}</td>
                  <td>{meter.manufacturer || '-'}</td>
                  <td>{new Date(meter.installation_date).toLocaleDateString()}</td>
                  <td>{meter.last_maintenance_date ? new Date(meter.last_maintenance_date).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <Badge variant={getStatusVariant(meter.meter_status)} text={meter.meter_status} />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewMeter(meter)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {meter.meter_status === 'Active' && (
                        <button
                          className="action-btn reading"
                          onClick={() => handleRecordReading(meter)}
                          title="Record Reading"
                        >
                          <Activity size={18} />
                        </button>
                      )}
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditMeter(meter)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
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
      {showForm && (
        <MeterForm
          mode={formMode}
          meter={selectedMeter}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            // TODO: Refresh meters list
          }}
        />
      )}

      {showDetails && (
        <MeterDetails
          meter={selectedMeter}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            handleEditMeter(selectedMeter);
          }}
          onRecordReading={() => {
            setShowDetails(false);
            handleRecordReading(selectedMeter);
          }}
        />
      )}

      {showRecordReading && (
        <RecordReadingForm
          meter={selectedMeter}
          onClose={() => setShowRecordReading(false)}
          onSave={() => {
            setShowRecordReading(false);
            // TODO: Refresh meters list
          }}
        />
      )}
    </div>
  );
};

export default Meters;
