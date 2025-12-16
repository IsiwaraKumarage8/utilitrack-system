import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Calendar, Clock, XCircle, Eye, Printer, RotateCcw, Banknote, CreditCard, Building, Smartphone, FileText } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PaymentDetails from './PaymentDetails';
import '../../styles/table.css';
import './Payments.css';

// Mock data
const MOCK_PAYMENTS = [
  {
    payment_id: 1,
    payment_number: 'PAY-2024-0001',
    payment_date: '2024-12-14',
    customer_name: 'Saman Perera',
    customer_id: 2,
    bill_number: 'BILL-2024-0002',
    bill_id: 2,
    payment_amount: 7750.00,
    payment_method: 'Bank Transfer',
    transaction_reference: 'BT-20241214-001',
    received_by: 'Nisha Perera',
    payment_status: 'Completed'
  },
  {
    payment_id: 2,
    payment_number: 'PAY-2024-0002',
    payment_date: '2024-12-14',
    customer_name: 'Anushka Jayawardena',
    customer_id: 8,
    bill_number: 'BILL-2024-0008',
    bill_id: 8,
    payment_amount: 3200.00,
    payment_method: 'Cash',
    transaction_reference: null,
    received_by: 'Rajesh Kumar',
    payment_status: 'Completed'
  },
  {
    payment_id: 3,
    payment_number: 'PAY-2024-0003',
    payment_date: '2024-12-13',
    customer_name: 'Pradeep Kumara',
    customer_id: 5,
    bill_number: 'BILL-2024-0005',
    bill_id: 5,
    payment_amount: 15900.00,
    payment_method: 'Cheque',
    transaction_reference: 'CHQ-456789',
    received_by: 'Nisha Perera',
    payment_status: 'Pending'
  },
  {
    payment_id: 4,
    payment_number: 'PAY-2024-0004',
    payment_date: '2024-12-12',
    customer_name: 'Kasun Silva',
    customer_id: 3,
    bill_number: 'BILL-2024-0003',
    bill_id: 3,
    payment_amount: 1500.00,
    payment_method: 'Card',
    transaction_reference: 'CARD-987654321',
    received_by: 'Samanthi Mendis',
    payment_status: 'Completed'
  },
  {
    payment_id: 5,
    payment_number: 'PAY-2024-0005',
    payment_date: '2024-12-11',
    customer_name: 'Samanthi Mendis',
    customer_id: 10,
    bill_number: 'BILL-2024-0010',
    bill_id: 10,
    payment_amount: 1000.00,
    payment_method: 'Online',
    transaction_reference: 'ONL-20241211-789',
    received_by: 'Rajesh Kumar',
    payment_status: 'Completed'
  },
  {
    payment_id: 6,
    payment_number: 'PAY-2024-0006',
    payment_date: '2024-12-10',
    customer_name: 'Nuwan Bandara',
    customer_id: 1,
    bill_number: 'BILL-2024-0001',
    bill_id: 1,
    payment_amount: 3762.50,
    payment_method: 'Cash',
    transaction_reference: null,
    received_by: 'Nisha Perera',
    payment_status: 'Failed'
  },
  {
    payment_id: 7,
    payment_number: 'PAY-2024-0007',
    payment_date: '2024-12-09',
    customer_name: 'Rohan De Silva',
    customer_id: 7,
    bill_number: 'BILL-2024-0007',
    bill_id: 7,
    payment_amount: 9000.00,
    payment_method: 'Bank Transfer',
    transaction_reference: 'BT-20241209-002',
    received_by: 'Rajesh Kumar',
    payment_status: 'Completed'
  },
  {
    payment_id: 8,
    payment_number: 'PAY-2024-0008',
    payment_date: '2024-12-08',
    customer_name: 'Malini Wijesinghe',
    customer_id: 6,
    bill_number: 'BILL-2024-0006',
    bill_id: 6,
    payment_amount: 2375.00,
    payment_method: 'Online',
    transaction_reference: 'ONL-20241208-456',
    received_by: 'Samanthi Mendis',
    payment_status: 'Completed'
  },
  {
    payment_id: 9,
    payment_number: 'PAY-2024-0009',
    payment_date: '2024-12-07',
    customer_name: 'Chamara Fernando',
    customer_id: 4,
    bill_number: 'BILL-2024-0004',
    bill_id: 4,
    payment_amount: 5000.00,
    payment_method: 'Card',
    transaction_reference: 'CARD-123456789',
    received_by: 'Nisha Perera',
    payment_status: 'Refunded'
  },
  {
    payment_id: 10,
    payment_number: 'PAY-2024-0010',
    payment_date: '2024-12-06',
    customer_name: 'Dinesh Rathnayake',
    customer_id: 9,
    bill_number: 'BILL-2024-0009',
    bill_id: 9,
    payment_amount: 1000.00,
    payment_method: 'Cash',
    transaction_reference: null,
    received_by: 'Rajesh Kumar',
    payment_status: 'Completed'
  }
];

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const itemsPerPage = 10;

  // Simulate data loading
  useEffect(() => {
    const loadData = setTimeout(() => {
      setPayments(MOCK_PAYMENTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadData);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.payment_date === today && p.payment_status === 'Completed');
    const todayRevenue = todayPayments.reduce((sum, p) => sum + p.payment_amount, 0);
    
    const thisMonthPayments = payments.filter(p => {
      const paymentMonth = new Date(p.payment_date).getMonth();
      const currentMonth = new Date().getMonth();
      return paymentMonth === currentMonth && p.payment_status === 'Completed';
    });
    const monthlyRevenue = thisMonthPayments.reduce((sum, p) => sum + p.payment_amount, 0);
    
    const pendingCount = payments.filter(p => p.payment_status === 'Pending').length;
    const failedCount = payments.filter(p => p.payment_status === 'Failed').length;

    return {
      todayRevenue,
      monthlyRevenue,
      pendingCount,
      failedCount
    };
  }, [payments]);

  // Filter and search
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Status filter
      if (statusFilter !== 'All' && payment.payment_status !== statusFilter) {
        return false;
      }

      // Method filter
      if (methodFilter !== 'All' && payment.payment_method !== methodFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          payment.payment_number.toLowerCase().includes(query) ||
          payment.bill_number.toLowerCase().includes(query) ||
          payment.customer_name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [payments, statusFilter, methodFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, methodFilter, searchQuery]);

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusMap = {
      'Completed': 'success',
      'Pending': 'warning',
      'Failed': 'danger',
      'Refunded': 'secondary'
    };
    return statusMap[status] || 'secondary';
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const iconMap = {
      'Cash': <Banknote size={16} />,
      'Card': <CreditCard size={16} />,
      'Bank Transfer': <Building size={16} />,
      'Online': <Smartphone size={16} />,
      'Cheque': <FileText size={16} />
    };
    return iconMap[method] || <FileText size={16} />;
  };

  // Get payment method badge variant
  const getMethodBadge = (method) => {
    const methodMap = {
      'Cash': 'success',
      'Card': 'primary',
      'Bank Transfer': 'info',
      'Online': 'info',
      'Cheque': 'warning'
    };
    return methodMap[method] || 'secondary';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate table total
  const tableTotal = paginatedPayments.reduce((sum, p) => sum + p.payment_amount, 0);

  // Action handlers
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
  };

  const handlePrintReceipt = (payment) => {
    // TODO: Implement print receipt functionality
    alert(`Printing receipt for ${payment.payment_number}`);
    console.log('Print receipt:', payment);
  };

  const handleRefund = (payment) => {
    // TODO: Implement refund modal
    alert(`Processing refund for ${payment.payment_number}`);
    console.log('Refund payment:', payment);
  };

  const handleRecordPayment = () => {
    alert('Opening Record Payment form...');
    setShowRecordPaymentModal(true);
    // TODO: Create RecordPaymentModal component
  };

  if (loading) {
    return (
      <div className="payments-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      {/* Page Header */}
      <div className="payments-header">
        <div>
          <h1 className="payments-title">Payment Management</h1>
          <p className="payments-subtitle">View and manage customer payments</p>
        </div>
        <Button variant="primary" size="md" onClick={handleRecordPayment}>
          <CreditCard size={20} />
          <span>Record Payment</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <TrendingUp size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.todayRevenue)}</div>
            <div className="stat-label">Today's Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff' }}>
            <Calendar size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.monthlyRevenue)}</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef2f2' }}>
            <XCircle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.failedCount}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="payments-filters">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by payment number, bill number, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online">Online</option>
            <option value="Cheque">Cheque</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No payments found</p>
            <p className="empty-state-subtext">Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="data-table payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment No.</th>
                <th>Customer</th>
                <th>Bill Number</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction Ref</th>
                <th>Received By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.payment_id} className={payment.payment_status === 'Completed' ? 'completed-row' : ''}>
                  <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td>
                    <span className="payment-number">{payment.payment_number}</span>
                  </td>
                  <td>{payment.customer_name}</td>
                  <td>
                    <span className="bill-link">{payment.bill_number}</span>
                  </td>
                  <td className="payment-amount">{formatCurrency(payment.payment_amount)}</td>
                  <td>
                    <div className="payment-method">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <Badge status={getMethodBadge(payment.payment_method)}>{payment.payment_method}</Badge>
                    </div>
                  </td>
                  <td className="transaction-ref">
                    {payment.transaction_reference || '-'}
                  </td>
                  <td>{payment.received_by}</td>
                  <td>
                    <Badge status={getStatusBadge(payment.payment_status)}>{payment.payment_status}</Badge>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn action-btn-view"
                        title="View Receipt"
                        onClick={() => handleViewReceipt(payment)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn action-btn-print"
                        title="Print"
                        onClick={() => handlePrintReceipt(payment)}
                      >
                        <Printer size={16} />
                      </button>
                      {payment.payment_status === 'Completed' && (
                        <button
                          className="action-btn action-btn-refund"
                          title="Refund"
                          onClick={() => handleRefund(payment)}
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 600 }}>
                  Page Total:
                </td>
                <td className="payment-amount" style={{ fontWeight: 700 }}>
                  {formatCurrency(tableTotal)}
                </td>
                <td colSpan="5"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredPayments.length > 0 && totalPages > 1 && (
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

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default Payments;
