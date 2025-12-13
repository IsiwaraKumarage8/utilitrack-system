import { useState, useMemo } from 'react';
import { Search, Plus, Zap, Droplet, Flame, Wind, Eye, Edit2, Trash2, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConnectionForm from './ConnectionForm';
import ConnectionDetails from './ConnectionDetails';
import './Connections.css';

// Mock data - TODO: Replace with API call
const MOCK_CONNECTIONS = [
  {
    connection_id: 1,
    customer_id: 1,
    customer_name: 'Nuwan Bandara',
    utility_type: 'Electricity',
    meter_number: 'MTR-ELEC-2020-00001',
    connection_number: 'ELEC-2020-001',
    tariff_plan: 'Residential Electricity Standard',
    installation_date: '2020-01-25',
    status: 'Active',
    location: '45/2 Galle Road, Colombo 03',
    last_reading: '2024-01-15',
    current_consumption: 245.5,
    notes: 'Single phase digital meter'
  },
  {
    connection_id: 2,
    customer_id: 1,
    customer_name: 'Nuwan Bandara',
    utility_type: 'Water',
    meter_number: 'MTR-WATER-2020-00001',
    connection_number: 'WATER-2020-001',
    tariff_plan: 'Residential Water Standard',
    installation_date: '2020-01-25',
    status: 'Active',
    location: '45/2 Galle Road, Colombo 03',
    last_reading: '2024-01-15',
    current_consumption: 18.2,
    notes: 'Residential water meter'
  },
  {
    connection_id: 3,
    customer_id: 2,
    customer_name: 'Samantha Silva',
    utility_type: 'Electricity',
    meter_number: 'MTR-ELEC-2020-00003',
    connection_number: 'ELEC-2020-003',
    tariff_plan: 'Commercial Electricity Rate',
    installation_date: '2020-05-15',
    status: 'Active',
    location: '78 Main Street, Negombo',
    last_reading: '2024-01-14',
    current_consumption: 1250.8,
    notes: 'Three-phase commercial connection'
  },
  {
    connection_id: 4,
    customer_id: 3,
    customer_name: 'Lakshmi Perera',
    utility_type: 'Gas',
    meter_number: 'MTR-GAS-2023-00001',
    connection_number: 'GAS-2023-001',
    tariff_plan: 'Residential Gas Standard',
    installation_date: '2023-03-10',
    status: 'Active',
    location: '789 Green Avenue, Galle',
    last_reading: '2024-01-13',
    current_consumption: 45.3,
    notes: 'LPG Pipeline connection'
  },
  {
    connection_id: 5,
    customer_id: 4,
    customer_name: 'Rajesh Kumar',
    utility_type: 'Electricity',
    meter_number: 'MTR-ELEC-2020-00005',
    connection_number: 'ELEC-2020-005',
    tariff_plan: 'Industrial Electricity Rate',
    installation_date: '2020-10-10',
    status: 'Active',
    location: 'Industrial Zone, Plot 15, Ratmalana',
    last_reading: '2024-01-15',
    current_consumption: 3450.2,
    notes: 'High voltage industrial connection'
  },
  {
    connection_id: 6,
    customer_id: 5,
    customer_name: 'Chaminda Fernando',
    utility_type: 'Water',
    meter_number: 'MTR-WATER-2020-00003',
    connection_number: 'WATER-2020-003',
    tariff_plan: 'Commercial Water Rate',
    installation_date: '2020-05-15',
    status: 'Active',
    location: '78 Main Street, Negombo',
    last_reading: '2024-01-12',
    current_consumption: 52.7,
    notes: 'Commercial water supply'
  },
  {
    connection_id: 7,
    customer_id: 6,
    customer_name: 'Priya Jayasinghe',
    utility_type: 'Sewage',
    meter_number: 'MTR-SEW-2023-00001',
    connection_number: 'SEW-2023-001',
    tariff_plan: 'Residential Sewage Standard',
    installation_date: '2023-06-18',
    status: 'Active',
    location: '987 Sunset Road, Jaffna',
    last_reading: '2024-01-15',
    current_consumption: 12.5,
    notes: 'Residential sewage connection'
  },
  {
    connection_id: 8,
    customer_id: 7,
    customer_name: 'Anil Wickramasinghe',
    utility_type: 'Street Lighting',
    meter_number: 'MTR-LIGHT-2023-00001',
    connection_number: 'LIGHT-2023-001',
    tariff_plan: 'Street Lighting Standard',
    installation_date: '2023-07-22',
    status: 'Active',
    location: 'Main Street Area, Moratuwa',
    last_reading: '2024-01-15',
    current_consumption: 850.5,
    notes: 'Public street lighting zone'
  }
];

const Connections = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'

  const itemsPerPage = 9; // 3x3 grid

  // Filter connections
  const filteredConnections = useMemo(() => {
    return MOCK_CONNECTIONS.filter(connection => {
      const matchesSearch = 
        connection.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.meter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUtility = utilityFilter === 'All' || connection.utility_type === utilityFilter;
      const matchesStatus = statusFilter === 'All' || connection.connection_status === statusFilter;

      return matchesSearch && matchesUtility && matchesStatus;
    });
  }, [searchQuery, utilityFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConnections = filteredConnections.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleAddConnection = () => {
    setFormMode('add');
    setSelectedConnection(null);
    setShowForm(true);
  };

  const handleEditConnection = (connection) => {
    setFormMode('edit');
    setSelectedConnection(connection);
    setShowForm(true);
  };

  const handleViewConnection = (connection) => {
    setSelectedConnection(connection);
    setShowDetails(true);
  };

  const handleDeleteConnection = (connection) => {
    // TODO: Implement delete confirmation and API call
    console.log('Delete connection:', connection);
  };

  // Utility icon and color mapping
  const getUtilityIcon = (utilityType) => {
    const icons = {
      'Electricity': <Zap size={24} />,
      'Water': <Droplet size={24} />,
      'Gas': <Flame size={24} />,
      'Sewage': <Wind size={24} />,
      'Street Lighting': <Zap size={24} />
    };
    return icons[utilityType] || <Zap size={24} />;
  };

  const getUtilityColor = (utilityType) => {
    const colors = {
      'Electricity': 'electricity',
      'Water': 'water',
      'Gas': 'gas',
      'Sewage': 'sewage',
      'Street Lighting': 'street-lighting'
    };
    return colors[utilityType] || 'electricity';
  };

  const getStatusVariant = (status) => {
    const variants = {
      'Active': 'success',
      'Disconnected': 'danger',
      'Suspended': 'warning',
      'Pending': 'info'
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="connections-page">
      {/* Page Header */}
      <div className="connections-header">
        <div>
          <h1 className="page-title">Service Connections</h1>
          <p className="page-subtitle">Manage utility service connections and meters</p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddConnection}>
          <Plus size={20} />
          <span>Add Connection</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="connections-filters">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by customer, meter number, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={utilityFilter}
          onChange={(e) => setUtilityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Utilities</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Gas">Gas</option>
          <option value="Sewage">Sewage</option>
          <option value="Street Lighting">Street Lighting</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Disconnected">Disconnected</option>
          <option value="Suspended">Suspended</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Connections Grid */}
      {paginatedConnections.length === 0 ? (
        <div className="empty-state">
          <p>No connections found</p>
        </div>
      ) : (
        <div className="connections-grid">
          {paginatedConnections.map(connection => (
            <div key={connection.connection_id} className="connection-card">
              {/* Card Header */}
              <div className={`connection-card-header ${getUtilityColor(connection.utility_type)}`}>
                <div className="utility-icon-wrapper">
                  {getUtilityIcon(connection.utility_type)}
                </div>
                <div className="utility-info">
                  <h3 className="utility-type">{connection.utility_type}</h3>
                  <p className="connection-type">{connection.connection_number}</p>
                </div>
                <Badge variant={getStatusVariant(connection.connection_status)} text={connection.connection_status} />
              </div>

              {/* Card Body */}
              <div className="connection-card-body">
                <div className="connection-detail">
                  <span className="detail-label">Customer</span>
                  <span className="detail-value">{connection.customer_name}</span>
                </div>
                <div className="connection-detail">
                  <span className="detail-label">Meter Number</span>
                  <span className="detail-value">{connection.meter_number}</span>
                </div>
                <div className="connection-detail">
                  <span className="detail-label">Tariff Plan</span>
                  <span className="detail-value">{connection.tariff_plan}</span>
                </div>
                <div className="connection-detail">
                  <span className="detail-label">Location</span>
                  <span className="detail-value location">
                    <MapPin size={14} />
                    {connection.property_address}
                  </span>
                </div>
                <div className="connection-detail">
                  <span className="detail-label">Installation Date</span>
                  <span className="detail-value">
                    {new Date(connection.connection_date).toLocaleDateString()}
                  </span>
                </div>
                {connection.connection_status === 'Active' && (
                  <div className="connection-detail consumption">
                    <span className="detail-label">Current Consumption</span>
                    <span className="detail-value highlight">
                      {connection.current_consumption} {connection.utility_type === 'Electricity' || connection.utility_type === 'Street Lighting' ? 'kWh' : 'Cubic Meters'}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="connection-card-footer">
                <button
                  className="action-btn view"
                  onClick={() => handleViewConnection(connection)}
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => handleEditConnection(connection)}
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteConnection(connection)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
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
        <ConnectionForm
          mode={formMode}
          connection={selectedConnection}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            // TODO: Refresh connections list
          }}
        />
      )}

      {showDetails && (
        <ConnectionDetails
          connection={selectedConnection}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            handleEditConnection(selectedConnection);
          }}
        />
      )}
    </div>
  );
};

export default Connections;
