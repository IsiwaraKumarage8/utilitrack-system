import { useState, useEffect } from 'react';
import billingApi from '../../api/billingApi';
import toast from 'react-hot-toast';
import { X, FileText, User, Calendar, DollarSign, Calculator } from 'lucide-react';
import Button from '../../components/common/Button';
import './GenerateBillModal.css';

const GenerateBillModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [unprocessedReadings, setUnprocessedReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [billPreview, setBillPreview] = useState(null);
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchUnprocessedReadings();
      setStep(1);
      setSelectedReading(null);
      setBillPreview(null);
    }
  }, [isOpen, utilityFilter]);

  const fetchUnprocessedReadings = async () => {
    try {
      setLoading(true);
      const response = await billingApi.getUnprocessedReadings(utilityFilter);
      setUnprocessedReadings(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching readings:', error);
      toast.error(error.response?.data?.message || 'Failed to load meter readings. Please ensure backend is running.');
      setUnprocessedReadings([]);
      setLoading(false);
    }
  };

  const handleReadingSelect = async (reading) => {
    try {
      setSelectedReading(reading);
      setLoading(true);

      const response = await billingApi.getBillPreview(reading.reading_id);
      setBillPreview(response.data);
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching preview:', error);
      toast.error(error.response?.data?.message || 'Failed to load bill preview. Reading may not exist or bill already generated.');
      setSelectedReading(null);
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    try {
      setGenerating(true);

      const response = await billingApi.generateBill(
        selectedReading.reading_id,
        dueDate
      );

      toast.success('✓ Bill generated successfully!');
      
      onClose();
      onSuccess();
      
      setTimeout(() => {
        if (window.confirm('Bill generated! Would you like to view the bill details?')) {
          console.log('Navigate to bill:', response.data);
        }
      }, 500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate bill';
      toast.error(errorMessage);
      
      // Show more detailed error in console for debugging
      if (error.response) {
        console.error('Response error:', error.response.data);
      }
      toast.error(error.response?.data?.message || 'Failed to generate bill');
    } finally {
      setGenerating(false);
    }
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

  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getUtilityIcon = (utilityType) => {
    switch(utilityType) {
      case 'Electricity': return '⚡';
      case 'Water': return '💧';
      case 'Gas': return '🔥';
      default: return '📊';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-container generate-bill-sidepanel" onClick={(e) => e.stopPropagation()}>
        
        <div className="sidepanel-header">
          <div className="sidepanel-header-content">
            <FileText className="sidepanel-icon" size={24} />
            <div>
              <h2>Generate Bill</h2>
              <p className="sidepanel-subtitle">
                {step === 1 ? 'Select a meter reading to generate bill' : 'Review and confirm bill details'}
              </p>
            </div>
          </div>
          <button className="sidepanel-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Select Reading</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Confirm & Generate</span>
          </div>
        </div>

        <div className="sidepanel-body">
          
          {step === 1 && (
            <div className="step-content">
              
              <div className="filter-section">
                <label>Filter by Utility Type:</label>
                <div className="utility-filter-tabs">
                  {['All', 'Electricity', 'Water', 'Gas'].map(type => (
                    <button
                      key={type}
                      className={`filter-tab ${utilityFilter === type ? 'active' : ''}`}
                      onClick={() => setUtilityFilter(type)}
                    >
                      {type !== 'All' && getUtilityIcon(type)} {type}
                    </button>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading meter readings...</p>
                </div>
              )}

              {!loading && unprocessedReadings.length === 0 && (
                <div className="empty-state">
                  <FileText size={48} color="#9CA3AF" />
                  <p>No unprocessed meter readings found</p>
                  <small>All recent readings have been billed</small>
                </div>
              )}

              {!loading && unprocessedReadings.length > 0 && (
                <div className="readings-list">
                  {unprocessedReadings.map((reading) => (
                    <div
                      key={reading.reading_id}
                      className="reading-card"
                      onClick={() => handleReadingSelect(reading)}
                    >
                      <div className="reading-card-header">
                        <div className="utility-badge">
                          <span className="utility-icon">{getUtilityIcon(reading.utility_type)}</span>
                          <span>{reading.utility_type}</span>
                        </div>
                        <span className="reading-date">{formatDate(reading.reading_date)}</span>
                      </div>
                      
                      <div className="reading-card-body">
                        <div className="customer-info">
                          <User size={16} />
                          <span className="customer-name">{reading.customer_name}</span>
                          <span className="customer-type-badge">{reading.customer_type}</span>
                        </div>
                        
                        <div className="meter-info">
                          <span className="meter-number">{reading.meter_number}</span>
                          <span className="connection-number">{reading.connection_number}</span>
                        </div>
                        
                        <div className="consumption-display">
                          <Calculator size={16} />
                          <span className="consumption-value">
                            {reading.consumption} {reading.unit_of_measurement}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && billPreview && (
            <div className="step-content preview-step">
              
              <div className="preview-section">
                <h3>Customer & Connection Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Customer</label>
                    <div className="detail-value">
                      <User size={16} />
                      <span>{billPreview.customer_name}</span>
                      <span className="badge badge-small">{billPreview.customer_type}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <label>Utility Type</label>
                    <div className="detail-value">
                      <span className="utility-icon-large">{getUtilityIcon(billPreview.utility_type)}</span>
                      <span>{billPreview.utility_type}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <label>Connection Number</label>
                    <div className="detail-value">{billPreview.connection_number}</div>
                  </div>
                  
                  <div className="detail-item">
                    <label>Meter Number</label>
                    <div className="detail-value">{billPreview.meter_number}</div>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h3>Billing Period</h3>
                <div className="billing-period">
                  <Calendar size={20} />
                  <span>
                    {formatDate(billPreview.period_start)} - {formatDate(billPreview.period_end)}
                  </span>
                  <span className="period-days">
                    ({Math.ceil((new Date(billPreview.period_end) - new Date(billPreview.period_start)) / (1000 * 60 * 60 * 24))} days)
                  </span>
                </div>
              </div>

              <div className="preview-section">
                <h3>Consumption</h3>
                <div className="consumption-breakdown">
                  <div className="consumption-row">
                    <span>Previous Reading:</span>
                    <span>{billPreview.previous_reading} {billPreview.unit_of_measurement}</span>
                  </div>
                  <div className="consumption-row">
                    <span>Current Reading:</span>
                    <span>{billPreview.current_reading} {billPreview.unit_of_measurement}</span>
                  </div>
                  <div className="consumption-row total">
                    <span>Total Consumption:</span>
                    <span className="consumption-total">
                      {billPreview.consumption} {billPreview.unit_of_measurement}
                    </span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h3>Tariff Applied</h3>
                <div className="tariff-info">
                  <div className="tariff-name">{billPreview.tariff_name}</div>
                  <div className="tariff-details">
                    <div className="tariff-rate">
                      <span>Rate per Unit:</span>
                      <span>{formatCurrency(billPreview.rate_per_unit)}</span>
                    </div>
                    <div className="tariff-rate">
                      <span>Fixed Charge:</span>
                      <span>{formatCurrency(billPreview.fixed_charge)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="preview-section calculation-section">
                <h3>Calculation Breakdown</h3>
                <div className="calculation-table">
                  <div className="calc-row">
                    <span className="calc-label">Consumption Charge:</span>
                    <span className="calc-formula">
                      {billPreview.consumption} × {formatCurrency(billPreview.rate_per_unit)}
                    </span>
                    <span className="calc-amount">{formatCurrency(billPreview.consumption_charge)}</span>
                  </div>
                  
                  <div className="calc-row">
                    <span className="calc-label">Fixed Charge:</span>
                    <span className="calc-formula"></span>
                    <span className="calc-amount">{formatCurrency(billPreview.fixed_charge)}</span>
                  </div>
                  
                  <div className="calc-divider"></div>
                  
                  <div className="calc-row total-row">
                    <span className="calc-label">TOTAL AMOUNT:</span>
                    <span className="calc-formula"></span>
                    <span className="calc-total">{formatCurrency(billPreview.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h3>Due Date</h3>
                <div className="due-date-input">
                  <Calendar size={20} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <small>Default: 30 days from today</small>
                </div>
              </div>

            </div>
          )}

        </div>

        <div className="sidepanel-footer">
          {step === 1 && (
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}
          
          {step === 2 && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setStep(1);
                  setSelectedReading(null);
                  setBillPreview(null);
                }}
                disabled={generating}
              >
                ← Back
              </Button>
              
              <Button 
                variant="primary" 
                onClick={handleGenerateBill}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <div className="btn-spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Generate Bill
                  </>
                )}
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default GenerateBillModal;
