import { useState, useEffect } from 'react';
import { Activity, Zap, Gauge, TrendingUp, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import ReportCard from '../common/ReportCard';
import ReportTable from '../common/ReportTable';
import SummaryCards from '../common/SummaryCards';
import * as reportApi from '../../api/reportApi';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
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
      console.log('[ConsumptionReports] Fetching data...');
      
      // Fetch consumption data in parallel
      const [trendsRes, statsRes] = await Promise.all([
        reportApi.getConsumptionByUtility({}),
        reportApi.getMeterReadingStats()
      ]);

      console.log('[ConsumptionReports] Trends response:', trendsRes);
      console.log('[ConsumptionReports] Stats response:', statsRes);

      // Process consumption trends
      if (trendsRes.success && trendsRes.data) {
        setConsumptionTrends(trendsRes.data);
        console.log('[ConsumptionReports] Set consumption trends:', trendsRes.data.length, 'records');
      }

      // Process meter reading stats
      if (statsRes.success && statsRes.data) {
        setMeterReadingStats(statsRes.data);
        console.log('[ConsumptionReports] Set meter stats:', statsRes.data.length, 'records');
      }

    } catch (err) {
      console.error('[ConsumptionReports] Error fetching consumption data:', err);
      setError(err.message || 'Failed to load consumption data');
    } finally {
      setLoading(false);
      console.log('[ConsumptionReports] Loading complete');
    }
  };

  // Calculate summary metrics from meter stats - with safe fallbacks
  const totalReadings = Array.isArray(meterReadingStats) 
    ? meterReadingStats.reduce((sum, stat) => sum + parseInt(stat.total_readings || 0), 0) 
    : 0;
  const actualReadings = Array.isArray(meterReadingStats)
    ? meterReadingStats.reduce((sum, stat) => sum + parseInt(stat.actual_readings || 0), 0)
    : 0;
  const estimatedReadings = Array.isArray(meterReadingStats)
    ? meterReadingStats.reduce((sum, stat) => sum + parseInt(stat.estimated_readings || 0), 0)
    : 0;
  const totalConsumption = Array.isArray(meterReadingStats)
    ? meterReadingStats.reduce((sum, stat) => sum + parseFloat(stat.total_consumption || 0), 0)
    : 0;
  const avgConsumption = Array.isArray(meterReadingStats) && meterReadingStats.length > 0
    ? (meterReadingStats.reduce((sum, stat) => sum + parseFloat(stat.avg_consumption || 0), 0) / meterReadingStats.length).toFixed(2)
    : '0.00';

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
      key: 'month_name', 
      label: 'Month', 
      align: 'left',
      render: (value, row) => `${value} ${row.year}`
    },
    { key: 'utility_type', label: 'Utility', align: 'left' },
    { key: 'customer_type', label: 'Customer Type', align: 'left' },
    { 
      key: 'total_readings', 
      label: 'Total Readings', 
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
      key: 'min_consumption', 
      label: 'Min', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toFixed(2)
    },
    { 
      key: 'max_consumption', 
      label: 'Max', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toFixed(2)
    },
    { 
      key: 'total_consumption', 
      label: 'Total', 
      align: 'right',
      render: (value) => parseFloat(value || 0).toLocaleString()
    }
  ];

  // Prepare chart data by utility - with safe fallback
  const consumptionByUtility = Array.isArray(meterReadingStats) 
    ? meterReadingStats.map(stat => ({
        utility: stat.utility_type,
        avgConsumption: parseFloat(stat.avg_consumption || 0),
        totalConsumption: parseFloat(stat.total_consumption || 0),
        totalReadings: parseInt(stat.total_readings || 0)
      }))
    : [];

  const utilityColors = {
    Electricity: '#f59e0b',
    Water: '#3b82f6',
    Gas: '#ef4444',
    Sewage: '#8b5cf6',
    'Street Lighting': '#10b981'
  };

  // Error boundary fallback
  if (error && !loading) {
    return (
      <div className="consumption-reports">
        <div className="consumption-reports__error" style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#dc2626',
          backgroundColor: '#fee2e2',
          borderRadius: '0.5rem',
          margin: '1rem'
        }}>
          <h3>Error Loading Consumption Reports</h3>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchConsumptionData();
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

      {/* Consumption Trends Table */}
      <ReportCard
        title="Consumption Trends by Month"
        subtitle="Monthly consumption statistics by utility and customer type"
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
