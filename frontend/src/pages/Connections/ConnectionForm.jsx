import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import customerApi from '../../api/customerApi';
import connectionApi from '../../api/connectionApi';
import './ConnectionForm.css';

const ConnectionForm = ({ mode, connection, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Customer Selection
    customer_id: '',
    customer_name: '',
    
    // Step 2: Utility & Connection Details
    utility_type_id: 1, // Will be set based on utility_type selection
    utility_type: 'Electricity',
    connection_number: '',
    connection_date: '',
    property_address: '',
    
    // Step 3: Meter Details
    meter_number: '',
    meter_type: '',
    initial_reading: '',
    
    // Step 4: Tariff & Status
    tariff_id: '', // Will be set based on tariff_plan selection
    tariff_plan: '',
    connection_status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const response = await customerApi.getAll();
        setCustomers(response.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  // Utility Type ID mapping (from database)
  const utilityTypeIds = {
    'Electricity': 1,
    'Water': 2,
    'Gas': 3,
    'Sewage': 4,
    'Street Lighting': 5
  };

  // Tariff plan options based on utility
  const tariffPlanOptions = {
    'Electricity': [
      'Residential Electricity Standard',
      'Commercial Electricity Rate',
      'Industrial Electricity Rate',
      'Government Electricity Rate'
    ],
    'Water': [
      'Residential Water Standard',
      'Commercial Water Rate',
      'Industrial Water Rate',
      'Government Water Rate'
    ],
    'Gas': [
      'Residential Gas Standard',
      'Commercial Gas Rate'
    ],
    'Sewage': [
      'Residential Sewage Standard',
      'Commercial Sewage Rate'
    ],
    'Street Lighting': [
      'Street Lighting Standard'
    ]
  };

  useEffect(() => {
    if (mode === 'edit' && connection) {
      setFormData({
        customer_id: connection.customer_id,
        customer_name: connection.customer_name,
        utility_type_id: connection.utility_type_id,
        utility_type: connection.utility_name || connection.utility_type,
        connection_number: connection.connection_number,
        connection_date: connection.connection_date,
        property_address: connection.property_address,
        meter_number: connection.meter_number || '',
        meter_type: connection.meter_type || 'Digital',
        initial_reading: '',
        tariff_id: connection.tariff_id || '',
        tariff_plan: connection.tariff_name || connection.tariff_plan || '',
        connection_status: connection.connection_status,
        notes: connection.notes || ''
      });
    }
  }, [mode, connection]);

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

    // Reset tariff when utility changes and set utility_type_id
    if (name === 'utility_type') {
      setFormData(prev => ({
        ...prev,
        utility_type_id: utilityTypeIds[value],
        tariff_plan: '',
        tariff_id: ''
      }));
    }
  };

  const handleCustomerSelect = (e) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find(c => c.customer_id === customerId);
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      customer_name: customer ? `${customer.first_name} ${customer.last_name}` : ''
    }));
    if (errors.customer_id) {
      setErrors(prev => ({ ...prev, customer_id: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.customer_id) {
        newErrors.customer_id = 'Please select a customer';
      }
    }

    if (step === 2) {
      if (!formData.connection_number.trim()) {
        newErrors.connection_number = 'Connection number is required';
      }
      if (!formData.connection_date) {
        newErrors.connection_date = 'Connection date is required';
      }
      if (!formData.property_address.trim()) {
        newErrors.property_address = 'Property address is required';
      }
    }

    if (step === 3) {
      if (!formData.meter_number || !formData.meter_number.trim()) {
        newErrors.meter_number = 'Meter number is required';
      }
      if (!formData.meter_type || !formData.meter_type.trim()) {
        newErrors.meter_type = 'Meter type is required';
      }
      if (mode === 'add' && !formData.initial_reading) {
        newErrors.initial_reading = 'Initial reading is required';
      }
    }

    if (step === 4) {
      if (!formData.tariff_plan) {
        newErrors.tariff_plan = 'Tariff plan is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Current step:', currentStep);
    console.log('Form data:', formData);
    const isValid = validateStep(currentStep);
    console.log('Step validation result:', isValid);
    if (isValid) {
      const nextStep = Math.min(currentStep + 1, 4);
      console.log('Moving to step:', nextStep);
      setCurrentStep(nextStep);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  const handlePrevious = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called, current step:', currentStep);
    
    if (currentStep !== 4) {
      console.log('Prevented submit - not on step 4');
      return;
    }
    
    if (validateStep(4)) {
      setIsSubmitting(true);
      
      try {
        if (mode === 'add') {
          // Create new connection
          await connectionApi.create(formData);
          toast.success('Connection created successfully!');
        } else {
          // Update existing connection
          await connectionApi.update(connection.connection_id, formData);
          toast.success('Connection updated successfully!');
        }
        
        onSave(); // Trigger parent refresh
      } catch (error) {
        console.error('Error saving connection:', error);
        toast.error(error.message || 'Failed to save connection');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const steps = [
    { number: 1, title: 'Customer' },
    { number: 2, title: 'Connection' },
    { number: 3, title: 'Meter' },
    { number: 4, title: 'Tariff & Status' }
  ];

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sidepanel-header">
          <div>
            <h2 className="sidepanel-title">
              {mode === 'add' ? 'Add New Connection' : 'Edit Connection'}
            </h2>
            <p className="sidepanel-subtitle">Step {currentStep} of 4: {steps[currentStep - 1].title}</p>
          </div>
          <button className="sidepanel-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {steps.map(step => (
            <div
              key={step.number}
              className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && currentStep < 4) {
            e.preventDefault();
            console.log('Enter key pressed, preventing default submission');
          }
        }}>
          <div className="sidepanel-body">
            {/* Step 1: Customer Selection */}
            {currentStep === 1 && (
              <div className="form-step">
                <h3 className="step-heading">Select Customer</h3>
                <div className="form-field">
                  <label className="form-label">
                    Customer <span className="required">*</span>
                  </label>
                  <select
                    name="customer_id"
                    className={`form-input ${errors.customer_id ? 'error' : ''}`}
                    value={formData.customer_id}
                    onChange={handleCustomerSelect}
                    disabled={loadingCustomers}
                  >
                    <option value="">
                      {loadingCustomers ? 'Loading customers...' : 'Select a customer'}
                    </option>
                    {customers.map(customer => (
                      <option key={customer.customer_id} value={customer.customer_id}>
                        {customer.first_name} {customer.last_name} - {customer.customer_type}
                      </option>
                    ))}
                  </select>
                  {errors.customer_id && <span className="error-message">{errors.customer_id}</span>}
                </div>
              </div>
            )}

            {/* Step 2: Connection Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <h3 className="step-heading">Connection Details</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">
                      Utility Type <span className="required">*</span>
                    </label>
                    <select
                      name="utility_type"
                      className="form-input"
                      value={formData.utility_type}
                      onChange={handleChange}
                    >
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Gas">Gas</option>
                      <option value="Sewage">Sewage</option>
                      <option value="Street Lighting">Street Lighting</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Connection Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="connection_number"
                      className={`form-input ${errors.connection_number ? 'error' : ''}`}
                      value={formData.connection_number}
                      onChange={handleChange}
                      placeholder="e.g., CONN-2024-001"
                    />
                    {errors.connection_number && <span className="error-message">{errors.connection_number}</span>}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Connection Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="connection_date"
                      className={`form-input ${errors.connection_date ? 'error' : ''}`}
                      value={formData.connection_date}
                      onChange={handleChange}
                      placeholder="YYYY-MM-DD"
                    />
                    {errors.connection_date && <span className="error-message">{errors.connection_date}</span>}
                  </div>

                  <div className="form-field full-width">
                    <label className="form-label">
                      Property Address <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="property_address"
                      className={`form-input ${errors.property_address ? 'error' : ''}`}
                      value={formData.property_address}
                      onChange={handleChange}
                      placeholder="Enter property address"
                    />
                    {errors.property_address && <span className="error-message">{errors.property_address}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Meter Details */}
            {currentStep === 3 && (
              <div className="form-step">
                <h3 className="step-heading">Meter Information</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">
                      Meter Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="meter_number"
                      className={`form-input ${errors.meter_number ? 'error' : ''}`}
                      value={formData.meter_number}
                      onChange={handleChange}
                      placeholder="e.g., MTR-12345"
                    />
                    {errors.meter_number && <span className="error-message">{errors.meter_number}</span>}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Meter Type <span className="required">*</span>
                    </label>
                    <select
                      name="meter_type"
                      className={`form-input ${errors.meter_type ? 'error' : ''}`}
                      value={formData.meter_type}
                      onChange={handleChange}
                    >
                      <option value="">Select meter type</option>
                      <option value="Digital">Digital</option>
                      <option value="Analog">Analog</option>
                      <option value="Smart Meter">Smart Meter</option>
                    </select>
                    {errors.meter_type && <span className="error-message">{errors.meter_type}</span>}
                  </div>

                  {mode === 'add' && (
                    <div className="form-field">
                      <label className="form-label">
                        Initial Reading <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="initial_reading"
                        className={`form-input ${errors.initial_reading ? 'error' : ''}`}
                        value={formData.initial_reading}
                        onChange={handleChange}
                        placeholder="Enter initial reading"
                        step="0.01"
                      />
                      {errors.initial_reading && <span className="error-message">{errors.initial_reading}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Tariff & Status */}
            {currentStep === 4 && (
              <div className="form-step">
                <h3 className="step-heading">Tariff Plan & Status</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">
                      Tariff Plan <span className="required">*</span>
                    </label>
                    <select
                      name="tariff_plan"
                      className={`form-input ${errors.tariff_plan ? 'error' : ''}`}
                      value={formData.tariff_plan}
                      onChange={handleChange}
                    >
                      <option value="">Select tariff plan</option>
                      {formData.utility_type && tariffPlanOptions[formData.utility_type] && tariffPlanOptions[formData.utility_type].map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                    {errors.tariff_plan && <span className="error-message">{errors.tariff_plan}</span>}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Connection Status</label>
                    <select
                      name="connection_status"
                      className="form-input"
                      value={formData.connection_status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Disconnected">Disconnected</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div className="form-field full-width">
                    <label className="form-label">Notes</label>
                    <textarea
                      name="notes"
                      className="form-textarea"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Add any additional notes (optional)"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sidepanel-footer">
            <div className="footer-actions">
              {currentStep > 1 && (
                <Button variant="secondary" size="md" type="button" onClick={handlePrevious}>
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </Button>
              )}
              {currentStep < 4 ? (
                <Button variant="primary" size="md" type="button" onClick={handleNext}>
                  <span>Next</span>
                  <ChevronRight size={20} />
                </Button>
              ) : (
                <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                  {isSubmitting 
                    ? (mode === 'add' ? 'Creating...' : 'Updating...') 
                    : (mode === 'add' ? 'Create Connection' : 'Update Connection')
                  }
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionForm;
