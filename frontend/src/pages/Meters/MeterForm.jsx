import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../components/common/Button';
import './MeterForm.css';

// Mock connections data - TODO: Replace with API call
const MOCK_CONNECTIONS = [
  { connection_id: 1, connection_number: 'ELEC-2020-001', customer_name: 'Nuwan Bandara', utility_type: 'Electricity' },
  { connection_id: 2, connection_number: 'WATER-2020-001', customer_name: 'Nuwan Bandara', utility_type: 'Water' },
  { connection_id: 3, connection_number: 'ELEC-2020-003', customer_name: 'Samantha Silva', utility_type: 'Electricity' },
  { connection_id: 4, connection_number: 'GAS-2023-001', customer_name: 'Samantha Silva', utility_type: 'Gas' },
  { connection_id: 5, connection_number: 'ELEC-2020-005', customer_name: 'Rajesh Kumar', utility_type: 'Electricity' },
  { connection_id: 6, connection_number: 'WATER-2020-003', customer_name: 'Samantha Silva', utility_type: 'Water' },
  { connection_id: 7, connection_number: 'ELEC-2020-007', customer_name: 'Priya Perera', utility_type: 'Electricity' },
  { connection_id: 8, connection_number: 'WATER-2020-005', customer_name: 'Rajesh Kumar', utility_type: 'Water' }
];

const MeterForm = ({ mode, meter, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    connection_id: '',
    meter_number: '',
    meter_type: 'Digital',
    manufacturer: '',
    installation_date: new Date().toISOString().split('T')[0],
    initial_reading: '0.00',
    meter_status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedConnection, setSelectedConnection] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && meter) {
      setFormData({
        connection_id: meter.connection_id,
        meter_number: meter.meter_number,
        meter_type: meter.meter_type,
        manufacturer: meter.manufacturer || '',
        installation_date: meter.installation_date,
        initial_reading: meter.initial_reading.toFixed(2),
        meter_status: meter.meter_status,
        notes: meter.notes || ''
      });

      const connection = MOCK_CONNECTIONS.find(c => c.connection_id === meter.connection_id);
      setSelectedConnection(connection);
    }
  }, [mode, meter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update selected connection when connection_id changes
    if (name === 'connection_id') {
      const connection = MOCK_CONNECTIONS.find(c => c.connection_id === parseInt(value));
      setSelectedConnection(connection);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.connection_id) {
      newErrors.connection_id = 'Connection is required';
    }

    if (!formData.meter_number.trim()) {
      newErrors.meter_number = 'Meter number is required';
    } else if (formData.meter_number.length < 5) {
      newErrors.meter_number = 'Meter number must be at least 5 characters';
    }

    if (!formData.meter_type) {
      newErrors.meter_type = 'Meter type is required';
    }

    if (!formData.installation_date) {
      newErrors.installation_date = 'Installation date is required';
    }

    const initialReading = parseFloat(formData.initial_reading);
    if (isNaN(initialReading) || initialReading < 0) {
      newErrors.initial_reading = 'Initial reading must be a valid positive number';
    }

    if (!formData.meter_status) {
      newErrors.meter_status = 'Meter status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Make API call to POST /api/meters or PUT /api/meters/:id
      const meterData = {
        ...formData,
        connection_id: parseInt(formData.connection_id),
        initial_reading: parseFloat(formData.initial_reading)
      };

      if (mode === 'edit') {
        meterData.meter_id = meter.meter_id;
      }

      console.log('Submitting meter:', meterData);
      onSave(meterData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container meter-form-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {mode === 'add' ? 'Register New Meter' : 'Edit Meter'}
            </h2>
            <p className="modal-subtitle">
              {mode === 'add' 
                ? 'Add a new utility meter to the system' 
                : `Editing ${meter?.meter_number}`}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Connection Selection */}
            <div className="form-group">
              <label className="form-label required">Service Connection</label>
              <select
                name="connection_id"
                value={formData.connection_id}
                onChange={handleChange}
                className={`form-input ${errors.connection_id ? 'error' : ''}`}
                disabled={mode === 'edit'}
              >
                <option value="">Select a service connection</option>
                {MOCK_CONNECTIONS.map(connection => (
                  <option key={connection.connection_id} value={connection.connection_id}>
                    {connection.connection_number} - {connection.customer_name} ({connection.utility_type})
                  </option>
                ))}
              </select>
              {errors.connection_id && (
                <span className="error-message">{errors.connection_id}</span>
              )}
              {selectedConnection && (
                <div className="connection-info">
                  <span className="info-badge">
                    {selectedConnection.utility_type} connection for {selectedConnection.customer_name}
                  </span>
                </div>
              )}
            </div>

            {/* Meter Details */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Meter Number</label>
                <input
                  type="text"
                  name="meter_number"
                  value={formData.meter_number}
                  onChange={handleChange}
                  placeholder="e.g., MTR-ELEC-2024-00001"
                  className={`form-input ${errors.meter_number ? 'error' : ''}`}
                />
                {errors.meter_number && (
                  <span className="error-message">{errors.meter_number}</span>
                )}
                <span className="input-hint">Unique identifier for the meter</span>
              </div>

              <div className="form-group">
                <label className="form-label required">Meter Type</label>
                <select
                  name="meter_type"
                  value={formData.meter_type}
                  onChange={handleChange}
                  className={`form-input ${errors.meter_type ? 'error' : ''}`}
                >
                  <option value="Digital">Digital</option>
                  <option value="Analog">Analog</option>
                  <option value="Smart Meter">Smart Meter</option>
                </select>
                {errors.meter_type && (
                  <span className="error-message">{errors.meter_type}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Siemens, ABB, Landis+Gyr"
                  className="form-input"
                />
                <span className="input-hint">Optional</span>
              </div>

              <div className="form-group">
                <label className="form-label required">Installation Date</label>
                <input
                  type="date"
                  name="installation_date"
                  value={formData.installation_date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`form-input ${errors.installation_date ? 'error' : ''}`}
                />
                {errors.installation_date && (
                  <span className="error-message">{errors.installation_date}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Initial Reading</label>
                <input
                  type="number"
                  name="initial_reading"
                  value={formData.initial_reading}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.initial_reading ? 'error' : ''}`}
                />
                {errors.initial_reading && (
                  <span className="error-message">{errors.initial_reading}</span>
                )}
                <span className="input-hint">Starting meter reading (kWh)</span>
              </div>

              <div className="form-group">
                <label className="form-label required">Meter Status</label>
                <select
                  name="meter_status"
                  value={formData.meter_status}
                  onChange={handleChange}
                  className={`form-input ${errors.meter_status ? 'error' : ''}`}
                >
                  <option value="Active">Active</option>
                  <option value="Faulty">Faulty</option>
                  <option value="Replaced">Replaced</option>
                  <option value="Removed">Removed</option>
                </select>
                {errors.meter_status && (
                  <span className="error-message">{errors.meter_status}</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional notes or comments about this meter..."
                className="form-textarea"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {mode === 'add' ? 'Register Meter' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeterForm;
