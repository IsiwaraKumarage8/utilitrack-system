import { useState, useEffect, useMemo } from 'react';
import { Search, AlertCircle, AlertTriangle, Clock, CheckCircle, Plus, Eye, UserPlus, Edit, DollarSign, Zap, ZapOff, ThumbsDown, Plug, HelpCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import complaintApi from '../../api/complaintApi';
import LogComplaintForm from './LogComplaintForm';
import './Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showLogComplaintForm, setShowLogComplaintForm] = useState(false);

  // Fetch complaints from API
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await complaintApi.getAllComplaints();
      
      if (response && response.success) {
        setComplaints(response.data || []);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'Failed to load complaints. Please ensure the backend server is running.');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalComplaints = complaints.length;
    const openComplaints = complaints.filter(c => c.complaint_status === 'Open').length;
    const inProgressComplaints = complaints.filter(c => c.complaint_status === 'In Progress').length;
    const resolvedComplaints = complaints.filter(c => c.complaint_status === 'Resolved' || c.complaint_status === 'Closed').length;
    const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;

    return {
      totalComplaints,
      openComplaints,
      inProgressComplaints,
      resolutionRate
    };
  }, [complaints]);

  // Filter and search
  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      // Status filter
      if (statusFilter !== 'All' && complaint.complaint_status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && complaint.priority !== priorityFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'All' && complaint.complaint_type !== typeFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          complaint.complaint_number.toLowerCase().includes(query) ||
          complaint.customer_name.toLowerCase().includes(query) ||
          complaint.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [complaints, statusFilter, priorityFilter, typeFilter, searchQuery]);

  // Get priority badge color
  const getPriorityClass = (priority) => {
    const priorityMap = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
      'Urgent': 'priority-urgent'
    };
    return priorityMap[priority] || 'priority-medium';
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusMap = {
      'Open': 'warning',
      'In Progress': 'primary',
      'Resolved': 'success',
      'Closed': 'secondary',
      'Rejected': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  // Get complaint type icon
  const getComplaintIcon = (type) => {
    const iconMap = {
      'Billing Issue': <DollarSign size={20} />,
      'Meter Fault': <AlertCircle size={20} />,
      'Service Disruption': <ZapOff size={20} />,
      'Quality Issue': <ThumbsDown size={20} />,
      'Connection Request': <Plug size={20} />,
      'Other': <HelpCircle size={20} />
    };
    return iconMap[type] || <HelpCircle size={20} />;
  };

  // Get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const complaintDate = new Date(date);
    const diffTime = Math.abs(now - complaintDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Get avatar color
  const getAvatarColor = (id) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  };

  // Get initials
  const getInitials = (name) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get status counts
  const getStatusCounts = () => {
    return {
      all: complaints.length,
      open: complaints.filter(c => c.complaint_status === 'Open').length,
      inProgress: complaints.filter(c => c.complaint_status === 'In Progress').length,
      resolved: complaints.filter(c => c.complaint_status === 'Resolved').length,
      closed: complaints.filter(c => c.complaint_status === 'Closed').length,
      rejected: complaints.filter(c => c.complaint_status === 'Rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="complaints-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaints-page">
        <div className="error-state">
          <AlertCircle size={48} />
          <h2>Failed to Load Complaints</h2>
          <p>{error}</p>
          <Button variant="primary" onClick={fetchComplaints}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="complaints-page">
      {/* Page Header */}
      <div className="complaints-header">
        <div>
          <h1 className="complaints-title">Complaint Management</h1>
          <p className="complaints-subtitle">Track and resolve customer complaints</p>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={() => setShowLogComplaintForm(true)}
        >
          <Plus size={20} />
          <span>Log Complaint</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff' }}>
            <AlertCircle size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalComplaints}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef2f2' }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: '#ef4444' }}>{stats.openComplaints}</div>
            <div className="stat-label">Open</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.inProgressComplaints}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.resolutionRate}%</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button 
          className={`status-tab ${statusFilter === 'All' ? 'active' : ''}`}
          onClick={() => setStatusFilter('All')}
        >
          All
          <span className="tab-badge">{statusCounts.all}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Open' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Open')}
        >
          Open
          <span className="tab-badge warning">{statusCounts.open}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'In Progress' ? 'active' : ''}`}
          onClick={() => setStatusFilter('In Progress')}
        >
          In Progress
          <span className="tab-badge info">{statusCounts.inProgress}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Resolved' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Resolved')}
        >
          Resolved
          <span className="tab-badge success">{statusCounts.resolved}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Closed' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Closed')}
        >
          Closed
          <span className="tab-badge secondary">{statusCounts.closed}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Rejected' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Rejected')}
        >
          Rejected
          <span className="tab-badge danger">{statusCounts.rejected}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="complaints-filters">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by complaint number or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Types</option>
            <option value="Billing Issue">Billing Issue</option>
            <option value="Meter Fault">Meter Fault</option>
            <option value="Service Disruption">Service Disruption</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Connection Request">Connection Request</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No complaints found</p>
          <p className="empty-state-subtext">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint.complaint_id} 
              className={`complaint-card ${getPriorityClass(complaint.priority)}`}
            >
              <div className="card-header">
                <span className="complaint-number">{complaint.complaint_number}</span>
                <span className={`priority-badge ${getPriorityClass(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>

              <div className="complaint-type">
                <span className="type-icon">{getComplaintIcon(complaint.complaint_type)}</span>
                <span className="type-label">{complaint.complaint_type}</span>
              </div>

              <div className="customer-info">
                <span className="customer-name">{complaint.customer_name}</span>
                <span className="complaint-date">{getRelativeTime(complaint.complaint_date)}</span>
              </div>

              <p className="complaint-description">
                {complaint.description.length > 120 
                  ? `${complaint.description.substring(0, 120)}...` 
                  : complaint.description}
              </p>

              <div className="assigned-info">
                {complaint.assigned_to ? (
                  <>
                    <div 
                      className="assignee-avatar"
                      style={{ backgroundColor: getAvatarColor(complaint.assigned_to_id) }}
                    >
                      {getInitials(complaint.assigned_to)}
                    </div>
                    <span className="assignee-name">{complaint.assigned_to}</span>
                  </>
                ) : (
                  <span className="unassigned">Unassigned</span>
                )}
              </div>

              <div className="card-footer">
                <Badge variant={getStatusBadge(complaint.complaint_status)} text={complaint.complaint_status} />
                
                <div className="card-actions">
                  <button className="card-action-btn" title="View Details">
                    <Eye size={16} />
                  </button>
                  <button className="card-action-btn" title="Assign">
                    <UserPlus size={16} />
                  </button>
                  <button className="card-action-btn" title="Change Status">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Complaint Form Modal */}
      {showLogComplaintForm && (
        <LogComplaintForm
          onClose={() => setShowLogComplaintForm(false)}
          onSave={() => {
            setShowLogComplaintForm(false);
            fetchComplaints(); // Refresh the complaints list
          }}
        />
      )}
    </div>
  );
};

export default Complaints;
