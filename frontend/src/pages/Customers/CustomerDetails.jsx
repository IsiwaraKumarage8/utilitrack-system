import { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Building2, Calendar, Zap, Droplet, Flame, Wind } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import axios from 'axios';
import billingApi from '../../api/billingApi';
import complaintApi from '../../api/complaintApi';
import './CustomerDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CustomerDetails = ({ customer, onClose, onEdit }) => {
  const [serviceConnections, setServiceConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [recentBills, setRecentBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  // Fetch service connections from API
  useEffect(() => {
    const fetchServiceConnections = async () => {
      try {
        setLoadingConnections(true);
        const response = await axios.get(`${API_URL}/connections/customer/${customer.customer_id}`);
        setServiceConnections(response.data.data || []);
      } catch (error) {
        console.error('Error fetching service connections:', error);
        setServiceConnections([]);
      } finally {
        setLoadingConnections(false);
      }
    };

    if (customer?.customer_id) {
      fetchServiceConnections();
    }
  }, [customer?.customer_id]);

  // Fetch recent bills from API
  useEffect(() => {
    const fetchRecentBills = async () => {
      try {
        setLoadingBills(true);
        const response = await billingApi.getBillsByCustomer(customer.customer_id);
        // Get last 5 bills only
        const bills = (response.data || []).slice(0, 5);
        setRecentBills(bills);
      } catch (error) {
        console.error('Error fetching recent bills:', error);
        setRecentBills([]);
      } finally {
        setLoadingBills(false);
      }
    };

    if (customer?.customer_id) {
      fetchRecentBills();
    }
  }, [customer?.customer_id]);

  // Fetch recent complaints from API
  useEffect(() => {
    const fetchRecentComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const response = await complaintApi.getComplaintsByCustomer(customer.customer_id);
        // Get last 3 complaints only
        const complaints = (response.data || []).slice(0, 3);
        setRecentComplaints(complaints);
      } catch (error) {
        console.error('Error fetching recent complaints:', error);
        setRecentComplaints([]);
      } finally {
        setLoadingComplaints(false);
      }
    };

    if (customer?.customer_id) {
      fetchRecentComplaints();
    }
  }, [customer?.customer_id]);

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
      'Inactive': 'warning',
      'Suspended': 'danger',
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
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel-content customer-details-sidepanel" onClick={(e) => e.stopPropagation()}>
        {/* Side Panel Header */}
        <div className="sidepanel-header">
          <h2 className="sidepanel-title">Customer Details</h2>
          <button className="sidepanel-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Side Panel Body */}
        <div className="sidepanel-body">
          <div className="details-layout">
            {/* Left Column - Customer Information */}
            <div className="details-main">
              {/* Basic Info Section */}
              <div className="details-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label" style={{ color: '#FFFFFF' }}>Customer Type</span>
                    <span className="info-value" style={{ color: '#FFFFFF' }}>{customer.customer_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label" style={{ color: '#FFFFFF' }}>Status</span>
                    <Badge status={getStatusVariant(customer.status)}>{customer.status}</Badge>
                  </div>
                  <div className="info-item">
                    <span className="info-label" style={{ color: '#FFFFFF' }}>Full Name</span>
                    <span className="info-value" style={{ color: '#FFFFFF' }}>{customer.first_name} {customer.last_name}</span>
                  </div>
                  {customer.company_name && (
                    <div className="info-item">
                      <span className="info-label" style={{ color: '#FFFFFF' }}>Company</span>
                      <span className="info-value" style={{ color: '#FFFFFF' }}>{customer.company_name}</span>
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
                {loadingConnections ? (
                  <div className="loading-message">Loading connections...</div>
                ) : serviceConnections.length === 0 ? (
                  <div className="empty-message">No service connections found</div>
                ) : (
                  <div className="connections-list">
                    {serviceConnections.map(connection => (
                      <div key={connection.connection_id} className="connection-card">
                        <div className="connection-header">
                          <div className="connection-utility">
                            <div className="utility-icon">{getUtilityIcon(connection.utility_name)}</div>
                            <div>
                              <div className="connection-type">{connection.utility_name}</div>
                              <div className="connection-meter">Meter: {connection.meter_number || 'N/A'}</div>
                            </div>
                          </div>
                          <Badge status={getStatusVariant(connection.connection_status)}>{connection.connection_status || 'Unknown'}</Badge>
                        </div>
                        <div className="connection-footer">
                          <Calendar size={14} />
                          <span>Installed: {new Date(connection.connection_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="details-sidebar">
              {/* Recent Bills */}
              <div className="details-section">
                <h3 className="section-title">Recent Bills</h3>
                {loadingBills ? (
                  <div className="loading-message">Loading bills...</div>
                ) : recentBills.length === 0 ? (
                  <div className="empty-message">No bills found</div>
                ) : (
                  <div className="activity-list">
                    {recentBills.map(bill => (
                      <div key={bill.bill_id} className="activity-item">
                        <div className="activity-header">
                          <span className="activity-title">{bill.bill_number}</span>
                          <Badge status={getStatusVariant(bill.bill_status)}>{bill.bill_status}</Badge>
                        </div>
                        <div className="activity-utility">{bill.utility_type}</div>
                        <div className="activity-footer">
                          <span className="activity-amount">PKR {bill.total_amount?.toFixed(2) || '0.00'}</span>
                          <span className="activity-date">Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Complaints */}
              <div className="details-section">
                <h3 className="section-title">Recent Complaints</h3>
                {loadingComplaints ? (
                  <div className="loading-message">Loading complaints...</div>
                ) : recentComplaints.length === 0 ? (
                  <div className="empty-message">No complaints found</div>
                ) : (
                  <div className="activity-list">
                    {recentComplaints.map(complaint => (
                      <div key={complaint.complaint_id} className="activity-item">
                        <div className="activity-header">
                          <span className="activity-title">{complaint.complaint_type || complaint.description?.substring(0, 50)}</span>
                          <Badge status={getStatusVariant(complaint.complaint_status)}>{complaint.complaint_status}</Badge>
                        </div>
                        <div className="activity-utility">{complaint.utility_name || 'N/A'}</div>
                        <div className="activity-footer">
                          <span className="activity-date">
                            {complaint.resolution_date 
                              ? `Resolved: ${new Date(complaint.resolution_date).toLocaleDateString()}`
                              : `Created: ${new Date(complaint.complaint_date).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel Footer */}
        <div className="sidepanel-footer">
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
