import { X, Calendar, User, CreditCard, Building, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './PaymentDetails.css';

const PaymentDetails = ({ payment, onClose }) => {
  if (!payment) return null;

  const getPaymentMethodIcon = (method) => {
    const iconMap = {
      'Cash': '💵',
      'Card': '💳',
      'Bank Transfer': '🏦',
      'Online': '📱',
      'Cheque': '📄'
    };
    return iconMap[method] || '📄';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Completed': <CheckCircle size={20} />,
      'Pending': <Clock size={20} />,
      'Failed': <XCircle size={20} />,
      'Refunded': <XCircle size={20} />
    };
    return icons[status] || <Clock size={20} />;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Completed': 'success',
      'Pending': 'warning',
      'Failed': 'danger',
      'Refunded': 'secondary'
    };
    return statusMap[status] || 'secondary';
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container payment-details-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Payment Details</h2>
            <p className="modal-subtitle">{payment.payment_number}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body payment-details-body">
          {/* Payment Information */}
          <div className="detail-section">
            <h3 className="section-title">Payment Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Payment Number</span>
                <span className="detail-value payment-number">{payment.payment_number}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Payment Date</span>
                <span className="detail-value">
                  <Calendar size={16} className="detail-icon" />
                  {new Date(payment.payment_date).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <div className="status-badge">
                  {getStatusIcon(payment.payment_status)}
                  <Badge status={getStatusBadge(payment.payment_status)}>
                    {payment.payment_status}
                  </Badge>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount Paid</span>
                <span className="detail-value amount-highlight">{formatCurrency(payment.payment_amount)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="detail-section">
            <h3 className="section-title">Customer Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Customer Name</span>
                <span className="detail-value">
                  <User size={16} className="detail-icon" />
                  {payment.customer_name}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Customer ID</span>
                <span className="detail-value">#{payment.customer_id}</span>
              </div>
            </div>
          </div>

          {/* Bill Information */}
          <div className="detail-section">
            <h3 className="section-title">Bill Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Bill Number</span>
                <span className="detail-value bill-link">
                  <FileText size={16} className="detail-icon" />
                  {payment.bill_number}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Bill ID</span>
                <span className="detail-value">#{payment.bill_id}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="detail-section">
            <h3 className="section-title">Payment Method</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Method</span>
                <span className="detail-value">
                  <span className="payment-method-icon">{getPaymentMethodIcon(payment.payment_method)}</span>
                  {payment.payment_method}
                </span>
              </div>
              {payment.transaction_reference && (
                <div className="detail-item">
                  <span className="detail-label">Transaction Reference</span>
                  <span className="detail-value transaction-ref">{payment.transaction_reference}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Received By</span>
                <span className="detail-value">
                  <User size={16} className="detail-icon" />
                  {payment.received_by}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <div className="footer-actions">
            <Button variant="outline" size="md" onClick={() => window.print()}>
              Print Receipt
            </Button>
            {payment.payment_status === 'Completed' && (
              <Button variant="primary" size="md" onClick={() => alert('Download receipt functionality coming soon!')}>
                Download Receipt
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
