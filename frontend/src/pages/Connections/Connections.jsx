import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Zap, Droplet, Flame, Wind, Eye, Edit2, Unplug } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConnectionForm from './ConnectionForm';
import ConnectionDetails from './ConnectionDetails';
import connectionApi from '../../api/connectionApi';
import './Connections.css';

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
      const response = await connectionApi.getAll();
      setConnections(response.data || []);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Failed to load connections. Please try again later.');
      toast.error('Failed to load connections');
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
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

  const handleDeleteConnection = async (connection) => {
    if (!window.confirm(`Are you sure you want to disconnect ${connection.connection_number}?`)) {
      return;
    }

    try {
      await connectionApi.delete(connection.connection_id);
      toast.success('Connection deleted successfully!');
      fetchConnections();
    } catch (err) {
      console.error('Error deleting connection:', err);
      toast.error(err.message || 'Failed to disconnect service connection');
    }
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
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons-container">
        {/* Utility Type Filters */}
        <div className="filter-group">
          <span className="filter-group-label">Utility Type:</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${utilityFilter === 'All' ? 'active' : ''}`}
              onClick={() => setUtilityFilter('All')}
            >
              All
            </button>
            <button 
              className={`filter-btn filter-btn--electricity ${utilityFilter === 'Electricity' ? 'active' : ''}`}
              onClick={() => setUtilityFilter('Electricity')}
            >
              <Zap size={16} />
              <span>Electricity</span>
            </button>
            <button 
              className={`filter-btn filter-btn--water ${utilityFilter === 'Water' ? 'active' : ''}`}
              onClick={() => setUtilityFilter('Water')}
            >
              <Droplet size={16} />
              <span>Water</span>
            </button>
            <button 
              className={`filter-btn filter-btn--gas ${utilityFilter === 'Gas' ? 'active' : ''}`}
              onClick={() => setUtilityFilter('Gas')}
            >
              <Flame size={16} />
              <span>Gas</span>
            </button>
            <button 
              className={`filter-btn filter-btn--sewage ${utilityFilter === 'Sewage' ? 'active' : ''}`}
              onClick={() => setUtilityFilter('Sewage')}
            >
              <Wind size={16} />
              <span>Sewage</span>
            </button>
            <button 
              className={`filter-btn filter-btn--lighting ${utilityFilter === 'Street Lighting' ? 'active' : ''}`}
              onClick={() => setUtilityFilter('Street Lighting')}
            >
              <Zap size={16} />
              <span>Street Lighting</span>
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="filter-group">
          <span className="filter-group-label">Status:</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              All
            </button>
            <button 
              className={`filter-btn filter-btn--success ${statusFilter === 'Active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn filter-btn--danger ${statusFilter === 'Disconnected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Disconnected')}
            >
              Disconnected
            </button>
            <button 
              className={`filter-btn filter-btn--warning ${statusFilter === 'Suspended' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Suspended')}
            >
              Suspended
            </button>
            <button 
              className={`filter-btn filter-btn--info ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending
            </button>
          </div>
        </div>
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
              {paginatedConnections.map((connection, index) => (
                <tr key={`${connection.connection_id}-${connection.connection_number}-${index}`}>
                  <td>
                    <div className="utility-cell">
                      <div className={`utility-icon utility-icon--${getUtilityColor(connection.utility_name)}`}>
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
                    <Badge status={getStatusVariant(connection.connection_status)}>
                      {connection.connection_status}
                    </Badge>
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
                        title="Disconnect"
                      >
                        <Unplug />
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
