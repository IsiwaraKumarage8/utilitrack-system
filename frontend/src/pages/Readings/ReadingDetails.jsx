import { X, Zap, Droplet, Flame, Calendar, User, TrendingUp, FileText, Edit2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './ReadingDetails.css';

// Mock historical readings - TODO: Replace with API call
const getHistoricalReadings = (meterId) => {
  return [
    { date: '2024-11-15', reading: 1450.00, consumption: 130.00 },
    { date: '2024-10-15', reading: 1320.00, consumption: 128.00 },
    { date: '2024-09-15', reading: 1192.00, consumption: 135.00 },
    { date: '2024-08-15', reading: 1057.00, consumption: 142.00 },
    { date: '2024-07-15', reading: 915.00, consumption: 138.00 }
  ];
};

const ReadingDetails = ({ reading, onClose, onEdit }) => {
  if (!reading) return null;

  const historicalReadings = getHistoricalReadings(reading.meter_id);

  const getUtilityIcon = (utilityType) => {
    const icons = {
      'Electricity': <Zap size={20} />,
      'Water': <Droplet size={20} />,
      'Gas': <Flame size={20} />
    };
    return icons[utilityType] || <Zap size={20} />;
  };

  const getUtilityColor = (utilityType) => {
    const colors = {
      'Electricity': 'electricity',
      'Water': 'water',
      'Gas': 'gas'
    };
    return colors[utilityType] || 'electricity';
  };

  const getReadingTypeVariant = (type) => {
    const variants = {
      'Actual': 'success',
      'Estimated': 'warning',
      'Customer-Submitted': 'primary'
    };
    return variants[type] || 'secondary';
  };

  const consumptionChange = reading.consumption - (historicalReadings[0]?.consumption || reading.consumption);
  const consumptionChangePercent = historicalReadings[0]?.consumption 
    ? ((consumptionChange / historicalReadings[0].consumption) * 100).toFixed(1)
    : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-container reading-details-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Reading Details</h2>
            <p className="modal-subtitle">{reading.meter_number}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body reading-details-body">
          {/* Left Column - Reading Information */}
          <div className="details-left">
            {/* Reading Information */}
            <div className="detail-section">
              <h3 className="section-title">Reading Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Reading Date</span>
                  <span className="detail-value">
                    <Calendar size={16} className="detail-icon" />
                    {new Date(reading.reading_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reading Type</span>
                  <Badge variant={getReadingTypeVariant(reading.reading_type)} text={reading.reading_type} />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Meter Number</span>
                  <span className="detail-value meter-number">{reading.meter_number}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Utility Type</span>
                  <div className={`utility-badge ${getUtilityColor(reading.utility_type)}`}>
                    {getUtilityIcon(reading.utility_type)}
                    <span>{reading.utility_type}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Customer Name</span>
                  <span className="detail-value">{reading.customer_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Connection Number</span>
                  <span className="detail-value">{reading.connection_number}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reader Name</span>
                  <span className="detail-value">
                    <User size={16} className="detail-icon" />
                    {reading.reader_name}
                  </span>
                </div>
              </div>
              {reading.notes && (
                <div className="detail-notes">
                  <span className="detail-label">Notes</span>
                  <p className="notes-text">{reading.notes}</p>
                </div>
              )}
            </div>

            {/* Before/After Comparison */}
            <div className="detail-section">
              <h3 className="section-title">Reading Comparison</h3>
              <div className="comparison-grid">
                <div className="comparison-card before">
                  <span className="comparison-label">Previous Reading</span>
                  <span className="comparison-value">{reading.previous_reading.toFixed(2)}</span>
                  <span className="comparison-unit">kWh</span>
                </div>
                <div className="comparison-arrow">→</div>
                <div className="comparison-card after">
                  <span className="comparison-label">Current Reading</span>
                  <span className="comparison-value">{reading.current_reading.toFixed(2)}</span>
                  <span className="comparison-unit">kWh</span>
                </div>
              </div>
            </div>

            {/* Consumption Breakdown */}
            <div className="detail-section">
              <h3 className="section-title">Consumption Breakdown</h3>
              <div className="consumption-breakdown">
                <div className="breakdown-main">
                  <span className="breakdown-label">Total Consumption</span>
                  <span className="breakdown-value">{reading.consumption.toFixed(2)} kWh</span>
                  {consumptionChangePercent !== 0 && (
                    <span className={`breakdown-change ${consumptionChangePercent > 0 ? 'increase' : 'decrease'}`}>
                      <TrendingUp size={16} />
                      {consumptionChangePercent > 0 ? '+' : ''}{consumptionChangePercent}% vs last month
                    </span>
                  )}
                </div>
                <div className="breakdown-stats">
                  <div className="stat-item">
                    <span className="stat-label">Calculation</span>
                    <span className="stat-value">
                      {reading.current_reading.toFixed(2)} - {reading.previous_reading.toFixed(2)} = {reading.consumption.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Bills */}
            <div className="detail-section">
              <h3 className="section-title">Associated Bills</h3>
              <div className="bills-list">
                {/* TODO: Fetch actual bills from API */}
                <p className="no-data">No bills generated for this reading yet</p>
                <Button variant="primary" size="sm">
                  <FileText size={16} />
                  <span>Generate Bill</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="details-right">
            <div className="detail-section">
              <h3 className="section-title">Reading History</h3>
              <div className="timeline">
                {/* Current Reading */}
                <div className="timeline-item current">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-date">{new Date(reading.reading_date).toLocaleDateString()}</span>
                      <Badge variant="primary" text="Current" />
                    </div>
                    <div className="timeline-details">
                      <div className="timeline-row">
                        <span className="timeline-label">Reading:</span>
                        <span className="timeline-value">{reading.current_reading.toFixed(2)} kWh</span>
                      </div>
                      <div className="timeline-row">
                        <span className="timeline-label">Consumption:</span>
                        <span className="timeline-value consumption">{reading.consumption.toFixed(2)} kWh</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historical Readings */}
                {historicalReadings.map((hist, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-date">{new Date(hist.date).toLocaleDateString()}</span>
                      </div>
                      <div className="timeline-details">
                        <div className="timeline-row">
                          <span className="timeline-label">Reading:</span>
                          <span className="timeline-value">{hist.reading.toFixed(2)} kWh</span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">Consumption:</span>
                          <span className="timeline-value">{hist.consumption.toFixed(2)} kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <div className="footer-actions">
            <Button variant="primary" size="md" onClick={onEdit}>
              <Edit2 size={18} />
              <span>Edit Reading</span>
            </Button>
            <Button variant="success" size="md" onClick={() => console.log('Generate bill')}>
              <FileText size={18} />
              <span>Generate Bill</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingDetails;
