import { useState, useEffect } from 'react';
import { Activity, Zap, Gauge, TrendingUp, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import ReportCard from '../common/ReportCard';
import ReportTable from '../common/ReportTable';
import SummaryCards from '../common/SummaryCards';
import * as reportApi from '../../api/reportApi';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './ConsumptionReports.css';

/**
 * ConsumptionReports Component
 * Displays consumption analytics including trends and meter reading statistics
 */
const ConsumptionReports = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [consumptionTrends, setConsumptionTrends] = useState([]);
  const [meterReadingStats, setMeterReadingStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsumptionData();
  }, [filters]);

  const fetchConsumptionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch consumption data in parallel
      const [trendsRes, statsRes] = await Promise.all([
        reportApi.getConsumptionByUtility({}),
        reportApi.getMeterReadingStats()
      ]);

      // Process consumption trends
      if (trendsRes.success && trendsRes.data) {
        setConsumptionTrends(trendsRes.data);
      }

      // Process meter reading stats
      if (statsRes.success && statsRes.data) {
        setMeterReadingStats(statsRes.data);
      }

    } catch (err) {
      console.error('Error fetching consumption data:', err);
      setError(err.message || 'Failed to load consumption data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics from meter stats
  const totalReadings = meterReadingStats.reduce((sum, stat) => sum + parseInt(stat.total_readings || 0), 0);
  const actualReadings = meterReadingStats.reduce((sum, stat) => sum + parseInt(stat.actual_readings || 0), 0);
  const estimatedReadings = meterReadingStats.reduce((sum, stat) => sum + parseInt(stat.estimated_readings || 0), 0);
  const totalConsumption = meterReadingStats.reduce((sum, stat) => sum + parseFloat(stat.total_consumption || 0), 0);
  const avgConsumption = meterReadingStats.length > 0
    ? (meterReadingStats.reduce((sum, stat) => sum + parseFloat(stat.avg_consumption || 0), 0) / meterReadingStats.length).toFixed(2)
    : 0;

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Readings',
      value: totalReadings.toLocaleString(),
      subtitle: `${actualReadings} actual readings`,
      icon: Gauge,
      color: 'blue',
      trend: 5.2
    },
    {
      title: 'Actual Readings',
      value: actualReadings.toLocaleString(),
      subtitle: `${estimatedReadings} estimated`,
      icon: Activity,
      color: 'green',
      trend: 12.8
    },
    {
      title: 'Average Consumption',
      value: avgConsumption,
      subtitle: 'Units per reading',
      icon: TrendingUp,
      color: 'purple',
      trend: -3.5
    },
    {
      title: 'Total Consumption',
      value: totalConsumption.toLocaleString(),
      subtitle: 'Units consumed',
      icon: Zap,
      color: 'indigo',
      trend: 2.1
    }
  ];

  // Meter reading stats table columns
  const meterStatsColumns = [
    { key: 'utility_type', label: 'Utility Type', align: 'left' },
    { 
      key: 'total_readings', 
      label: 'Total Readings', 
      align: 'center',
      render: (value) => parseInt(value || 0).toLocaleString()
    },
    { 
      key: 'actual_readings', 
      label: 'Actual', 
      align: 'center',
      render: (value) => parseInt(value || 0).toLocaleString()
    },
    { 
      key: 'estimated_readings', 
      label: 'Estimated', 
      align: 'center',
      render: (value) => parseInt(value || 0).toLocaleString()
    },
    { 
      key: 'avg_consumption', 
      label: 'Avg Consumption', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toFixed(2)
    },
    { 
      key: 'total_consumption', 
      label: 'Total Consumption', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toLocaleString()
    },
    { 
      key: 'unprocessed_readings', 
      label: 'Unprocessed', 
      align: 'center',
      render: (value) => parseInt(value || 0).toLocaleString()
    }
  ];

  // Consumption trends table columns
  const trendsColumns = [
    { 
      key: 'reading_date', 
      label: 'Date', 
      align: 'left',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { key: 'utility_type', label: 'Utility', align: 'left' },
    { key: 'customer_name', label: 'Customer', align: 'left' },
    { 
      key: 'consumption_units', 
      label: 'Consumption', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toLocaleString()
    },
    { 
      key: 'previous_reading', 
      label: 'Previous', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toLocaleString()
    },
    { 
      key: 'current_reading', 
      label: 'Current', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toLocaleString()
    }
  ];

  // Prepare chart data by utility
  const consumptionByUtility = meterReadingStats.map(stat => ({
    utility: stat.utility_type,
    avgConsumption: parseFloat(stat.avg_consumption || 0),
    totalConsumption: parseFloat(stat.total_consumption || 0),
    totalReadings: parseInt(stat.total_readings || 0)
  }));

  const utilityColors = {
    Electricity: '#f59e0b',
    Water: '#3b82f6',
    Gas: '#ef4444',
    Sewage: '#8b5cf6',
    'Street Lighting': '#10b981'
  };

  return (
    <div className="consumption-reports">
      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} loading={loading} />

      {/* Consumption by Utility Chart */}
      <ReportCard
        title="Average Consumption by Utility"
        subtitle="Comparison of consumption patterns across utilities"
        icon={Activity}
        loading={loading}
        error={error}
        actions={
          <button className="consumption-reports__download-btn">
            <Download size={16} />
            Export
          </button>
        }
      >
        <div className="consumption-reports__chart">
          {consumptionByUtility.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={consumptionByUtility}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="utility" 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                <Bar 
                  dataKey="avgConsumption" 
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                  name="Average Consumption"
                />
                <Bar 
                  dataKey="totalConsumption" 
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name="Total Consumption"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="consumption-reports__empty">
              <p>No consumption data available</p>
            </div>
          )}
        </div>
      </ReportCard>

      {/* Reading Volume by Utility */}
      <ReportCard
        title="Reading Volume by Utility"
        subtitle="Total meter readings recorded per utility type"
        icon={Gauge}
        loading={loading}
        error={error}
      >
        <div className="consumption-reports__chart">
          {consumptionByUtility.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumptionByUtility} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                <YAxis 
                  type="category" 
                  dataKey="utility" 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar 
                  dataKey="totalReadings" 
                  name="Total Readings"
                >
                  {consumptionByUtility.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={utilityColors[entry.utility] || '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="consumption-reports__empty">
              <p>No reading data available</p>
            </div>
          )}
        </div>
      </ReportCard>

      {/* Meter Reading Statistics Table */}
      <ReportCard
        title="Meter Reading Statistics"
        subtitle="Comprehensive statistics by utility type"
        icon={Gauge}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={meterStatsColumns}
          data={meterReadingStats}
          loading={loading}
          emptyMessage="No meter statistics available"
        />
      </ReportCard>

      {/* Recent Consumption Trends Table */}
      <ReportCard
        title="Recent Consumption Trends"
        subtitle="Latest meter readings and consumption patterns"
        icon={TrendingUp}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={trendsColumns}
          data={consumptionTrends.slice(0, 50)}
          loading={loading}
          emptyMessage="No consumption trends data available"
        />
      </ReportCard>
    </div>
  );
};

ConsumptionReports.propTypes = {
  filters: PropTypes.object.isRequired
};

export default ConsumptionReports;
