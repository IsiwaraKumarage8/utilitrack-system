import { useState, useEffect } from 'react';
import { X, CreditCard, User, FileText, DollarSign, Calendar, Building, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import customerApi from '../../api/customerApi';
import billingApi from '../../api/billingApi';
import paymentApi from '../../api/paymentApi';
import { useAuth } from '../../contexts/AuthContext';
import './RecordPaymentModal.css';

const RecordPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    customer_id: '',
    bill_id: '',
    payment_amount: '',
    payment_method: 'Cash',
    transaction_reference: '',
    payment_date: new Date().toISOString().split('T')[0],
    received_by: user?.user_id || ''
  });

  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [error, setError] = useState(null);

  // Fetch customers on mount
  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  // Update received_by when user context changes
  useEffect(() => {
    if (user?.user_id) {
      setFormData(prev => ({ ...prev, received_by: user.user_id }));
    }
  }, [user]);

  // Fetch bills when customer is selected
  useEffect(() => {
    if (formData.customer_id) {
      fetchPendingBills(formData.customer_id);
    } else {
      setBills([]);
      setFormData(prev => ({ ...prev, bill_id: '' }));
      setSelectedBill(null);
    }
  }, [formData.customer_id]);

  // Update payment amount when bill is selected
  useEffect(() => {
    if (formData.bill_id) {
      const bill = bills.find(b => b.bill_id === parseInt(formData.bill_id));
      setSelectedBill(bill);
      if (bill) {
        setFormData(prev => ({ ...prev, payment_amount: bill.outstanding_amount || bill.total_amount }));
      }
    } else {
      setSelectedBill(null);
    }
  }, [formData.bill_id, bills]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      setError(null);
      const response = await customerApi.getAll();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchPendingBills = async (customerId) => {
    try {
      setLoadingBills(true);
      setError(null);
      const response = await billingApi.getPendingBillsByCustomer(customerId);
      setBills(response.data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError('Failed to load bills for this customer.');
      setBills([]);
    } finally {
      setLoadingBills(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customer_id || !formData.bill_id || !formData.payment_amount) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate that user is logged in
    if (!user?.user_id) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    // Validate transaction reference for non-cash payments
    if (formData.payment_method !== 'Cash' && !formData.transaction_reference) {
      setError(`Transaction reference is required for ${formData.payment_method} payments`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare payment data for API
      const paymentData = {
        bill_id: parseInt(formData.bill_id),
        payment_amount: parseFloat(formData.payment_amount),
        payment_method: formData.payment_method,
        transaction_reference: formData.transaction_reference || null,
        payment_date: formData.payment_date,
        received_by: user.user_id
      };
      
      // Create payment via API
      const response = await paymentApi.createPayment(paymentData);
      
      // Reset form on success
      setFormData({
        customer_id: '',
        bill_id: '',
        payment_amount: '',
        payment_method: 'Cash',
        transaction_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        received_by: user?.user_id || ''
      });
      setSelectedBill(null);
      setBills([]);
      
      // Notify parent component
      if (onSuccess) onSuccess();
      
      // Show success message
      alert(`Payment recorded successfully!\nPayment Number: ${response.data?.payment_number || 'Generated'}`);
      
      onClose();
    } catch (error) {
      console.error('Error recording payment:', error);
      setError(error.message || 'Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (!isOpen) return null;

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sidepanel-header">
          <div className="header-content">
            <CreditCard className="header-icon" size={24} />
            <div>
              <h2 className="sidepanel-title">Record Payment</h2>
              <p className="sidepanel-subtitle">Record a new customer payment</p>
            </div>
          </div>
          <button className="sidepanel-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Body */}
        <form onSubmit={handleSubmit} className="sidepanel-body">
          <div className="form-grid">
            {/* Customer Selection */}
            <div className="form-group">
              <label htmlFor="customer_id" className="form-label">
                <User size={16} />
                Customer *
              </label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="form-input"
                required
                disabled={loadingCustomers}
              >
                <option value="">{loadingCustomers ? 'Loading customers...' : 'Select Customer'}</option>
                {customers.map(customer => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.first_name} {customer.last_name} (ID: {customer.customer_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Bill Selection */}
            <div className="form-group">
              <label htmlFor="bill_id" className="form-label">
                <FileText size={16} />
                Bill *
              </label>
              <select
                id="bill_id"
                name="bill_id"
                value={formData.bill_id}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!formData.customer_id || loadingBills}
              >
                <option value="">
                  {loadingBills ? 'Loading bills...' : 'Select Bill'}
                </option>
                {bills.map(bill => (
                  <option key={bill.bill_id} value={bill.bill_id}>
                    {bill.bill_number} - {formatCurrency(bill.outstanding_amount || bill.total_amount)}
                  </option>
                ))}
              </select>
              {formData.customer_id && !loadingBills && bills.length === 0 && (
                <p className="form-hint">No pending bills for this customer</p>
              )}
            </div>

            {/* Payment Amount */}
            <div className="form-group">
              <label htmlFor="payment_amount" className="form-label">
                <DollarSign size={16} />
                Payment Amount *
              </label>
              <input
                type="number"
                id="payment_amount"
                name="payment_amount"
                value={formData.payment_amount}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              {selectedBill && (
                <p className="form-hint">
                  Bill Amount: {formatCurrency(selectedBill.outstanding_amount || selectedBill.total_amount)}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label htmlFor="payment_method" className="form-label">
                <CreditCard size={16} />
                Payment Method *
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Transaction Reference */}
            <div className="form-group">
              <label htmlFor="transaction_reference" className="form-label">
                <FileText size={16} />
                Transaction Reference
              </label>
              <input
                type="text"
                id="transaction_reference"
                name="transaction_reference"
                value={formData.transaction_reference}
                onChange={handleChange}
                className="form-input"
                placeholder="Optional - Enter reference number"
              />
              <p className="form-hint">
                {formData.payment_method === 'Cash' ? 'Not required for cash payments' : 'Required for non-cash payments'}
              </p>
            </div>

            {/* Payment Date */}
            <div className="form-group">
              <label htmlFor="payment_date" className="form-label">
                <Calendar size={16} />
                Payment Date *
              </label>
              <input
                type="date"
                id="payment_date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Received By */}
            <div className="form-group">
              <label htmlFor="received_by" className="form-label">
                <User size={16} />
                Received By
              </label>
              <input
                type="text"
                id="received_by"
                name="received_by"
                value={user?.full_name || 'Current User'}
                className="form-input"
                disabled
                readOnly
              />
              <p className="form-hint">Payment will be recorded under your user account</p>
            </div>
          </div>

          {/* Payment Summary */}
          {selectedBill && formData.payment_amount && (
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span>Bill Amount:</span>
                  <span>{formatCurrency(selectedBill.total_amount)}</span>
                </div>
                <div className="summary-item">
                  <span>Payment Amount:</span>
                  <span className="highlight">{formatCurrency(formData.payment_amount)}</span>
                </div>
                {parseFloat(formData.payment_amount) !== (selectedBill.outstanding_amount || selectedBill.total_amount) && (
                  <div className="summary-item">
                    <span>
                      {parseFloat(formData.payment_amount) > (selectedBill.outstanding_amount || selectedBill.total_amount) ? 'Overpayment:' : 'Outstanding:'}
                    </span>
                    <span className={parseFloat(formData.payment_amount) > (selectedBill.outstanding_amount || selectedBill.total_amount) ? 'overpayment' : 'outstanding'}>
                      {formatCurrency(Math.abs((selectedBill.outstanding_amount || selectedBill.total_amount) - parseFloat(formData.payment_amount)))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="sidepanel-footer">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentModal;
