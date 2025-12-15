import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as reportApi from '../../api/reportApi';
import './RevenueChart.css';

/**
 * Revenue Trend Chart Component - Shows revenue trends by utility type
 */
const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueTrends();
  }, []);

  const fetchRevenueTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportApi.getRevenueTrends(6);
      
      if (response.success) {
        const { labels, datasets } = response.data;
        
        // Transform data for recharts format
        const transformedData = labels.map((label, index) => {
          const dataPoint = { month: label };
          
          // Add each utility's revenue for this month
          Object.keys(datasets).forEach(utility => {
            dataPoint[utility] = datasets[utility][index] || 0;
          });
          
          return dataPoint;
        });
        
        setChartData(transformedData);
      }
    } catch (err) {
      console.error('Error fetching revenue trends:', err);
      setError('Failed to load revenue trends');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Color mapping for utilities (matching database utility types)
  const utilityColors = {
    'Electricity': '#3B82F6',      // Blue
    'Water': '#06B6D4',            // Cyan
    'Gas': '#F59E0B',              // Orange
    'Sewage': '#8B5CF6',           // Purple
    'Street Lighting': '#EAB308',  // Yellow
  };

  if (loading) {
    return (
      <Card>
        <div className="revenue-chart__header">
          <h3 className="revenue-chart__title">Revenue Trends</h3>
          <p className="revenue-chart__subtitle">Loading...</p>
        </div>
        <div className="revenue-chart__loading">
          <div className="spinner-small"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="revenue-chart__header">
        <h3 className="revenue-chart__title">Revenue Trends</h3>
        <p className="revenue-chart__subtitle">
          {error ? 'Using sample data' : 'Last 6 months by utility type'}
        </p>
      </div>
      <div className="revenue-chart__container">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `Rs ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value) => [`Rs ${value.toLocaleString()}`, '']}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            
            {/* Dynamically render lines for each utility */}
            {chartData.length > 0 && Object.keys(chartData[0])
              .filter(key => key !== 'month')
              .map((utility, index) => (
                <Line 
                  key={utility}
                  type="monotone" 
                  dataKey={utility} 
                  stroke={utilityColors[utility] || `hsl(${index * 120}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;
