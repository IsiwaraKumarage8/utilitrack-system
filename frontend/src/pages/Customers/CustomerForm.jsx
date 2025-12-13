import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../components/common/Button';
import './CustomerForm.css';

const CustomerForm = ({ mode, customer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customer_type: 'Residential',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && customer) {
      setFormData({
        customer_type: customer.customer_type,
        first_name: customer.first_name,
        last_name: customer.last_name,
        company_name: customer.company_name || '',
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postal_code: customer.postal_code,
        status: customer.status
      });
    }
  }, [mode, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (['Commercial', 'Industrial', 'Government'].includes(formData.customer_type) && !formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required for this customer type';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits starting with 0';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // TODO: Implement API call
      console.log('Save customer:', formData);
      onSave(formData);
    }
  };

  const showCompanyField = ['Commercial', 'Industrial', 'Government'].includes(formData.customer_type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content customer-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Customer Type */}
            <div className="form-section">
              <label className="form-label">Customer Type <span className="required">*</span></label>
              <div className="radio-group">
                {['Residential', 'Commercial', 'Industrial', 'Government'].map(type => (
                  <label key={type} className="radio-label">
                    <input
                      type="radio"
                      name="customer_type"
                      value={type}
                      checked={formData.customer_type === type}
                      onChange={handleChange}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Grid */}
            <div className="form-grid">
              {/* First Name */}
              <div className="form-field">
                <label className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  className={`form-input ${errors.first_name ? 'error' : ''}`}
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>

              {/* Last Name */}
              <div className="form-field">
                <label className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  className={`form-input ${errors.last_name ? 'error' : ''}`}
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>

              {/* Company Name (conditional) */}
              {showCompanyField && (
                <div className="form-field full-width">
                  <label className="form-label">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    className={`form-input ${errors.company_name ? 'error' : ''}`}
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                  {errors.company_name && <span className="error-message">{errors.company_name}</span>}
                </div>
              )}

              {/* Email */}
              <div className="form-field">
                <label className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-field">
                <label className="form-label">
                  Phone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0XXXXXXXXX"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {/* Address */}
              <div className="form-field full-width">
                <label className="form-label">
                  Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              {/* City */}
              <div className="form-field">
                <label className="form-label">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              {/* Postal Code */}
              <div className="form-field">
                <label className="form-label">
                  Postal Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="postal_code"
                  className={`form-input ${errors.postal_code ? 'error' : ''}`}
                  value={formData.postal_code}
                  onChange={handleChange}
                />
                {errors.postal_code && <span className="error-message">{errors.postal_code}</span>}
              </div>

              {/* Status */}
              <div className="form-field">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {mode === 'add' ? 'Create Customer' : 'Update Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
