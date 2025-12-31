import { useState, useEffect } from 'react';
import { X, Activity, Calendar, User, CheckCircle, TrendingUp, AlertCircle, Zap, Droplet, Flame } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './RecordReadingModal.css';

// Mock meters data - TODO: Replace with API call
const MOCK_METERS = [
  {
    meter_id: 1,
    meter_number: 'MTR-ELEC-2020-00001',
    meter_type: 'Digital',
    meter_status: 'Active',
    connection_id: 1,
    connection_number: 'ELEC-2020-001',
    customer_id: 1,
    customer_name: 'Nuwan Bandara',
    customer_type: 'Residential',
    utility_type_id: 1,
    utility_type: 'Electricity',
    unit_of_measurement: 'kWh',
    last_reading: {
      reading_date: '2024-11-30',
      current_reading: 560.00,
      consumption: 134.25
    }
  },
  {
    meter_id: 2,
    meter_number: 'MTR-WATER-2020-00001',
    meter_type: 'Analog',
    meter_status: 'Active',
    connection_id: 2,
    connection_number: 'WATER-2020-001',
    customer_id: 1,
    customer_name: 'Nuwan Bandara',
    customer_type: 'Residential',
    utility_type_id: 2,
    utility_type: 'Water',
    unit_of_measurement: 'Cubic Meters',
    last_reading: {
      reading_date: '2024-12-01',
      current_reading: 45.50,
      consumption: 8.25
    }
  },
  {
    meter_id: 3,
    meter_number: 'MTR-ELEC-2021-00015',
    meter_type: 'Smart Meter',
    meter_status: 'Active',
    connection_id: 3,
    connection_number: 'ELEC-2021-015',
    customer_id: 5,
    customer_name: 'Saman Silva',
    customer_type: 'Commercial',
    utility_type_id: 1,
    utility_type: 'Electricity',
    unit_of_measurement: 'kWh',
    last_reading: {
      reading_date: '2024-11-15',
      current_reading: 2450.00,
      consumption: 280.50
    }
  },
  {
    meter_id: 4,
    meter_number: 'MTR-GAS-2022-00008',
    meter_type: 'Industrial Meter',
    meter_status: 'Active',
    connection_id: 4,
    connection_number: 'GAS-2022-008',
    customer_id: 8,
    customer_name: 'ABC Industries',
    customer_type: 'Industrial',
    utility_type_id: 3,
    utility_type: 'Gas',
    unit_of_measurement: 'Cubic Meters',
    last_reading: {
      reading_date: '2024-11-28',
      current_reading: 150.00,
      consumption: 25.00
    }
  }
];

const RecordReadingModal = ({ onClose, onSave }) => {
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [formData, setFormData] = useState({
    meter_id: null,
    reading_date: new Date().toISOString().split('T')[0],
    current_reading: '',
    previous_reading: 0,
    consumption: 0,
    reading_type: 'Actual',
    reader_id: 1, // TODO: Get from auth context
    reader_name: 'Current User', // TODO: Get from auth context
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMeterDropdown, setShowMeterDropdown] = useState(false);

  // Filter and search meters
  const filteredMeters = MOCK_METERS.filter(meter => {
    const matchesUtility = utilityFilter === 'All' || meter.utility_type === utilityFilter;
    const matchesSearch = 
      meter.meter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meter.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meter.connection_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUtility && matchesSearch;
  });

  // When meter is selected
  const handleMeterSelect = (meter) => {
    setSelectedMeter(meter);
    setSearchQuery('');
    setShowMeterDropdown(false);
    setFormData(prev => ({
      ...prev,
      meter_id: meter.meter_id,
      previous_reading: meter.last_reading?.current_reading || 0
    }));
    // Auto-focus on current reading input
    setTimeout(() => {
      document.getElementById('current_reading')?.focus();
    }, 100);
  };

  // Calculate consumption whenever current reading changes
  useEffect(() => {
    if (formData.current_reading && formData.previous_reading) {
      const consumption = parseFloat(formData.current_reading) - parseFloat(formData.previous_reading);
      setFormData(prev => ({ ...prev, consumption: consumption }));
    }
  }, [formData.current_reading, formData.previous_reading]);

  // Calculate days since last reading
  const getDaysSinceLastReading = () => {
    if (!selectedMeter?.last_reading?.reading_date) return null;
    const lastDate = new Date(selectedMeter.last_reading.reading_date);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get consumption level color
  const getConsumptionColor = () => {
    const consumption = formData.consumption;
    if (!consumption || consumption <= 0) return '';
    
    if (selectedMeter?.utility_type === 'Electricity') {
      if (consumption > 1000) return 'very-high';
      if (consumption > 500) return 'high';
      return 'normal';
    } else {
      if (consumption > 200) return 'very-high';
      if (consumption > 100) return 'high';
      return 'normal';
    }
  };

  // Check for warnings
  const getWarnings = () => {
    const warnings = [];
    const consumption = formData.consumption;
    const avgConsumption = selectedMeter?.last_reading?.consumption || 0;
    const daysSince = getDaysSinceLastReading();

    // High consumption warning
    if (consumption > avgConsumption * 3) {
      warnings.push({
        type: 'danger',
        message: '🚨 Alert: Extremely high consumption detected. Please double-check the meter and reading.'
      });
    } else if (consumption > avgConsumption * 2) {
      warnings.push({
        type: 'warning',
        message: '⚠️ Warning: This reading shows unusually high consumption. Please verify the reading.'
      });
    }

    // Zero consumption warning
    if (consumption === 0 && formData.reading_type === 'Actual' && formData.current_reading) {
      warnings.push({
        type: 'warning',
        message: '⚠️ No consumption detected. Is the meter functioning correctly?'
      });
    }

    // Long gap warning
    if (daysSince > 60) {
      warnings.push({
        type: 'info',
        message: `⚠️ It has been ${daysSince} days since the last reading. Consumption may be higher than normal.`
      });
    }

    return warnings;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedMeter) {
      newErrors.meter = 'Please select a meter';
    }

    if (!formData.reading_date) {
      newErrors.reading_date = 'Reading date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.reading_date > today) {
        newErrors.reading_date = 'Reading date cannot be in the future';
      }
      if (selectedMeter?.last_reading?.reading_date && formData.reading_date < selectedMeter.last_reading.reading_date) {
        newErrors.reading_date = 'Reading date cannot be before previous reading date';
      }
    }

    if (!formData.current_reading) {
      newErrors.current_reading = 'Current reading is required';
    } else {
      const current = parseFloat(formData.current_reading);
      const previous = parseFloat(formData.previous_reading);
      
      if (isNaN(current) || current < 0) {
        newErrors.current_reading = 'Please enter a valid reading';
      } else if (current < previous) {
        newErrors.current_reading = 'Current reading cannot be less than previous reading';
      }
    }

    if (formData.notes.length > 500) {
      newErrors.notes = 'Notes must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/meter-readings', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Submitting reading:', formData);
      
      // Success
      onSave?.(formData);
      onClose();
    } catch (error) {
      console.error('Error saving reading:', error);
      setErrors({ submit: 'Failed to record reading. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUtilityIcon = (utilityType) => {
    switch (utilityType) {
      case 'Electricity': return <Zap size={20} />;
      case 'Water': return <Droplet size={20} />;
      case 'Gas': return <Flame size={20} />;
      default: return <Activity size={20} />;
    }
  };

  const daysSince = getDaysSinceLastReading();
  const warnings = getWarnings();
  const consumptionLevel = getConsumptionColor();

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-content record-reading-sidepanel" onClick={(e) => e.stopPropagation()}>
        {/* Side Panel Header */}
        <div className="sidepanel-header">
          <div className="sidepanel-header-content">
            <Activity className="sidepanel-icon" size={24} />
            <h2 className="sidepanel-title">Record Meter Reading</h2>
          </div>
          <button className="sidepanel-close" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Side Panel Body */}
        <form onSubmit={handleSubmit}>
          <div className="sidepanel-body">
            {/* SECTION 1: SELECT METER */}
            <div className="form-section">
              <label className="section-label">Select Meter *</label>
              
              {/* Utility Filter */}
              <div className="utility-filter">
                <button
                  type="button"
                  className={`filter-btn ${utilityFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setUtilityFilter('All')}
                >
                  All Utilities
                </button>
                <button
                  type="button"
                  className={`filter-btn ${utilityFilter === 'Electricity' ? 'active' : ''}`}
                  onClick={() => setUtilityFilter('Electricity')}
                >
                  <Zap size={16} />
                  Electricity
                </button>
                <button
                  type="button"
                  className={`filter-btn ${utilityFilter === 'Water' ? 'active' : ''}`}
                  onClick={() => setUtilityFilter('Water')}
                >
                  <Droplet size={16} />
                  Water
                </button>
                <button
                  type="button"
                  className={`filter-btn ${utilityFilter === 'Gas' ? 'active' : ''}`}
                  onClick={() => setUtilityFilter('Gas')}
                >
                  <Flame size={16} />
                  Gas
                </button>
              </div>

              {/* Meter Search/Select */}
              <div className="meter-search">
                <input
                  type="text"
                  className={`search-input ${errors.meter ? 'error' : ''}`}
                  placeholder="Search by meter number or customer name..."
                  value={selectedMeter ? `${selectedMeter.meter_number} - ${selectedMeter.customer_name} (${selectedMeter.utility_type})` : searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowMeterDropdown(true);
                    setSelectedMeter(null);
                  }}
                  onFocus={() => setShowMeterDropdown(true)}
                />
                {errors.meter && <span className="error-text">{errors.meter}</span>}

                {/* Dropdown Results */}
                {showMeterDropdown && !selectedMeter && (
                  <div className="meter-dropdown">
                    {filteredMeters.length > 0 ? (
                      filteredMeters.map(meter => (
                        <div
                          key={meter.meter_id}
                          className="meter-option"
                          onClick={() => handleMeterSelect(meter)}
                        >
                          <div className="meter-option-left">
                            {getUtilityIcon(meter.utility_type)}
                            <div>
                              <div className="meter-number">{meter.meter_number}</div>
                              <div className="meter-customer">{meter.customer_name} ({meter.utility_type})</div>
                            </div>
                          </div>
                          <Badge status="success">{meter.meter_status}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="meter-option-empty">No meters found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: METER INFORMATION (shown after meter selected) */}
            {selectedMeter && (
              <>
                <div className="meter-info-card">
                  <div className="meter-info-grid">
                    <div className="meter-info-item">
                      <span className="meter-info-label">Customer Name</span>
                      <span className="meter-info-value">{selectedMeter.customer_name}</span>
                    </div>
                    <div className="meter-info-item">
                      <span className="meter-info-label">Customer Type</span>
                      <Badge status="info">{selectedMeter.customer_type}</Badge>
                    </div>
                    <div className="meter-info-item">
                      <span className="meter-info-label">Utility Type</span>
                      <div className="utility-badge">
                        {getUtilityIcon(selectedMeter.utility_type)}
                        <span>{selectedMeter.utility_type}</span>
                      </div>
                    </div>
                    <div className="meter-info-item">
                      <span className="meter-info-label">Connection Number</span>
                      <span className="meter-info-value">{selectedMeter.connection_number}</span>
                    </div>
                    <div className="meter-info-item">
                      <span className="meter-info-label">Meter Number</span>
                      <span className="meter-info-value">{selectedMeter.meter_number}</span>
                    </div>
                    <div className="meter-info-item">
                      <span className="meter-info-label">Meter Type</span>
                      <span className="meter-info-value">{selectedMeter.meter_type}</span>
                    </div>
                    <div className="meter-info-item">
                      <span className="meter-info-label">Unit of Measurement</span>
                      <span className="meter-info-value">{selectedMeter.unit_of_measurement}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PREVIOUS READING */}
                <div className="previous-reading-card">
                  <h3 className="section-title">Previous Reading</h3>
                  {selectedMeter.last_reading ? (
                    <div className="previous-reading-grid">
                      <div className="previous-reading-item">
                        <span className="previous-reading-label">Previous Reading Date</span>
                        <span className="previous-reading-value">{selectedMeter.last_reading.reading_date}</span>
                      </div>
                      <div className="previous-reading-item">
                        <span className="previous-reading-label">Previous Reading Value</span>
                        <span className="previous-reading-value">
                          {selectedMeter.last_reading.current_reading.toFixed(2)} {selectedMeter.unit_of_measurement}
                        </span>
                      </div>
                      <div className="previous-reading-item">
                        <span className="previous-reading-label">Days Since Last Reading</span>
                        <span className="previous-reading-value">{daysSince} days ago</span>
                      </div>
                    </div>
                  ) : (
                    <div className="no-previous-reading">
                      <AlertCircle size={20} />
                      <span>No previous reading found - This is the first reading for this meter</span>
                    </div>
                  )}
                </div>

                {/* SECTION 4: NEW READING DETAILS */}
                <div className="form-section">
                  <h3 className="section-title">New Reading Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">Reading Date</label>
                      <input
                        type="date"
                        name="reading_date"
                        className={`form-input ${errors.reading_date ? 'error' : ''}`}
                        value={formData.reading_date}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.reading_date && <span className="error-text">{errors.reading_date}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Current Reading</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          id="current_reading"
                          name="current_reading"
                          className={`form-input ${errors.current_reading ? 'error' : ''}`}
                          placeholder="Enter current meter reading"
                          value={formData.current_reading}
                          onChange={handleChange}
                          step="0.01"
                          min={formData.previous_reading}
                        />
                        <span className="input-unit">{selectedMeter.unit_of_measurement}</span>
                      </div>
                      {errors.current_reading && <span className="error-text">{errors.current_reading}</span>}
                    </div>
                  </div>

                  {/* Consumption Display */}
                  {formData.current_reading && (
                    <div className={`consumption-display ${consumptionLevel}`}>
                      <div className="consumption-label">Consumption</div>
                      <div className="consumption-value">
                        {formData.consumption.toFixed(2)} {selectedMeter.unit_of_measurement}
                      </div>
                      <div className="consumption-calculation">
                        {formData.current_reading} - {formData.previous_reading} = {formData.consumption.toFixed(2)}
                      </div>
                    </div>
                  )}

                  {/* Reading Type */}
                  <div className="form-group">
                    <label className="form-label required">Reading Type</label>
                    <div className="reading-type-options">
                      <label className={`reading-type-card ${formData.reading_type === 'Actual' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="reading_type"
                          value="Actual"
                          checked={formData.reading_type === 'Actual'}
                          onChange={handleChange}
                        />
                        <CheckCircle className="type-icon" size={24} />
                        <span className="type-label">Actual</span>
                        <span className="type-description">Physical reading taken from meter</span>
                      </label>

                      <label className={`reading-type-card ${formData.reading_type === 'Estimated' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="reading_type"
                          value="Estimated"
                          checked={formData.reading_type === 'Estimated'}
                          onChange={handleChange}
                        />
                        <TrendingUp className="type-icon" size={24} />
                        <span className="type-label">Estimated</span>
                        <span className="type-description">Estimated based on average consumption</span>
                      </label>

                      <label className={`reading-type-card ${formData.reading_type === 'Customer-Submitted' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="reading_type"
                          value="Customer-Submitted"
                          checked={formData.reading_type === 'Customer-Submitted'}
                          onChange={handleChange}
                        />
                        <User className="type-icon" size={24} />
                        <span className="type-label">Customer-Submitted</span>
                        <span className="type-description">Reading provided by customer</span>
                      </label>
                    </div>
                  </div>

                  {/* Reader Info */}
                  <div className="reader-info">
                    <User size={16} />
                    <span>Recorded by: <strong>{formData.reader_name}</strong></span>
                  </div>

                  {/* Notes */}
                  <div className="form-group">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea
                      name="notes"
                      className={`form-textarea ${errors.notes ? 'error' : ''}`}
                      placeholder="Add any notes or observations (e.g., meter condition, access issues, anomalies)"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      maxLength="500"
                    />
                    <div className="character-counter">{formData.notes.length} / 500 characters</div>
                    {errors.notes && <span className="error-text">{errors.notes}</span>}
                  </div>
                </div>

                {/* SECTION 5: WARNINGS */}
                {warnings.length > 0 && (
                  <div className="warnings-section">
                    {warnings.map((warning, index) => (
                      <div key={index} className={`warning-badge ${warning.type}`}>
                        <AlertCircle size={20} />
                        <span>{warning.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {errors.submit && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{errors.submit}</span>
              </div>
            )}
          </div>

          {/* Side Panel Footer */}
          <div className="sidepanel-footer">
            <Button 
              type="button"
              variant="secondary" 
              size="md" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary" 
              size="md"
              disabled={!selectedMeter || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reading'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordReadingModal;
