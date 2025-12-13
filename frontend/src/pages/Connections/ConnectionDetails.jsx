import { X, Zap, Droplet, Flame, Wind, MapPin, Calendar, Activity, FileText, Lightbulb } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './ConnectionDetails.css';

const ConnectionDetails = ({ connection, onClose, onEdit }) => {
  // Mock meter readings data
  const meterReadings = [
    {
      reading_id: 1,
      reading_date: '2024-01-15',
      previous_reading: 1245.5,
      current_reading: 1491.0,
      consumption: 245.5,
      reader_name: 'John Silva'
    },
    {
      reading_id: 2,
      reading_date: '2023-12-15',
      previous_reading: 1012.3,
      current_reading: 1245.5,
      consumption: 233.2,
      reader_name: 'Mary Fernando'
    },
    {
      reading_id: 3,
      reading_date: '2023-11-15',
      previous_reading: 785.7,
      current_reading: 1012.3,
      consumption: 226.6,
      reader_name: 'John Silva'
    },
    {
      reading_id: 4,
      reading_date: '2023-10-15',
      previous_reading: 560.2,
      current_reading: 785.7,
      consumption: 225.5,
      reader_name: 'Mary Fernando'
    },
    {
      reading_id: 5,
      reading_date: '2023-09-15',
      previous_reading: 340.8,
      current_reading: 560.2,
      consumption: 219.4,
      reader_name: 'John Silva'
    }
  ];

  // Mock billing history
  const billingHistory = [
    {
      bill_id: 1,
      billing_period: 'Jan 2024',
      amount: 2450.00,
      status: 'Paid',
      due_date: '2024-02-15',
      paid_date: '2024-02-10'
    },
    {
      bill_id: 2,
      billing_period: 'Dec 2023',
      amount: 2330.00,
      status: 'Paid',
      due_date: '2024-01-15',
      paid_date: '2024-01-12'
    },
    {
      bill_id: 3,
      billing_period: 'Nov 2023',
      amount: 2266.00,
      status: 'Paid',
      due_date: '2023-12-15',
      paid_date: '2023-12-14'
    }
  ];

  const getUtilityIcon = (utilityType) => {
    const icons = {
      'Electricity': <Zap size={20} />,
      'Water': <Droplet size={20} />,
      'Gas': <Flame size={20} />,
      'Sewage': <Wind size={20} />,
      'Street Lighting': <Lightbulb size={20} />
    };
    return icons[utilityType] || <Zap size={20} />;
  };

  const getStatusVariant = (status) => {
    const variants = {
      'Active': 'success',
      'Disconnected': 'danger',
      'Suspended': 'warning',
      'Pending': 'info',
      'Paid': 'success',
      'Unpaid': 'danger',
      'Partially Paid': 'warning'
    };
    return variants[status] || 'secondary';
  };

  const getUnitLabel = (utilityType) => {
    const units = {
      'Electricity': 'kWh',
      'Water': 'Cubic Meters',
      'Gas': 'Cubic Meters',
      'Sewage': 'Cubic Meters',
      'Street Lighting': 'kWh'
    };
    return units[utilityType] || 'units';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content connection-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="utility-badge">
              {getUtilityIcon(connection.utility_type)}
              <span>{connection.utility_type}</span>
            </div>
            <h2 className="modal-title">{connection.meter_number}</h2>
            <Badge variant={getStatusVariant(connection.connection_status)} text={connection.connection_status} />
          </div>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Connection Information */}
          <div className="details-section">
            <h3 className="section-title">Connection Information</h3>
            <div className="info-grid-2col">
              <div className="info-item">
                <span className="info-label">Customer</span>
                <span className="info-value">{connection.customer_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Connection Number</span>
                <span className="info-value">{connection.connection_number}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tariff Plan</span>
                <span className="info-value">{connection.tariff_plan}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Installation Date</span>
                <span className="info-value">
                  <Calendar size={14} />
                  {new Date(connection.connection_date).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Property Address</span>
                <span className="info-value">
                  <MapPin size={14} />
                  {connection.property_address}
                </span>
              </div>
              {connection.notes && (
                <div className="info-item full-width">
                  <span className="info-label">Notes</span>
                  <span className="info-value">{connection.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Consumption */}
          {connection.connection_status === 'Active' && (
            <div className="details-section">
              <h3 className="section-title">Current Status</h3>
              <div className="consumption-card">
                <div className="consumption-icon">
                  <Activity size={24} />
                </div>
                <div className="consumption-info">
                  <span className="consumption-label">Current Consumption</span>
                  <span className="consumption-value">
                    {connection.current_consumption} {getUnitLabel(connection.utility_type)}
                  </span>
                </div>
                <div className="consumption-date">
                  <span>Last Reading</span>
                  <span>{new Date(connection.last_reading).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="details-columns">
            {/* Meter Readings */}
            <div className="details-section">
              <h3 className="section-title">
                <Activity size={18} />
                Recent Meter Readings
              </h3>
              <div className="readings-list">
                {meterReadings.map(reading => (
                  <div key={reading.reading_id} className="reading-item">
                    <div className="reading-header">
                      <span className="reading-date">
                        {new Date(reading.reading_date).toLocaleDateString()}
                      </span>
                      <span className="reading-consumption">
                        {reading.consumption} {getUnitLabel(connection.utility_type)}
                      </span>
                    </div>
                    <div className="reading-details">
                      <span>Previous: {reading.previous_reading}</span>
                      <span>→</span>
                      <span>Current: {reading.current_reading}</span>
                    </div>
                    <div className="reading-footer">
                      <span className="reader-name">Read by {reading.reader_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing History */}
            <div className="details-section">
              <h3 className="section-title">
                <FileText size={18} />
                Billing History
              </h3>
              <div className="bills-list">
                {billingHistory.map(bill => (
                  <div key={bill.bill_id} className="bill-item">
                    <div className="bill-header">
                      <span className="bill-period">{bill.billing_period}</span>
                      <Badge variant={getStatusVariant(bill.status)} text={bill.status} size="sm" />
                    </div>
                    <div className="bill-amount">PKR {bill.amount.toFixed(2)}</div>
                    <div className="bill-footer">
                      {bill.status === 'Paid' ? (
                        <span className="bill-date">Paid: {new Date(bill.paid_date).toLocaleDateString()}</span>
                      ) : (
                        <span className="bill-date">Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                      )}
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
          <Button variant="primary" size="md" onClick={() => onEdit(connection)}>
            Edit Connection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDetails;
