import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, DollarSign, CheckCircle, AlertCircle, Eye, Download, CreditCard } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import billingApi from '../../api/billingApi';
import GenerateBillModal from './GenerateBillModal';
import '../../styles/table.css';
import './Billing.css';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalBilled: 0,
    totalCollected: 0,
    totalOutstanding: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statsPeriod, setStatsPeriod] = useState('all'); // 'all' or 'current'
  const [showGenerateBillModal, setShowGenerateBillModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bills from API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching bills with filters:', { searchQuery, statusFilter });
        
        let response;
        if (searchQuery) {
          response = await billingApi.searchBills(searchQuery);
        } else if (statusFilter !== 'All') {
          response = await billingApi.filterByStatus(statusFilter);
        } else {
          response = await billingApi.getAllBills();
        }

        console.log('Billing API response:', response);

        if (response && response.success) {
          setBills(response.data || []);
        } else {
          setBills([]);
        }
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError(err.message || 'Failed to load bills. Please ensure the backend server is running.');
        setBills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [searchQuery, statusFilter]);

  // Fetch billing stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await billingApi.getBillingStats(statsPeriod);
        if (response.success) {
          setStats({
            totalBills: response.data.total_bills || 0,
            totalBilled: response.data.total_billed || 0,
            totalCollected: response.data.total_collected || 0,
            totalOutstanding: response.data.total_outstanding || 0
          });
        }
      } catch (err) {
        console.error('Error fetching billing stats:', err);
      }
    };

    fetchStats();
  }, [statsPeriod]);

  // Pagination (bills are already filtered from API)
  const totalPages = Math.ceil(bills.length / itemsPerPage);
  const paginatedBills = bills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusMap = {
      'Unpaid': 'warning',
      'Paid': 'success',
      'Partially Paid': 'info',
      'Overdue': 'danger',
      'Cancelled': 'secondary'
    };
    return statusMap[status] || 'secondary';
  };

  // Get utility badge variant
  const getUtilityBadge = (utility) => {
    const utilityMap = {
      'Electricity': 'primary',
      'Water': 'info',
      'Gas': 'warning'
    };
    return utilityMap[utility] || 'secondary';
  };

  // Format currency
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `Rs. ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Check if overdue
  const isOverdue = (dueDate, status) => {
    if (status === 'Paid' || status === 'Cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  // Get status counts
  const getStatusCounts = () => {
    return {
      all: bills.length,
      unpaid: bills.filter(b => b.bill_status === 'Unpaid').length,
      paid: bills.filter(b => b.bill_status === 'Paid').length,
      partiallyPaid: bills.filter(b => b.bill_status === 'Partially Paid').length,
      overdue: bills.filter(b => b.bill_status === 'Overdue').length,
      cancelled: bills.filter(b => b.bill_status === 'Cancelled').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="billing-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading billing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-page">
        <div className="error-state">
          <AlertCircle size={48} color="#ef4444" />
          <h3>Error Loading Bills</h3>
          <p>{error}</p>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      {/* Page Header */}
      <div className="billing-header">
        <div>
          <h1 className="billing-title">Billing Management</h1>
          <p className="billing-subtitle">Manage bills and generate invoices</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="period-toggle">
            <button 
              className={`period-toggle-btn ${statsPeriod === 'current' ? 'active' : ''}`}
              onClick={() => setStatsPeriod('current')}
            >
              This Month
            </button>
            <button 
              className={`period-toggle-btn ${statsPeriod === 'all' ? 'active' : ''}`}
              onClick={() => setStatsPeriod('all')}
            >
              All Time
            </button>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowGenerateBillModal(true)}>
            <FileText size={20} />
            <span>Generate Bill</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff' }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBills}</div>
            <div className="stat-label">Total Bills</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <DollarSign size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalBilled)}</div>
            <div className="stat-label">Total Billed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalCollected)}</div>
            <div className="stat-label">Collected</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef2f2' }}>
            <AlertCircle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: '#ef4444' }}>
              {formatCurrency(stats.totalOutstanding)}
            </div>
            <div className="stat-label">Outstanding</div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button 
          className={`status-tab ${statusFilter === 'All' ? 'active' : ''}`}
          onClick={() => setStatusFilter('All')}
        >
          All Bills
          <span className="tab-badge">{statusCounts.all}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Unpaid' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Unpaid')}
        >
          Unpaid
          <span className="tab-badge warning">{statusCounts.unpaid}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Paid' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Paid')}
        >
          Paid
          <span className="tab-badge success">{statusCounts.paid}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Partially Paid' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Partially Paid')}
        >
          Partially Paid
          <span className="tab-badge info">{statusCounts.partiallyPaid}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Overdue' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Overdue')}
        >
          Overdue
          <span className="tab-badge danger">{statusCounts.overdue}</span>
        </button>
        <button 
          className={`status-tab ${statusFilter === 'Cancelled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Cancelled')}
        >
          Cancelled
          <span className="tab-badge secondary">{statusCounts.cancelled}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="billing-filters">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by bill number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        {paginatedBills.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No bills found</p>
            <p className="empty-state-subtext">Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="data-table billing-table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Customer</th>
                <th>Utility Type</th>
                <th>Bill Date</th>
                <th>Due Date</th>
                <th>Total Amount</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBills.map((bill) => (
                <tr key={bill.bill_id}>
                  <td>
                    <span className="bill-number">{bill.bill_number}</span>
                  </td>
                  <td>{bill.customer_name}</td>
                  <td>
                    <Badge status={getUtilityBadge(bill.utility_type)}>
                      {bill.utility_type || 'N/A'}
                    </Badge>
                  </td>
                  <td>{new Date(bill.bill_date).toLocaleDateString()}</td>
                  <td className={isOverdue(bill.due_date, bill.bill_status) ? 'overdue-date' : ''}>
                    {new Date(bill.due_date).toLocaleDateString()}
                  </td>
                  <td className="amount-cell">{formatCurrency(bill.total_amount)}</td>
                  <td className={bill.outstanding_balance > 0 ? 'outstanding-cell' : ''}>
                    {formatCurrency(bill.outstanding_balance)}
                  </td>
                  <td>
                    <Badge status={getStatusBadge(bill.bill_status)}>
                      {bill.bill_status || 'N/A'}
                    </Badge>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn action-btn-view"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn action-btn-download"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="action-btn action-btn-payment"
                        title="Record Payment"
                      >
                        <CreditCard size={16} />
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
      {paginatedBills.length > 0 && totalPages > 1 && (
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

      <GenerateBillModal
        isOpen={showGenerateBillModal}
        onClose={() => setShowGenerateBillModal(false)}
        onSuccess={() => {
          fetchBills();
          toast.success('Bill generated successfully!');
        }}
      />
    </div>
  );
};

export default Billing;
