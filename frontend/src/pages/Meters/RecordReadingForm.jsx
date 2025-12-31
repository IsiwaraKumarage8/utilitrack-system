import { useState, useEffect } from 'react';
import { X, Calendar, Activity, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import meterApi from '../../api/meterApi';
import './RecordReadingForm.css';

const RecordReadingForm = ({ meter, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    current_reading: '',
    previous_reading: '',
    consumption: '',
    reading_type: 'Actual',
    reader_name: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loadingPrevious, setLoadingPrevious] = useState(true);

  // Fetch previous reading from API
  useEffect(() => {
    const fetchLastReading = async () => {
      if (meter && meter.meter_id) {
        try {
          setLoadingPrevious(true);
          const response = await meterApi.getLastReading(meter.meter_id);
          if (response && response.success && response.data) {
            setFormData(prev => ({
              ...prev,
              previous_reading: response.data.current_reading?.toFixed(2) || '0.00',
              reader_name: 'Current User'
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              previous_reading: meter.initial_reading?.toFixed(2) || '0.00',
              reader_name: 'Current User'
            }));
          }
        } catch (err) {
          console.error('Error fetching last reading:', err);
          setFormData(prev => ({
            ...prev,
            previous_reading: meter.initial_reading?.toFixed(2) || '0.00',
            reader_name: 'Current User'
          }));
        } finally {
          setLoadingPrevious(false);
        }
      }
    };
    fetchLastReading();
  }, [meter]);

  // Calculate consumption when current reading changes
  useEffect(() => {
    if (formData.current_reading && formData.previous_reading) {
      const current = parseFloat(formData.current_reading);
      const previous = parseFloat(formData.previous_reading);
      
      if (!isNaN(current) && !isNaN(previous)) {
        const consumption = current - previous;
        setFormData(prev => ({
          ...prev,
          consumption: consumption.toFixed(2)
        }));
      }
    }
  }, [formData.current_reading, formData.previous_reading]);

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

    if (!formData.reading_date) {
      newErrors.reading_date = 'Reading date is required';
    }

    if (!formData.current_reading) {
      newErrors.current_reading = 'Current reading is required';
    } else {
      const current = parseFloat(formData.current_reading);
      const previous = parseFloat(formData.previous_reading);

      if (isNaN(current) || current < 0) {
        newErrors.current_reading = 'Invalid reading value';
      } else if (current < previous) {
        newErrors.current_reading = 'Current reading cannot be less than previous reading';
      } else if (current === previous) {
        newErrors.current_reading = 'Current reading must be different from previous reading';
      }
    }

    if (!formData.reading_type) {
      newErrors.reading_type = 'Reading type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Make API call to POST /api/meter-readings
      const readingData = {
        meter_id: meter.meter_id,
        reading_date: formData.reading_date,
        previous_reading: parseFloat(formData.previous_reading),
        current_reading: parseFloat(formData.current_reading),
        consumption: parseFloat(formData.consumption),
        reading_type: formData.reading_type,
        reader_id: 1, // TODO: Get from auth context
        notes: formData.notes
      };

      console.log('Submitting reading:', readingData);
      onSave(readingData);
    }
  };

  if (!meter) return null;

  const isConsumptionHigh = parseFloat(formData.consumption) > 200;
  const isConsumptionLow = parseFloat(formData.consumption) < 50 && formData.consumption !== '';

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sidepanel-header">
          <div>
            <h2 className="sidepanel-title">Record Meter Reading</h2>
            <p className="sidepanel-subtitle">{meter.meter_number}</p>
          </div>
          <button className="sidepanel-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="sidepanel-body">
            {/* Meter Information (Read-only) */}
            <div className="info-section">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Meter Number</span>
                  <span className="info-value">{meter.meter_number}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Customer Name</span>
                  <span className="info-value">{meter.customer_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Utility Type</span>
                  <span className="info-value">{meter.utility_type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Meter Type</span>
                  <span className="info-value">{meter.meter_type}</span>
                </div>
              </div>
            </div>

            {/* Reading Form */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Reading Date</label>
                  <div className="input-with-icon">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      name="reading_date"
                      value={formData.reading_date}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`form-input ${errors.reading_date ? 'error' : ''}`}
                    />
                  </div>
                  {errors.reading_date && (
                    <span className="error-message">{errors.reading_date}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Reading Type</label>
                  <select
                    name="reading_type"
                    value={formData.reading_type}
                    onChange={handleChange}
                    className={`form-input ${errors.reading_type ? 'error' : ''}`}
                  >
                    <option value="Actual">Actual</option>
                    <option value="Estimated">Estimated</option>
                    <option value="Customer-Submitted">Customer-Submitted</option>
                  </select>
                  {errors.reading_type && (
                    <span className="error-message">{errors.reading_type}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Previous Reading</label>
                  <input
                    type="text"
                    name="previous_reading"
                    value={formData.previous_reading}
                    readOnly
                    className="form-input readonly"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Current Reading</label>
                  <div className="input-with-icon">
                    <Activity size={18} className="input-icon" />
                    <input
                      type="number"
                      name="current_reading"
                      value={formData.current_reading}
                      onChange={handleChange}
                      step="0.01"
                      min={formData.previous_reading}
                      placeholder="Enter current meter reading"
                      className={`form-input ${errors.current_reading ? 'error' : ''}`}
                    />
                  </div>
                  {errors.current_reading && (
                    <span className="error-message">{errors.current_reading}</span>
                  )}
                </div>
              </div>

              {/* Consumption Display */}
              {formData.consumption && (
                <div className={`consumption-display ${isConsumptionHigh ? 'high' : isConsumptionLow ? 'low' : 'normal'}`}>
                  <div className="consumption-header">
                    <span className="consumption-label">Calculated Consumption</span>
                    {(isConsumptionHigh || isConsumptionLow) && (
                      <AlertCircle size={18} />
                    )}
                  </div>
                  <div className="consumption-value">
                    {formData.consumption} kWh
                  </div>
                  {isConsumptionHigh && (
                    <p className="consumption-warning">
                      Warning: Consumption is significantly higher than average
                    </p>
                  )}
                  {isConsumptionLow && (
                    <p className="consumption-warning">
                      Note: Consumption is lower than typical usage
                    </p>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Reader Name</label>
                <input
                  type="text"
                  name="reader_name"
                  value={formData.reader_name}
                  readOnly
                  className="form-input readonly"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add any notes or observations about this reading..."
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sidepanel-footer">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Record Reading
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordReadingForm;
