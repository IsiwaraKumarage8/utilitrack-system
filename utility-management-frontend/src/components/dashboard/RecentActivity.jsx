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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-2 font-medium">Latest payment transactions</p>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-8 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gradient bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
              <th className="text-left py-5 px-8 text-xs font-black text-gray-700 uppercase tracking-wider">Date</th>
              <th className="text-left py-5 px-8 text-xs font-black text-gray-700 uppercase tracking-wider">Customer Name</th>
              <th className="text-left py-5 px-8 text-xs font-black text-gray-700 uppercase tracking-wider">Bill Number</th>
              <th className="text-left py-5 px-8 text-xs font-black text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="text-left py-5 px-8 text-xs font-black text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map((payment, index) => (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group">
                <td className="py-5 px-8 text-sm text-gray-700 font-medium">{payment.date}</td>
                <td className="py-5 px-8 text-sm text-gray-900 font-bold group-hover:text-blue-600 transition-colors">{payment.customer}</td>
                <td className="py-5 px-8 text-sm text-gray-700 font-medium">{payment.billNumber}</td>
                <td className="py-5 px-8 text-base text-gray-900 font-bold group-hover:scale-105 transition-transform">
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
