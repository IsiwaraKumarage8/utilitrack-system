import { X, FileText, User, Calendar, DollarSign, CreditCard, TrendingUp, Clock } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import './BillingDetails.css';

const BillingDetails = ({ isOpen, onClose, bill }) => {
  if (!isOpen || !bill) return null;

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `Rs. ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

  const isOverdue = (dueDate, status) => {
    if (status === 'Paid' || status === 'Cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-container billing-details-sidepanel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sidepanel-header">
          <div className="sidepanel-header-content">
            <FileText className="sidepanel-icon" size={24} />
            <div>
              <h2>Bill Details</h2>
              <p className="sidepanel-subtitle">{bill.bill_number}</p>
            </div>
          </div>
          <button className="sidepanel-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="sidepanel-body">
          
          {/* Status Banner */}
          <div className={`status-banner status-${bill.bill_status?.toLowerCase().replace(' ', '-')}`}>
            <div className="status-banner-content">
              <Badge status={getStatusBadge(bill.bill_status)}>
                {bill.bill_status}
              </Badge>
              {isOverdue(bill.due_date, bill.bill_status) && (
                <div className="overdue-warning">
                  <Clock size={16} />
                  <span>Overdue</span>
                </div>
              )}
            </div>
            <div className="status-banner-amount">
              <span className="amount-label">Outstanding Balance</span>
              <span className="amount-value">
                {formatCurrency(bill.outstanding_balance)}
              </span>
            </div>
          </div>

          {/* Customer & Connection Info */}
          <div className="details-section">
            <h3 className="section-title">Customer & Connection Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Customer Name</span>
                <div className="detail-value">
                  <User size={16} />
                  <span>{bill.customer_name}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Customer Type</span>
                <div className="detail-value">
                  <Badge status="info">{bill.customer_type || 'N/A'}</Badge>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Connection Number</span>
                <div className="detail-value">
                  {bill.connection_number || 'N/A'}
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Utility Type</span>
                <div className="detail-value">
                  <Badge status="primary">{bill.utility_type || 'N/A'}</Badge>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Meter Number</span>
                <div className="detail-value">
                  {bill.meter_number || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Bill Information */}
          <div className="details-section">
            <h3 className="section-title">Bill Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Bill Number</span>
                <div className="detail-value bill-number">
                  {bill.bill_number}
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Bill Date</span>
                <div className="detail-value">
                  <Calendar size={16} />
                  <span>{formatDate(bill.bill_date)}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Due Date</span>
                <div className={`detail-value ${isOverdue(bill.due_date, bill.bill_status) ? 'overdue' : ''}`}>
                  <Calendar size={16} />
                  <span>{formatDate(bill.due_date)}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Billing Period</span>
                <div className="detail-value">
                  {formatDate(bill.period_start)} - {formatDate(bill.period_end)}
                </div>
              </div>
            </div>
          </div>

          {/* Consumption Details */}
          <div className="details-section">
            <h3 className="section-title">Consumption Details</h3>
            <div className="consumption-breakdown">
              <div className="consumption-row">
                <span>Previous Reading:</span>
                <span>{bill.previous_reading || 0} {bill.unit_of_measurement || 'units'}</span>
              </div>
              <div className="consumption-row">
                <span>Current Reading:</span>
                <span>{bill.current_reading || 0} {bill.unit_of_measurement || 'units'}</span>
              </div>
              <div className="consumption-row total">
                <span>Total Consumption:</span>
                <span className="consumption-total">
                  {bill.consumption || 0} {bill.unit_of_measurement || 'units'}
                </span>
              </div>
            </div>
          </div>

          {/* Tariff Information */}
          {bill.tariff_name && (
            <div className="details-section">
              <h3 className="section-title">Tariff Applied</h3>
              <div className="tariff-info">
                <div className="tariff-name">{bill.tariff_name}</div>
                <div className="tariff-details">
                  <div className="tariff-row">
                    <span>Rate per Unit:</span>
                    <span>{formatCurrency(bill.rate_per_unit || 0)}</span>
                  </div>
                  <div className="tariff-row">
                    <span>Fixed Charge:</span>
                    <span>{formatCurrency(bill.fixed_charge || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Amount Breakdown */}
          <div className="details-section amount-section">
            <h3 className="section-title">Amount Breakdown</h3>
            <div className="amount-breakdown">
              <div className="amount-row">
                <span className="amount-label">Consumption Charge</span>
                <span className="amount-value">{formatCurrency(bill.consumption_charge || 0)}</span>
              </div>
              
              {bill.fixed_charge > 0 && (
                <div className="amount-row">
                  <span className="amount-label">Fixed Charge</span>
                  <span className="amount-value">{formatCurrency(bill.fixed_charge)}</span>
                </div>
              )}

              {bill.surcharges > 0 && (
                <div className="amount-row">
                  <span className="amount-label">Surcharges</span>
                  <span className="amount-value">{formatCurrency(bill.surcharges)}</span>
                </div>
              )}

              <div className="amount-divider"></div>

              <div className="amount-row total-row">
                <span className="amount-label">Total Amount</span>
                <span className="amount-total">{formatCurrency(bill.total_amount)}</span>
              </div>

              {bill.amount_paid > 0 && (
                <>
                  <div className="amount-row paid-row">
                    <span className="amount-label">
                      <CreditCard size={16} />
                      Amount Paid
                    </span>
                    <span className="amount-value">{formatCurrency(bill.amount_paid)}</span>
                  </div>

                  <div className="amount-row outstanding-row">
                    <span className="amount-label">Outstanding Balance</span>
                    <span className="amount-outstanding">{formatCurrency(bill.outstanding_balance)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment History */}
          {bill.payment_history && bill.payment_history.length > 0 && (
            <div className="details-section">
              <h3 className="section-title">Payment History</h3>
              <div className="payment-history">
                {bill.payment_history.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-icon">
                      <CreditCard size={20} />
                    </div>
                    <div className="payment-details">
                      <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                      <div className="payment-date">{formatDate(payment.payment_date)}</div>
                      <div className="payment-method">{payment.payment_method}</div>
                    </div>
                    <Badge status="success">Completed</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <div className="details-section">
              <h3 className="section-title">Notes</h3>
              <div className="notes-content">
                {bill.notes}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sidepanel-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BillingDetails;
