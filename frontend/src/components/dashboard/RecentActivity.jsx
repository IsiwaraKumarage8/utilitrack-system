import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import * as reportApi from '../../api/reportApi';
import './RecentActivity.css';

/**
 * Recent Activity Table Component - Shows latest payment transactions
 */
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportApi.getRecentActivity(10);
      
      if (response.success) {
        setActivities(response.data);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError('Failed to load recent activity');
      
      // Set fallback data on error
      setActivities([
        { id: 1, date: '2025-12-10', customer: 'John Smith', bill_number: 'BILL-2025-001', amount: 4500, status: 'Paid' },
        { id: 2, date: '2025-12-10', customer: 'ABC Corporation', bill_number: 'BILL-2025-002', amount: 12300, status: 'Paid' },
        { id: 3, date: '2025-12-09', customer: 'Sarah Johnson', bill_number: 'BILL-2025-003', amount: 3200, status: 'Unpaid' },
        { id: 4, date: '2025-12-09', customer: 'Tech Industries Ltd', bill_number: 'BILL-2025-004', amount: 25000, status: 'Partially Paid' },
        { id: 5, date: '2025-12-08', customer: 'Mary Williams', bill_number: 'BILL-2025-005', amount: 2800, status: 'Paid' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'Paid': 'success',
      'Unpaid': 'danger',
      'Partially Paid': 'warning',
      'Overdue': 'danger',
    };
    return <Badge status={statusMap[status] || 'info'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card>
        <div className="recent-activity__header">
          <div>
            <h3 className="recent-activity__title">Recent Activity</h3>
            <p className="recent-activity__subtitle">Loading...</p>
          </div>
        </div>
        <div className="recent-activity__loading">
          <div className="spinner-small"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="recent-activity__header">
        <div>
          <h3 className="recent-activity__title">Recent Activity</h3>
          <p className="recent-activity__subtitle">
            {error ? 'Using sample data' : 'Latest payment transactions'}
          </p>
        </div>
      </div>
      
      <div className="recent-activity__table-wrapper">
        {activities.length === 0 ? (
          <div className="recent-activity__empty">
            <p>No recent activity found</p>
          </div>
        ) : (
          <table className="recent-activity__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Bill Number</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="recent-activity__table-date">
                    {activity.time_ago || formatDate(activity.date)}
                  </td>
                  <td className="recent-activity__table-customer">{activity.customer}</td>
                  <td className="recent-activity__table-bill">{activity.bill_number}</td>
                  <td className="recent-activity__table-amount">
                    Rs {activity.amount.toLocaleString()}
                  </td>
                  <td>{getStatusBadge(activity.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="recent-activity__footer">
        <Button variant="secondary" size="md">View All Transactions</Button>
      </div>
    </Card>
  );
};

export default RecentActivity;
