import { X, Zap, Droplet, Flame, MapPin, Calendar, Wrench, Activity, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './MeterDetails.css';

// Mock reading history - TODO: Replace with API call from Meter_Reading table
const MOCK_READING_HISTORY = [
  {
    reading_id: 1,
    reading_date: '2024-11-15',
    previous_reading: 1450.00,
    current_reading: 1580.00,
    consumption: 130.00,
    reading_type: 'Actual',
    reader_name: 'John Doe'
  },
  {
    reading_id: 2,
    reading_date: '2024-10-15',
    previous_reading: 1320.00,
    current_reading: 1450.00,
    consumption: 130.00,
    reading_type: 'Actual',
    reader_name: 'John Doe'
  },
  {
    reading_id: 3,
    reading_date: '2024-09-15',
    previous_reading: 1185.00,
    current_reading: 1320.00,
    consumption: 135.00,
    reading_type: 'Actual',
    reader_name: 'John Doe'
  },
  {
    reading_id: 4,
    reading_date: '2024-08-15',
    previous_reading: 1045.00,
    current_reading: 1185.00,
    consumption: 140.00,
    reading_type: 'Actual',
    reader_name: 'Jane Smith'
  },
  {
    reading_id: 5,
    reading_date: '2024-07-15',
    previous_reading: 910.00,
    current_reading: 1045.00,
    consumption: 135.00,
    reading_type: 'Actual',
    reader_name: 'Jane Smith'
  }
];

// Mock maintenance history - TODO: Replace with API call from Maintenance table
const MOCK_MAINTENANCE_HISTORY = [
  {
    maintenance_id: 1,
    maintenance_date: '2024-06-15',
    maintenance_type: 'Routine Inspection',
    performed_by: 'Tech-01',
    notes: 'All systems normal',
    status: 'Completed'
  },
  {
    maintenance_id: 2,
    maintenance_date: '2024-03-10',
    maintenance_type: 'Calibration',
    performed_by: 'Tech-03',
    notes: 'Meter recalibrated successfully',
    status: 'Completed'
  }
];

const MeterDetails = ({ meter, onClose, onEdit, onRecordReading }) => {
  if (!meter) return null;

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

  const getStatusVariant = (status) => {
    const variants = {
      'Active': 'success',
      'Faulty': 'danger',
      'Replaced': 'secondary',
      'Removed': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const calculateAverageConsumption = () => {
    if (MOCK_READING_HISTORY.length === 0) return 0;
    const total = MOCK_READING_HISTORY.reduce((sum, reading) => sum + reading.consumption, 0);
    return (total / MOCK_READING_HISTORY.length).toFixed(2);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container meter-details-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Meter Details</h2>
            <p className="modal-subtitle">{meter.meter_number}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body meter-details-body">
          {/* Left Column - Main Information */}
          <div className="details-left">
            {/* Meter Information */}
            <div className="detail-section">
              <h3 className="section-title">Meter Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Meter Number</span>
                  <span className="detail-value meter-number">{meter.meter_number}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Utility Type</span>
                  <div className={`utility-badge ${getUtilityColor(meter.utility_type)}`}>
                    {getUtilityIcon(meter.utility_type)}
                    <span>{meter.utility_type}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Meter Type</span>
                  <span className="detail-value">{meter.meter_type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Manufacturer</span>
                  <span className="detail-value">{meter.manufacturer || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Installation Date</span>
                  <span className="detail-value">
                    <Calendar size={16} className="detail-icon" />
                    {new Date(meter.installation_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Maintenance</span>
                  <span className="detail-value">
                    <Wrench size={16} className="detail-icon" />
                    {meter.last_maintenance_date 
                      ? new Date(meter.last_maintenance_date).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Initial Reading</span>
                  <span className="detail-value">{meter.initial_reading.toFixed(2)} kWh</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <Badge variant={getStatusVariant(meter.meter_status)} text={meter.meter_status} />
                </div>
              </div>
              {meter.notes && (
                <div className="detail-notes">
                  <span className="detail-label">Notes</span>
                  <p className="notes-text">{meter.notes}</p>
                </div>
              )}
            </div>

            {/* Connection Details */}
            <div className="detail-section">
              <h3 className="section-title">Connection Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Connection Number</span>
                  <span className="detail-value">{meter.connection_number}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Customer Name</span>
                  <span className="detail-value">{meter.customer_name}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Property Address</span>
                  <span className="detail-value">
                    <MapPin size={16} className="detail-icon" />
                    {meter.property_address}
                  </span>
                </div>
              </div>
            </div>

            {/* Consumption Statistics */}
            <div className="detail-section">
              <h3 className="section-title">Consumption Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon primary">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Avg. Consumption</span>
                    <span className="stat-value">{calculateAverageConsumption()} kWh/month</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon success">
                    <Activity size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Readings</span>
                    <span className="stat-value">{MOCK_READING_HISTORY.length}</span>
                  </div>
                </div>
              </div>
              <div className="chart-placeholder">
                <p>Consumption Trend Chart</p>
                <span>(Chart visualization placeholder)</span>
              </div>
            </div>
          </div>

          {/* Right Column - Reading & Maintenance History */}
          <div className="details-right">
            {/* Reading History */}
            <div className="detail-section">
              <h3 className="section-title">Recent Readings</h3>
              <div className="history-list">
                {MOCK_READING_HISTORY.map(reading => (
                  <div key={reading.reading_id} className="history-item">
                    <div className="history-header">
                      <span className="history-date">
                        {new Date(reading.reading_date).toLocaleDateString()}
                      </span>
                      <span className={`reading-type ${reading.reading_type.toLowerCase()}`}>
                        {reading.reading_type}
                      </span>
                    </div>
                    <div className="history-details">
                      <div className="history-row">
                        <span className="history-label">Previous:</span>
                        <span className="history-value">{reading.previous_reading.toFixed(2)} kWh</span>
                      </div>
                      <div className="history-row">
                        <span className="history-label">Current:</span>
                        <span className="history-value">{reading.current_reading.toFixed(2)} kWh</span>
                      </div>
                      <div className="history-row">
                        <span className="history-label">Consumption:</span>
                        <span className="history-value consumption">{reading.consumption.toFixed(2)} kWh</span>
                      </div>
                      <div className="history-row">
                        <span className="history-label">Reader:</span>
                        <span className="history-value">{reading.reader_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance History */}
            <div className="detail-section">
              <h3 className="section-title">Maintenance History</h3>
              <div className="history-list">
                {MOCK_MAINTENANCE_HISTORY.length > 0 ? (
                  MOCK_MAINTENANCE_HISTORY.map(maintenance => (
                    <div key={maintenance.maintenance_id} className="history-item">
                      <div className="history-header">
                        <span className="history-date">
                          {new Date(maintenance.maintenance_date).toLocaleDateString()}
                        </span>
                        <Badge variant="success" text={maintenance.status} />
                      </div>
                      <div className="history-details">
                        <div className="history-row">
                          <span className="history-label">Type:</span>
                          <span className="history-value">{maintenance.maintenance_type}</span>
                        </div>
                        <div className="history-row">
                          <span className="history-label">Technician:</span>
                          <span className="history-value">{maintenance.performed_by}</span>
                        </div>
                        {maintenance.notes && (
                          <div className="history-row">
                            <span className="history-label">Notes:</span>
                            <span className="history-value">{maintenance.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-history">No maintenance records</p>
                )}
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
              Edit Meter
            </Button>
            {meter.meter_status === 'Active' && (
              <Button variant="success" size="md" onClick={onRecordReading}>
                <Activity size={18} />
                <span>Record Reading</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeterDetails;
