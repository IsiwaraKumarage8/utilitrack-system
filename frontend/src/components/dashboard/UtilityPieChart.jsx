import Card from '../common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './UtilityPieChart.css';

/**
 * Utility Distribution Pie Chart Component
 */
const UtilityPieChart = () => {
  const data = [
    { name: 'Electricity', value: 55, color: '#3B82F6' },
    { name: 'Water', value: 30, color: '#10B981' },
    { name: 'Gas', value: 15, color: '#F59E0B' },
  ];
  
  return (
    <Card>
      <div className="utility-pie-chart__header">
        <h3 className="utility-pie-chart__title">Utility Distribution</h3>
        <p className="utility-pie-chart__subtitle">Current connection breakdown</p>
      </div>
      <div className="utility-pie-chart__container">
        <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default UtilityPieChart;
