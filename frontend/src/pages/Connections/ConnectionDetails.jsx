import { useState, useEffect } from 'react';
import { X, Zap, Droplet, Flame, Wind, MapPin, Calendar, Activity, FileText, Lightbulb } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import meterReadingApi from '../../api/meterReadingApi';
import billingApi from '../../api/billingApi';
import './ConnectionDetails.css';

const ConnectionDetails = ({ connection, onClose, onEdit }) => {
  const [meterReadings, setMeterReadings] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectionData();
  }, [connection]);

  const fetchConnectionData = async () => {
    try {
      setLoading(true);
      
      // Fetch meter readings if meter_id exists
      if (connection.meter_id) {
        try {
          const readingsResponse = await meterReadingApi.getReadingsByMeterId(connection.meter_id);
          if (readingsResponse.success && readingsResponse.data) {
            // Get latest 5 readings
            setMeterReadings(readingsResponse.data.slice(0, 5));
          }
        } catch (err) {
          console.error('Error fetching meter readings:', err);
          setMeterReadings([]);
        }
      }

      // Fetch billing history for customer
      if (connection.customer_id) {
        try {
          const billingResponse = await billingApi.getBillsByCustomer(connection.customer_id);
          if (billingResponse.success && billingResponse.data) {
            // Filter bills for this connection and get latest 3
            const connectionBills = billingResponse.data
              .filter(bill => bill.connection_id === connection.connection_id)
              .slice(0, 3);
            setBillingHistory(connectionBills);
          }
        } catch (err) {
          console.error('Error fetching billing history:', err);
          setBillingHistory([]);
        }
      }
    } catch (error) {
      console.error('Error fetching connection data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              {getUtilityIcon(connection.utility_name)}
              <span>{connection.utility_name}</span>
            </div>
            <h2 className="modal-title">{connection.meter_number || connection.connection_number}</h2>
            <Badge status={getStatusVariant(connection.connection_status)}>
              {connection.connection_status}
            </Badge>
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
          {connection.connection_status === 'Active' && connection.current_consumption && (
            <div className="details-section">
              <h3 className="section-title">Current Status</h3>
              <div className="consumption-card">
                <div className="consumption-icon">
                  <Activity size={24} />
                </div>
                <div className="consumption-info">
                  <span className="consumption-label">Current Consumption</span>
                  <span className="consumption-value">
                    {connection.current_consumption} {getUnitLabel(connection.utility_name)}
                  </span>
                </div>
                <div className="consumption-date">
                  <span>Last Reading</span>
                  <span>{connection.last_reading_date ? new Date(connection.last_reading_date).toLocaleDateString() : 'N/A'}</span>
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
              {loading ? (
                <div className="loading-message">Loading meter readings...</div>
              ) : meterReadings.length === 0 ? (
                <div className="empty-message">No meter readings found</div>
              ) : (
                <div className="readings-list">
                  {meterReadings.map(reading => (
                    <div key={reading.reading_id} className="reading-item">
                      <div className="reading-header">
                        <span className="reading-date">
                          {new Date(reading.reading_date).toLocaleDateString()}
                        </span>
                        <span className="reading-consumption">
                          {reading.consumption} {getUnitLabel(connection.utility_name)}
                        </span>
                      </div>
                      <div className="reading-details">
                        <span>Previous: {reading.previous_reading}</span>
                        <span>→</span>
                        <span>Current: {reading.current_reading}</span>
                      </div>
                      {reading.reader_name && (
                        <div className="reading-footer">
                          <span className="reader-name">Read by {reading.reader_name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing History */}
            <div className="details-section">
              <h3 className="section-title">
                <FileText size={18} />
                Billing History
              </h3>
              {loading ? (
                <div className="loading-message">Loading billing history...</div>
              ) : billingHistory.length === 0 ? (
                <div className="empty-message">No billing history found</div>
              ) : (
                <div className="bills-list">
                  {billingHistory.map(bill => (
                    <div key={bill.bill_id} className="bill-item">
                      <div className="bill-header">
                        <span className="bill-period">
                          {bill.bill_number || `Bill #${bill.bill_id}`}
                        </span>
                        <Badge status={getStatusVariant(bill.bill_status)} size="sm">
                          {bill.bill_status}
                        </Badge>
                      </div>
                      <div className="bill-amount">Rs {bill.total_amount?.toFixed(2) || '0.00'}</div>
                      <div className="bill-footer">
                        {bill.bill_status === 'Paid' ? (
                          <span className="bill-date">Paid: {bill.payment_date ? new Date(bill.payment_date).toLocaleDateString() : 'N/A'}</span>
                        ) : (
                          <span className="bill-date">Due: {bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
