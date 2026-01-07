import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import complaintApi from '../../api/complaintApi';
import customerApi from '../../api/customerApi';
import './LogComplaintForm.css';

const LogComplaintForm = ({ onClose, onSave }) => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    complaint_type: 'Billing Issue',
    priority: 'Medium',
    description: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const response = await customerApi.getAll();
        if (response && response.success) {
          setCustomers(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer is required';
    }

    if (!formData.complaint_type) {
      newErrors.complaint_type = 'Complaint type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Create complaint via API
      const complaintData = {
        customer_id: parseInt(formData.customer_id),
        complaint_type: formData.complaint_type,
        priority: formData.priority,
        description: formData.description,
        notes: formData.notes || null
      };

      await complaintApi.createComplaint(complaintData);
      
      // Success - close form and trigger refresh
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating complaint:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to create complaint. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sidepanel-header">
          <div>
            <h2 className="sidepanel-title">Log New Complaint</h2>
            <p className="sidepanel-subtitle">
              Register a customer complaint in the system
            </p>
          </div>
          <button className="sidepanel-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="sidepanel-body">
            {/* Customer Selection */}
            <div className="form-group">
              <label className="form-label required">Customer</label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className={`form-input ${errors.customer_id ? 'error' : ''}`}
                disabled={loadingCustomers}
              >
                <option value="">{loadingCustomers ? 'Loading customers...' : 'Select a customer'}</option>
                {customers.map(customer => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.first_name} {customer.last_name} - {customer.customer_type}
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <span className="error-message">{errors.customer_id}</span>
              )}
            </div>

            {/* Complaint Type and Priority */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Complaint Type</label>
                <select
                  name="complaint_type"
                  value={formData.complaint_type}
                  onChange={handleChange}
                  className={`form-input ${errors.complaint_type ? 'error' : ''}`}
                >
                  <option value="Billing Issue">Billing Issue</option>
                  <option value="Meter Fault">Meter Fault</option>
                  <option value="Service Disruption">Service Disruption</option>
                  <option value="Quality Issue">Quality Issue</option>
                  <option value="Connection Request">Connection Request</option>
                  <option value="Other">Other</option>
                </select>
                {errors.complaint_type && (
                  <span className="error-message">{errors.complaint_type}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label required">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`form-input ${errors.priority ? 'error' : ''}`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <span className="error-message">{errors.priority}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label required">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the complaint in detail..."
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
              <span className="input-hint">Minimum 10 characters</span>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional notes or comments..."
                className="form-textarea"
              />
              <span className="input-hint">Optional</span>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="error-banner">
                <AlertCircle size={20} />
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sidepanel-footer">
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Log Complaint'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogComplaintForm;
