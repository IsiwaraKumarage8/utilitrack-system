import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, DollarSign, CheckCircle, AlertCircle, Eye, Download, CreditCard } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import '../../styles/table.css';
import './Billing.css';

// Mock data
const MOCK_BILLS = [
  {
    bill_id: 1,
    bill_number: 'BILL-2024-0001',
    customer_name: 'Nuwan Bandara',
    customer_type: 'Residential',
    utility_type: 'Electricity',
    bill_date: '2024-10-01',
    due_date: '2024-10-31',
    billing_period_start: '2024-08-31',
    billing_period_end: '2024-09-30',
    consumption: 130.50,
    rate_per_unit: 25.00,
    fixed_charge: 500.00,
    consumption_charge: 3262.50,
    total_amount: 3762.50,
    amount_paid: 0.00,
    outstanding_balance: 3762.50,
    bill_status: 'Unpaid'
  },
  {
    bill_id: 2,
    bill_number: 'BILL-2024-0002',
    customer_name: 'Saman Perera',
    customer_type: 'Commercial',
    utility_type: 'Water',
    bill_date: '2024-10-02',
    due_date: '2024-11-01',
    billing_period_start: '2024-09-01',
    billing_period_end: '2024-09-30',
    consumption: 450.00,
    rate_per_unit: 15.00,
    fixed_charge: 1000.00,
    consumption_charge: 6750.00,
    total_amount: 7750.00,
    amount_paid: 7750.00,
    outstanding_balance: 0.00,
    bill_status: 'Paid'
  },
  {
    bill_id: 3,
    bill_number: 'BILL-2024-0003',
    customer_name: 'Kasun Silva',
    customer_type: 'Residential',
    utility_type: 'Electricity',
    bill_date: '2024-10-03',
    due_date: '2024-11-02',
    billing_period_start: '2024-09-01',
    billing_period_end: '2024-09-30',
    consumption: 95.25,
    rate_per_unit: 25.00,
    fixed_charge: 500.00,
    consumption_charge: 2381.25,
    total_amount: 2881.25,
    amount_paid: 1500.00,
    outstanding_balance: 1381.25,
    bill_status: 'Partially Paid'
  },
  {
    bill_id: 4,
    bill_number: 'BILL-2024-0004',
    customer_name: 'Chamara Fernando',
    customer_type: 'Industrial',
    utility_type: 'Gas',
    bill_date: '2024-09-15',
    due_date: '2024-10-15',
    billing_period_start: '2024-08-15',
    billing_period_end: '2024-09-15',
    consumption: 850.00,
    rate_per_unit: 35.00,
    fixed_charge: 2000.00,
    consumption_charge: 29750.00,
    total_amount: 31750.00,
    amount_paid: 0.00,
    outstanding_balance: 31750.00,
    bill_status: 'Overdue'
  },
  {
    bill_id: 5,
    bill_number: 'BILL-2024-0005',
    customer_name: 'Pradeep Kumara',
    customer_type: 'Government',
    utility_type: 'Water',
    bill_date: '2024-10-05',
    due_date: '2024-11-04',
    billing_period_start: '2024-09-05',
    billing_period_end: '2024-10-05',
    consumption: 1200.00,
    rate_per_unit: 12.00,
    fixed_charge: 1500.00,
    consumption_charge: 14400.00,
    total_amount: 15900.00,
    amount_paid: 15900.00,
    outstanding_balance: 0.00,
    bill_status: 'Paid'
  },
  {
    bill_id: 6,
    bill_number: 'BILL-2024-0006',
    customer_name: 'Malini Wijesinghe',
    customer_type: 'Residential',
    utility_type: 'Electricity',
    bill_date: '2024-10-06',
    due_date: '2024-11-05',
    billing_period_start: '2024-09-06',
    billing_period_end: '2024-10-06',
    consumption: 75.00,
    rate_per_unit: 25.00,
    fixed_charge: 500.00,
    consumption_charge: 1875.00,
    total_amount: 2375.00,
    amount_paid: 0.00,
    outstanding_balance: 2375.00,
    bill_status: 'Unpaid'
  },
  {
    bill_id: 7,
    bill_number: 'BILL-2024-0007',
    customer_name: 'Rohan De Silva',
    customer_type: 'Commercial',
    utility_type: 'Electricity',
    bill_date: '2024-09-20',
    due_date: '2024-10-20',
    billing_period_start: '2024-08-20',
    billing_period_end: '2024-09-20',
    consumption: 320.00,
    rate_per_unit: 25.00,
    fixed_charge: 1000.00,
    consumption_charge: 8000.00,
    total_amount: 9000.00,
    amount_paid: 0.00,
    outstanding_balance: 9000.00,
    bill_status: 'Overdue'
  },
  {
    bill_id: 8,
    bill_number: 'BILL-2024-0008',
    customer_name: 'Anushka Jayawardena',
    customer_type: 'Residential',
    utility_type: 'Water',
    bill_date: '2024-10-08',
    due_date: '2024-11-07',
    billing_period_start: '2024-09-08',
    billing_period_end: '2024-10-08',
    consumption: 180.00,
    rate_per_unit: 15.00,
    fixed_charge: 500.00,
    consumption_charge: 2700.00,
    total_amount: 3200.00,
    amount_paid: 3200.00,
    outstanding_balance: 0.00,
    bill_status: 'Paid'
  },
  {
    bill_id: 9,
    bill_number: 'BILL-2024-0009',
    customer_name: 'Dinesh Rathnayake',
    customer_type: 'Commercial',
    utility_type: 'Gas',
    bill_date: '2024-10-10',
    due_date: '2024-10-25',
    billing_period_start: '2024-09-10',
    billing_period_end: '2024-10-10',
    consumption: 0.00,
    rate_per_unit: 35.00,
    fixed_charge: 1000.00,
    consumption_charge: 0.00,
    total_amount: 1000.00,
    amount_paid: 0.00,
    outstanding_balance: 0.00,
    bill_status: 'Cancelled'
  },
  {
    bill_id: 10,
    bill_number: 'BILL-2024-0010',
    customer_name: 'Samanthi Mendis',
    customer_type: 'Residential',
    utility_type: 'Electricity',
    bill_date: '2024-10-12',
    due_date: '2024-11-11',
    billing_period_start: '2024-09-12',
    billing_period_end: '2024-10-12',
    consumption: 110.00,
    rate_per_unit: 25.00,
    fixed_charge: 500.00,
    consumption_charge: 2750.00,
    total_amount: 3250.00,
    amount_paid: 1000.00,
    outstanding_balance: 2250.00,
    bill_status: 'Partially Paid'
  }
];

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulate data loading
  useEffect(() => {
    const loadData = setTimeout(() => {
      setBills(MOCK_BILLS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadData);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalBills = bills.length;
    const totalBilled = bills.reduce((sum, bill) => sum + bill.total_amount, 0);
    const totalCollected = bills.reduce((sum, bill) => sum + bill.amount_paid, 0);
    const totalOutstanding = bills.reduce((sum, bill) => sum + bill.outstanding_balance, 0);

    return {
      totalBills,
      totalBilled,
      totalCollected,
      totalOutstanding
    };
  }, [bills]);

  // Filter and search
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      // Status filter
      if (statusFilter !== 'All' && bill.bill_status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bill.bill_number.toLowerCase().includes(query) ||
          bill.customer_name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [bills, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
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
    return `Rs. ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  return (
    <div className="billing-page">
      {/* Page Header */}
      <div className="billing-header">
        <div>
          <h1 className="billing-title">Billing Management</h1>
          <p className="billing-subtitle">Manage bills and generate invoices</p>
        </div>
        <Button variant="primary" size="md">
          <FileText size={20} />
          <span>Generate Bill</span>
        </Button>
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
        {filteredBills.length === 0 ? (
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
                    <Badge variant={getUtilityBadge(bill.utility_type)} text={bill.utility_type} />
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
                    <Badge variant={getStatusBadge(bill.bill_status)} text={bill.bill_status} />
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
      {filteredBills.length > 0 && totalPages > 1 && (
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
    </div>
  );
};

export default Billing;
