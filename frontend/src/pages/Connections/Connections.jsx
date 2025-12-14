import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Zap, Droplet, Flame, Wind, Eye, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConnectionForm from './ConnectionForm';
import ConnectionDetails from './ConnectionDetails';
import './Connections.css';

const API_URL = 'http://localhost:5000/api';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'

  const itemsPerPage = 10;

  // Fetch connections from API
  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/connections`);
      setConnections(response.data.data || []);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Failed to load connections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter connections
  const filteredConnections = useMemo(() => {
    return connections.filter(connection => {
      const matchesSearch = 
        connection.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.meter_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.property_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.connection_number?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUtility = utilityFilter === 'All' || connection.utility_name === utilityFilter;
      const matchesStatus = statusFilter === 'All' || connection.connection_status === statusFilter;

      return matchesSearch && matchesUtility && matchesStatus;
    });
  }, [connections, searchQuery, utilityFilter, statusFilter]);

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
async (connection) => {
    if (!window.confirm(`Are you sure you want to disconnect ${connection.connection_number}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/connections/${connection.connection_id}`);
      // Refresh the list
      fetchConnections();
    } catch (err) {
      console.error('Error deleting connection:', err);
      alert('Failed to disconnect service connection');
    } call
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

  if (loading) {
    return (
      <div className="connections-page">
        <div className="loading-state">
          <p>Loading connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="connections-page">
        <div className="error-state">
          <p>{error}</p>
          <Button onClick={fetchConnections}>Retry</Button>
        </div>
      </div>
    );
  }

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

      {/* Connections Table */}
      <div className="table-container">
        {paginatedConnections.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No connections found</p>
            <p className="empty-state-subtext">Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="data-table connections-table">
            <thead>
              <tr>
                <th>Utility</th>
                <th>Connection No.</th>
                <th>Customer</th>
                <th>Meter Number</th>
                <th>Tariff Plan</th>
                <th>Location</th>
                <th>Installation Date</th>
                <th>Status</th>
                <th>Consumption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConnections.map(connection => (
                <tr key={connection.connection_id}>
                  <td>
                    <div className="utility-cell">
                      <div className={`utility-icon ${getUtilityColor(connection.utility_name)}`}>
                        {getUtilityIcon(connection.utility_name)}
                      </div>
                      <span className="utility-name">{connection.utility_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="connection-number">{connection.connection_number}</span>
                  </td>
                  <td>{connection.customer_name}</td>
                  <td>
                    <span className="meter-number">{connection.meter_number || 'N/A'}</span>
                  </td>
                  <td>{connection.tariff_name || 'N/A'}</td>
                  <td>
                    <span className="location-text">{connection.property_address}</span>
                  </td>
                  <td>{new Date(connection.connection_date).toLocaleDateString()}</td>
                  <td>
                    <Badge variant={getStatusVariant(connection.connection_status)} text={connection.connection_status} />
                  </td>
                  <td>
                    {connection.connection_status === 'Active' ? (
                      <span className="consumption-value">
                        {connection.current_consumption || 0} {connection.utility_name === 'Electricity' || connection.utility_name === 'Street Lighting' ? 'kWh' : 'm³'}
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn action-btn-view"
                        onClick={() => handleViewConnection(connection)}
                        title="View Details"
                      >
                        <Eye />
                      </button>
                      <button
                        className="action-btn action-btn-edit"
                        onClick={() => handleEditConnection(connection)}
                        title="Edit"
                      >
                        <Edit2 />
                      </button>
                      <button
                        className="action-btn action-btn-delete"
                        onClick={() => handleDeleteConnection(connection)}
                        title="Delete"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {paginatedConnections.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
            fetchConnections(); // Refresh the list
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
