import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Revenue Trend Chart Component
 */
const RevenueChart = () => {
  const data = [
    { month: 'Jul', revenue: 350000 },
    { month: 'Aug', revenue: 420000 },
    { month: 'Sep', revenue: 380000 },
    { month: 'Oct', revenue: 450000 },
    { month: 'Nov', revenue: 510000 },
    { month: 'Dec', revenue: 487250 },
  ];
  
  return (
    <Card>
      <div className="mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Revenue Trends</h3>
        <p className="text-sm text-gray-600 mt-2 font-medium">Last 6 months performance</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl p-4 border border-blue-100/50">
        <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `Rs ${value / 1000}k`}
          />
          <Tooltip 
            formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;
