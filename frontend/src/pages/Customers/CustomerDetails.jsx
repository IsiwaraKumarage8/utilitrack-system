import { X, Mail, Phone, MapPin, Building2, Calendar, Zap, Droplet, Flame, Wind } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './CustomerDetails.css';

const CustomerDetails = ({ customer, onClose, onEdit }) => {
  // Mock service connections data
  const serviceConnections = [
    {
      connection_id: 1,
      utility_type: 'Electricity',
      meter_number: 'MTR-ELC-1001',
      status: 'Active',
      installation_date: '2023-01-15'
    },
    {
      connection_id: 2,
      utility_type: 'Water',
      meter_number: 'MTR-WTR-2001',
      status: 'Active',
      installation_date: '2023-01-15'
    }
  ];

  // Mock recent bills data (last 5)
  const recentBills = [
    {
      bill_id: 1,
      billing_period: 'Jan 2024',
      utility_type: 'Electricity',
      amount: 2450.00,
      status: 'Paid',
      due_date: '2024-02-15'
    },
    {
      bill_id: 2,
      billing_period: 'Jan 2024',
      utility_type: 'Water',
      amount: 850.00,
      status: 'Paid',
      due_date: '2024-02-15'
    },
    {
      bill_id: 3,
      billing_period: 'Dec 2023',
      utility_type: 'Electricity',
      amount: 2380.00,
      status: 'Paid',
      due_date: '2024-01-15'
    },
    {
      bill_id: 4,
      billing_period: 'Dec 2023',
      utility_type: 'Water',
      amount: 820.00,
      status: 'Paid',
      due_date: '2024-01-15'
    },
    {
      bill_id: 5,
      billing_period: 'Nov 2023',
      utility_type: 'Electricity',
      amount: 2200.00,
      status: 'Paid',
      due_date: '2023-12-15'
    }
  ];

  // Mock recent complaints data (last 3)
  const recentComplaints = [
    {
      complaint_id: 1,
      subject: 'Meter reading discrepancy',
      utility_type: 'Electricity',
      status: 'Resolved',
      created_date: '2024-01-20',
      resolved_date: '2024-01-22'
    },
    {
      complaint_id: 2,
      subject: 'Billing issue - duplicate charge',
      utility_type: 'Water',
      status: 'In Progress',
      created_date: '2024-01-10',
      resolved_date: null
    },
    {
      complaint_id: 3,
      subject: 'Service interruption',
      utility_type: 'Electricity',
      status: 'Resolved',
      created_date: '2023-12-05',
      resolved_date: '2023-12-06'
    }
  ];

  const getUtilityIcon = (utilityType) => {
    const icons = {
      'Electricity': <Zap size={16} />,
      'Water': <Droplet size={16} />,
      'Gas': <Flame size={16} />,
      'Internet': <Wind size={16} />
    };
    return icons[utilityType] || <Zap size={16} />;
  };

  const getStatusVariant = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Suspended': 'warning',
      'Paid': 'success',
      'Unpaid': 'danger',
      'Partially Paid': 'warning',
      'Resolved': 'success',
      'In Progress': 'info',
      'Pending': 'warning',
      'Closed': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content customer-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Customer Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="details-layout">
            {/* Left Column - Customer Information */}
            <div className="details-main">
              {/* Basic Info Section */}
              <div className="details-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Customer Type</span>
                    <span className="info-value">{customer.customer_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <Badge variant={getStatusVariant(customer.status)} text={customer.status} />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{customer.first_name} {customer.last_name}</span>
                  </div>
                  {customer.company_name && (
                    <div className="info-item">
                      <span className="info-label">Company</span>
                      <span className="info-value">{customer.company_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="details-section">
                <h3 className="section-title">Contact Information</h3>
                <div className="contact-list">
                  <div className="contact-item">
                    <Mail size={18} />
                    <div>
                      <span className="contact-label">Email</span>
                      <span className="contact-value">{customer.email}</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Phone size={18} />
                    <div>
                      <span className="contact-label">Phone</span>
                      <span className="contact-value">{customer.phone}</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <MapPin size={18} />
                    <div>
                      <span className="contact-label">Address</span>
                      <span className="contact-value">{customer.address}, {customer.city}, {customer.postal_code}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Connections Section */}
              <div className="details-section">
                <h3 className="section-title">Service Connections ({serviceConnections.length})</h3>
                <div className="connections-list">
                  {serviceConnections.map(connection => (
                    <div key={connection.connection_id} className="connection-card">
                      <div className="connection-header">
                        <div className="connection-utility">
                          <div className="utility-icon">{getUtilityIcon(connection.utility_type)}</div>
                          <div>
                            <div className="connection-type">{connection.utility_type}</div>
                            <div className="connection-meter">Meter: {connection.meter_number}</div>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(connection.status)} text={connection.status} />
                      </div>
                      <div className="connection-footer">
                        <Calendar size={14} />
                        <span>Installed: {new Date(connection.installation_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="details-sidebar">
              {/* Recent Bills */}
              <div className="details-section">
                <h3 className="section-title">Recent Bills</h3>
                <div className="activity-list">
                  {recentBills.map(bill => (
                    <div key={bill.bill_id} className="activity-item">
                      <div className="activity-header">
                        <span className="activity-title">{bill.billing_period}</span>
                        <Badge variant={getStatusVariant(bill.status)} text={bill.status} size="sm" />
                      </div>
                      <div className="activity-utility">{bill.utility_type}</div>
                      <div className="activity-footer">
                        <span className="activity-amount">PKR {bill.amount.toFixed(2)}</span>
                        <span className="activity-date">Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Complaints */}
              <div className="details-section">
                <h3 className="section-title">Recent Complaints</h3>
                <div className="activity-list">
                  {recentComplaints.map(complaint => (
                    <div key={complaint.complaint_id} className="activity-item">
                      <div className="activity-header">
                        <span className="activity-title">{complaint.subject}</span>
                        <Badge variant={getStatusVariant(complaint.status)} text={complaint.status} size="sm" />
                      </div>
                      <div className="activity-utility">{complaint.utility_type}</div>
                      <div className="activity-footer">
                        <span className="activity-date">
                          {complaint.resolved_date 
                            ? `Resolved: ${new Date(complaint.resolved_date).toLocaleDateString()}`
                            : `Created: ${new Date(complaint.created_date).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="md" onClick={() => onEdit(customer)}>
            Edit Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
