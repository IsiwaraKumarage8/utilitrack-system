import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import CustomerForm from './CustomerForm';
import CustomerDetails from './CustomerDetails';
import customerApi from '../../api/customerApi';
import './Customers.css';

// Mock data - REMOVED, now using API
const MOCK_CUSTOMERS_BACKUP = [
  {
    customer_id: 1,
    customer_type: 'Residential',
    first_name: 'Nuwan',
    last_name: 'Bandara',
    company_name: null,
    email: 'nuwan.bandara@email.com',
    phone: '0771234567',
    address: '123 Main Street',
    city: 'Colombo',
    postal_code: '00100',
    status: 'Active'
  },
  {
    customer_id: 2,
    customer_type: 'Commercial',
    first_name: 'Saman',
    last_name: 'Perera',
    company_name: 'Tech Solutions Ltd',
    email: 'saman@techsolutions.lk',
    phone: '0112345678',
    address: '456 Business Park',
    city: 'Colombo',
    postal_code: '00500',
    status: 'Active'
  },
  {
    customer_id: 3,
    customer_type: 'Residential',
    first_name: 'Kasun',
    last_name: 'Silva',
    company_name: null,
    email: 'kasun.silva@gmail.com',
    phone: '0769876543',
    address: '789 Park Avenue',
    city: 'Kandy',
    postal_code: '20000',
    status: 'Active'
  },
  {
    customer_id: 4,
    customer_type: 'Industrial',
    first_name: 'Chamara',
    last_name: 'Fernando',
    company_name: 'Manufacturing Corp',
    email: 'chamara@manufacturing.lk',
    phone: '0312223456',
    address: 'Industrial Zone Block A',
    city: 'Gampaha',
    postal_code: '11000',
    status: 'Active'
  },
  {
    customer_id: 5,
    customer_type: 'Government',
    first_name: 'Pradeep',
    last_name: 'Kumara',
    company_name: 'Ministry of Health',
    email: 'pradeep@health.gov.lk',
    phone: '0112567890',
    address: 'Government Complex',
    city: 'Colombo',
    postal_code: '00100',
    status: 'Active'
  },
  {
    customer_id: 6,
    customer_type: 'Residential',
    first_name: 'Malini',
    last_name: 'Wijesinghe',
    company_name: null,
    email: 'malini.w@email.com',
    phone: '0773456789',
    address: '321 Lake Road',
    city: 'Negombo',
    postal_code: '11500',
    status: 'Inactive'
  },
  {
    customer_id: 7,
    customer_type: 'Commercial',
    first_name: 'Rohan',
    last_name: 'De Silva',
    company_name: 'Green Market Pvt Ltd',
    email: 'rohan@greenmarket.lk',
    phone: '0114567890',
    address: '555 Market Street',
    city: 'Colombo',
    postal_code: '00700',
    status: 'Active'
  },
  {
    customer_id: 8,
    customer_type: 'Residential',
    first_name: 'Thilini',
    last_name: 'Rajapaksha',
    company_name: null,
    email: 'thilini.r@yahoo.com',
    phone: '0765432109',
    address: '88 Beach Road',
    city: 'Galle',
    postal_code: '80000',
    status: 'Suspended'
  },
  {
    customer_id: 9,
    customer_type: 'Commercial',
    first_name: 'Anil',
    last_name: 'Gunasekara',
    company_name: 'Elite Hotel Group',
    email: 'anil@elitehotels.lk',
    phone: '0912234567',
    address: '777 Ocean View',
    city: 'Galle',
    postal_code: '80100',
    status: 'Active'
  },
  {
    customer_id: 10,
    customer_type: 'Residential',
    first_name: 'Dilani',
    last_name: 'Mendis',
    company_name: null,
    email: 'dilani.mendis@gmail.com',
    phone: '0778765432',
    address: '99 Hill Street',
    city: 'Kandy',
    postal_code: '20100',
    status: 'Active'
  }
];

const Customers = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'

  const itemsPerPage = 10;

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers function
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customerApi.getAll();
      
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to load customers');
      setLoading(false);
      toast.error('Failed to load customers');
    }
  };

  // Handle search with API
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  // Handle type filter change
  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Filter and search customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      const matchesType = typeFilter === 'All Types' || customer.customer_type === typeFilter;
      const matchesStatus = statusFilter === 'All Status' || customer.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [customers, searchQuery, typeFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleAddCustomer = () => {
    setFormMode('add');
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer) => {
    setFormMode('edit');
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const handleDeleteCustomer = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.first_name} ${customer.last_name}?`)) {
      try {
        await customerApi.delete(customer.customer_id);
        toast.success('Customer deleted successfully!');
        fetchCustomers(); // Refresh list
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error(error.message || 'Failed to delete customer');
      }
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[id % colors.length];
  };

  const getCustomerTypeBadge = (type) => {
    const typeMap = {
      'Residential': 'info',
      'Commercial': 'success',
      'Industrial': 'warning',
      'Government': 'info'
    };
    return typeMap[type] || 'info';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Active': 'success',
      'Inactive': 'warning',
      'Suspended': 'danger'
    };
    return statusMap[status] || 'info';
  };

  // Loading state
  if (loading) {
    return (
      <div className="customers-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="customers-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={fetchCustomers} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-page">
      {/* Page Header */}
      <div className="customers-header">
        <div>
          <h1 className="customers-title">Customer Management</h1>
          <p className="customers-subtitle">Manage all customer accounts and information</p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddCustomer}>
          <Plus className="button-icon" />
          Add Customer
        </Button>
      </div>

      {/* Filters Section */}
      <div className="customers-filters">
        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="filter-group">
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <option>All Types</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
            <option>Government</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="customers-table-container">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No customers found</p>
            <p className="empty-state-subtext">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>
                      <div className="customer-info">
                        <div 
                          className="customer-avatar"
                          style={{ backgroundColor: getAvatarColor(customer.customer_id) }}
                        >
                          {getInitials(customer.first_name, customer.last_name)}
                        </div>
                        <div className="customer-details">
                          <div className="customer-name">
                            {customer.first_name} {customer.last_name}
                          </div>
                          {customer.company_name && (
                            <div className="customer-company">{customer.company_name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <Badge status={getCustomerTypeBadge(customer.customer_type)}>
                        {customer.customer_type}
                      </Badge>
                    </td>
                    <td>{customer.city}</td>
                    <td>
                      <Badge status={getStatusBadge(customer.status)}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn-view"
                          onClick={() => handleViewCustomer(customer)}
                          title="View Details"
                        >
                          <Eye />
                        </button>
                        <button
                          className="action-btn action-btn-edit"
                          onClick={() => handleEditCustomer(customer)}
                          title="Edit"
                        >
                          <Edit2 />
                        </button>
                        <button
                          className="action-btn action-btn-delete"
                          onClick={() => handleDeleteCustomer(customer)}
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

            {/* Pagination */}
            {totalPages > 1 && (
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
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <CustomerForm
          mode={formMode}
          customer={selectedCustomer}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            fetchCustomers(); // Refresh customer list after save
          }}
        />
      )}

      {showDetails && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            handleEditCustomer(selectedCustomer);
          }}
        />
      )}
    </div>
  );
};

export default Customers;
