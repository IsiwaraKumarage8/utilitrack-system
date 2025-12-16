import { useState, useEffect } from 'react';
import { X, CreditCard, User, FileText, DollarSign, Calendar, Building } from 'lucide-react';
import Button from '../../components/common/Button';
import './RecordPaymentModal.css';

const RecordPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    bill_id: '',
    payment_amount: '',
    payment_method: 'Cash',
    transaction_reference: '',
    payment_date: new Date().toISOString().split('T')[0],
    received_by: ''
  });

  const [customers] = useState([
    { id: 1, name: 'Nuwan Bandara' },
    { id: 2, name: 'Saman Perera' },
    { id: 3, name: 'Kasun Silva' },
    { id: 5, name: 'Pradeep Kumara' },
    { id: 7, name: 'Rohan De Silva' },
    { id: 8, name: 'Anushka Jayawardena' },
    { id: 10, name: 'Samanthi Mendis' }
  ]);

  const [bills] = useState([
    { id: 1, bill_number: 'BILL-2024-0001', customer_id: 1, amount: 3762.50, status: 'Pending' },
    { id: 2, bill_number: 'BILL-2024-0002', customer_id: 2, amount: 7750.00, status: 'Pending' },
    { id: 3, bill_number: 'BILL-2024-0003', customer_id: 3, amount: 1500.00, status: 'Pending' },
    { id: 5, bill_number: 'BILL-2024-0005', customer_id: 5, amount: 15900.00, status: 'Pending' },
    { id: 7, bill_number: 'BILL-2024-0007', customer_id: 7, amount: 5200.00, status: 'Pending' },
    { id: 8, bill_number: 'BILL-2024-0008', customer_id: 8, amount: 3200.00, status: 'Pending' },
    { id: 10, bill_number: 'BILL-2024-0010', customer_id: 10, amount: 1000.00, status: 'Pending' }
  ]);

  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [filteredBills, setFilteredBills] = useState([]);

  useEffect(() => {
    if (formData.customer_id) {
      const customerBills = bills.filter(b => b.customer_id === parseInt(formData.customer_id));
      setFilteredBills(customerBills);
      setFormData(prev => ({ ...prev, bill_id: '' }));
      setSelectedBill(null);
    } else {
      setFilteredBills([]);
    }
  }, [formData.customer_id]);

  useEffect(() => {
    if (formData.bill_id) {
      const bill = bills.find(b => b.id === parseInt(formData.bill_id));
      setSelectedBill(bill);
      setFormData(prev => ({ ...prev, payment_amount: bill?.amount || '' }));
    }
  }, [formData.bill_id]);

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
    if (!formData.customer_id || !formData.bill_id || !formData.payment_amount || !formData.received_by) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // await paymentApi.recordPayment(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Payment recorded successfully!');
      
      // Reset form
      setFormData({
        customer_id: '',
        bill_id: '',
        payment_amount: '',
        payment_method: 'Cash',
        transaction_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        received_by: ''
      });
      setSelectedBill(null);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment. Please try again.');
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container record-payment-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <CreditCard className="modal-icon" size={24} />
            <div>
              <h2>Record Payment</h2>
              <p className="modal-subtitle">Record a new customer payment</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-body">
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
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} (ID: {customer.id})
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
                disabled={!formData.customer_id}
              >
                <option value="">Select Bill</option>
                {filteredBills.map(bill => (
                  <option key={bill.id} value={bill.id}>
                    {bill.bill_number} - {formatCurrency(bill.amount)}
                  </option>
                ))}
              </select>
              {formData.customer_id && filteredBills.length === 0 && (
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
                  Bill Amount: {formatCurrency(selectedBill.amount)}
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
                Received By *
              </label>
              <input
                type="text"
                id="received_by"
                name="received_by"
                value={formData.received_by}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter staff name"
                required
              />
            </div>
          </div>

          {/* Payment Summary */}
          {selectedBill && formData.payment_amount && (
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span>Bill Amount:</span>
                  <span>{formatCurrency(selectedBill.amount)}</span>
                </div>
                <div className="summary-item">
                  <span>Payment Amount:</span>
                  <span className="highlight">{formatCurrency(formData.payment_amount)}</span>
                </div>
                {parseFloat(formData.payment_amount) !== selectedBill.amount && (
                  <div className="summary-item">
                    <span>
                      {parseFloat(formData.payment_amount) > selectedBill.amount ? 'Overpayment:' : 'Outstanding:'}
                    </span>
                    <span className={parseFloat(formData.payment_amount) > selectedBill.amount ? 'overpayment' : 'outstanding'}>
                      {formatCurrency(Math.abs(selectedBill.amount - parseFloat(formData.payment_amount)))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-footer">
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
