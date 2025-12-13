import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './RevenueChart.css';

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
      <div className="revenue-chart__header">
        <h3 className="revenue-chart__title">Revenue Trends</h3>
        <p className="revenue-chart__subtitle">Last 6 months performance</p>
      </div>
      <div className="revenue-chart__container">
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
