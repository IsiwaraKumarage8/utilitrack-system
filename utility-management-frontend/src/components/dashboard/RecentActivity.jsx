import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Latest payment transactions</p>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="text-left py-4 px-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer Name</th>
              <th className="text-left py-4 px-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">Bill Number</th>
              <th className="text-left py-4 px-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="text-left py-4 px-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                <td className="py-4 px-8 text-sm text-gray-700">{payment.date}</td>
                <td className="py-4 px-8 text-sm text-gray-900 font-medium">{payment.customer}</td>
                <td className="py-4 px-8 text-sm text-gray-700">{payment.billNumber}</td>
                <td className="py-4 px-8 text-sm text-gray-900 font-semibold">
                  Rs {payment.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm">{getStatusBadge(payment.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <Button variant="secondary" size="md">View All Transactions</Button>
      </div>
    </Card>
  );
};

export default RecentActivity;
