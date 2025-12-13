import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './RecentActivity.css';

/**
 * Recent Activity Table Component
 */
const RecentActivity = () => {
  const recentPayments = [
    { id: 1, date: '2025-12-10', customer: 'John Smith', billNumber: 'BILL-2025-001', amount: 4500, status: 'Paid' },
    { id: 2, date: '2025-12-10', customer: 'ABC Corporation', billNumber: 'BILL-2025-002', amount: 12300, status: 'Paid' },
    { id: 3, date: '2025-12-09', customer: 'Sarah Johnson', billNumber: 'BILL-2025-003', amount: 3200, status: 'Unpaid' },
    { id: 4, date: '2025-12-09', customer: 'Tech Industries Ltd', billNumber: 'BILL-2025-004', amount: 25000, status: 'Partial' },
    { id: 5, date: '2025-12-08', customer: 'Mary Williams', billNumber: 'BILL-2025-005', amount: 2800, status: 'Paid' },
    { id: 6, date: '2025-12-08', customer: 'Green Market', billNumber: 'BILL-2025-006', amount: 5600, status: 'Paid' },
    { id: 7, date: '2025-12-07', customer: 'Robert Brown', billNumber: 'BILL-2025-007', amount: 3900, status: 'Unpaid' },
    { id: 8, date: '2025-12-07', customer: 'City Hospital', billNumber: 'BILL-2025-008', amount: 45000, status: 'Paid' },
    { id: 9, date: '2025-12-06', customer: 'James Davis', billNumber: 'BILL-2025-009', amount: 4100, status: 'Partial' },
    { id: 10, date: '2025-12-06', customer: 'Elite Mall', billNumber: 'BILL-2025-010', amount: 18500, status: 'Paid' },
  ];
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'Paid': 'success',
      'Unpaid': 'danger',
      'Partial': 'warning',
    };
    return <Badge status={statusMap[status]}>{status}</Badge>;
  };
  
  return (
    <Card>
      <div className="recent-activity__header">
        <div>
          <h3 className="recent-activity__title">Recent Activity</h3>
          <p className="recent-activity__subtitle">Latest payment transactions</p>
        </div>
      </div>
      
      <div className="recent-activity__table-wrapper">
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
            {recentPayments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="recent-activity__table-date">{payment.date}</td>
                <td className="recent-activity__table-customer">{payment.customer}</td>
                <td className="recent-activity__table-bill">{payment.billNumber}</td>
                <td className="recent-activity__table-amount">
                  Rs {payment.amount.toLocaleString()}
                </td>
                <td>{getStatusBadge(payment.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="recent-activity__footer">
        <Button variant="secondary" size="md">View All Transactions</Button>
      </div>
    </Card>
  );
};

export default RecentActivity;
