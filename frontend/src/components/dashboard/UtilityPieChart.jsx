import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import * as reportApi from '../../api/reportApi';
import './UtilityPieChart.css';

/**
 * Utility Distribution Pie Chart Component - Shows distribution of connections by utility type
 */
const UtilityPieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUtilityDistribution();
  }, []);

  const fetchUtilityDistribution = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportApi.getUtilityDistribution();
      
      if (response.success) {
        const { distribution } = response.data;
        
        // Transform data for pie chart and filter out utilities with no connections
        const transformedData = distribution
          .filter(item => item.value > 0) // Only include utilities with actual connections
          .map(item => ({
            name: item.name,
            value: item.percentage, // Use percentage for display
            count: item.value, // Actual connection count
            revenue: item.revenue,
            color: getUtilityColor(item.name)
          }));
        
        setChartData(transformedData);
      }
    } catch (err) {
      console.error('Error fetching utility distribution:', err);
      setError('Failed to load utility distribution');
      
      // Set fallback data on error (only utilities with connections)
      setChartData([
        { name: 'Electricity', value: 50, count: 500, revenue: 45000, color: '#3B82F6' },
        { name: 'Water', value: 35, count: 350, revenue: 32000, color: '#10B981' },
        { name: 'Gas', value: 15, count: 150, revenue: 18000, color: '#F59E0B' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Color mapping for utilities (matching database utility types)
  const getUtilityColor = (utilityName) => {
    const colors = {
      'Electricity': '#3B82F6',      // Blue
      'Water': '#10B981',            // Green
      'Gas': '#F59E0B',              // Orange
      'Sewage': '#8B5CF6',           // Purple
      'Street Lighting': '#EAB308',  // Yellow (distinct from Gas)
    };
    return colors[utilityName] || '#6B7280'; // Default gray for unknown utilities
  };

  if (loading) {
    return (
      <Card>
        <div className="utility-pie-chart__header">
          <h3 className="utility-pie-chart__title">Utility Distribution</h3>
          <p className="utility-pie-chart__subtitle">Loading...</p>
        </div>
        <div className="utility-pie-chart__loading">
          <div className="spinner-small"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="utility-pie-chart__header">
        <h3 className="utility-pie-chart__title">Utility Distribution</h3>
        <p className="utility-pie-chart__subtitle">
          {error ? 'Using sample data' : 'Active connection breakdown'}
        </p>
      </div>
      <div className="utility-pie-chart__container">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value.toFixed(1)}% (${props.payload.count} connections)`,
                ''
              ]}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default UtilityPieChart;
