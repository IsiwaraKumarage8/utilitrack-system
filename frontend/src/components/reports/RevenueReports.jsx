import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart3, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import ReportCard from '../common/ReportCard';
import ReportTable from '../common/ReportTable';
import SummaryCards from '../common/SummaryCards';
import * as reportApi from '../../api/reportApi';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './RevenueReports.css';

/**
 * RevenueReports Component
 * Displays revenue analytics including trends, monthly breakdown, and utility distribution
 */
const RevenueReports = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [utilityRevenue, setUtilityRevenue] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, [filters]);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all revenue data in parallel
      const [summaryRes, trendsRes, monthlyRes, utilityRes] = await Promise.all([
        reportApi.getDashboardSummary(),
        reportApi.getRevenueTrends(6),
        reportApi.getMonthlyRevenue({}),
        reportApi.getRevenueByUtility({})
      ]);

      // Process summary data
      if (summaryRes.success && summaryRes.data) {
        setSummaryData(summaryRes.data);
      }

      // Process trends data
      if (trendsRes.success && trendsRes.data) {
        const chartData = trendsRes.data.labels.map((label, index) => {
          const dataPoint = { month: label };
          trendsRes.data.utilities.forEach(utility => {
            dataPoint[utility] = trendsRes.data.data_points[utility]?.[index] || 0;
          });
          return dataPoint;
        });
        setTrendsData(chartData);
      }

      // Process monthly data
      if (monthlyRes.success && monthlyRes.data) {
        setMonthlyData(monthlyRes.data);
      }

      // Process utility revenue
      if (utilityRes.success && utilityRes.data) {
        // utilityRes.data is an object with 'distribution' and 'summary' properties
        const distributionArray = utilityRes.data.distribution || [];
        const utilityData = distributionArray
          .filter(item => item.value > 0)
          .map(item => ({
            utility: item.name,
            revenue: parseFloat(item.total_revenue || 0),
            connections: item.value,
            avgRevenue: item.value > 0 
              ? (parseFloat(item.total_revenue || 0) / item.value).toFixed(2)
              : 0
          }));
        setUtilityRevenue(utilityData);
      }

    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError(err.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  // Summary cards data
  const summaryCards = summaryData ? [
    {
      title: 'Total Revenue (This Month)',
      value: `Rs. ${parseFloat(summaryData.billed_this_month || 0).toLocaleString()}`,
      subtitle: `${summaryData.bills_this_month || 0} bills generated`,
      icon: DollarSign,
      color: 'green',
      trend: 12.5
    },
    {
      title: 'Revenue Collected',
      value: `Rs. ${parseFloat(summaryData.collected_this_month || 0).toLocaleString()}`,
      subtitle: `${summaryData.payments_this_month || 0} payments received`,
      icon: TrendingUp,
      color: 'blue',
      trend: 8.3
    },
    {
      title: 'Outstanding Amount',
      value: `Rs. ${parseFloat(summaryData.total_outstanding || 0).toLocaleString()}`,
      subtitle: `${summaryData.unpaid_bills || 0} unpaid bills`,
      icon: BarChart3,
      color: 'red',
      trend: -5.2
    },
    {
      title: 'Collection Rate',
      value: summaryData.billed_this_month > 0 
        ? `${((summaryData.collected_this_month / summaryData.billed_this_month) * 100).toFixed(1)}%`
        : '0%',
      subtitle: 'Of total billed amount',
      icon: TrendingUp,
      color: 'purple',
      trend: 3.7
    }
  ] : [];

  // Monthly revenue table columns
  const monthlyColumns = [
    { key: 'month_year', label: 'Month', align: 'left' },
    { key: 'utility_type', label: 'Utility', align: 'left' },
    { 
      key: 'total_revenue', 
      label: 'Revenue', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { key: 'total_bills', label: 'Bills', align: 'center' },
    { 
      key: 'avg_bill_amount', 
      label: 'Avg Bill', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    }
  ];

  // Utility revenue table columns
  const utilityColumns = [
    { key: 'utility', label: 'Utility Type', align: 'left' },
    { 
      key: 'revenue', 
      label: 'Total Revenue', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { key: 'connections', label: 'Connections', align: 'center' },
    { 
      key: 'avgRevenue', 
      label: 'Avg per Connection', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    }
  ];

  const utilityColors = {
    Electricity: '#f59e0b',
    Water: '#3b82f6',
    Gas: '#ef4444',
    Sewage: '#8b5cf6',
    'Street Lighting': '#10b981'
  };

  return (
    <div className="revenue-reports">
      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} loading={loading} />

      {/* Revenue Trends Chart */}
      <ReportCard
        title="Revenue Trends (Last 6 Months)"
        subtitle="Monthly revenue breakdown by utility type"
        icon={TrendingUp}
        loading={loading}
        error={error}
        actions={
          <button className="revenue-reports__download-btn">
            <Download size={16} />
            Export
          </button>
        }
      >
        <div className="revenue-reports__chart">
          {trendsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                  tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => `Rs. ${parseFloat(value).toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                {Object.keys(utilityColors).map(utility => (
                  <Line
                    key={utility}
                    type="monotone"
                    dataKey={utility}
                    stroke={utilityColors[utility]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="revenue-reports__empty">
              <p>No revenue data available for the selected period</p>
            </div>
          )}
        </div>
      </ReportCard>

      {/* Revenue by Utility Chart */}
      <ReportCard
        title="Revenue Distribution by Utility"
        subtitle="Comparison of revenue across different utility types"
        icon={BarChart3}
        loading={loading}
        error={error}
      >
        <div className="revenue-reports__chart">
          {utilityRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilityRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="utility" 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                  tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => `Rs. ${parseFloat(value).toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="revenue-reports__empty">
              <p>No utility revenue data available</p>
            </div>
          )}
        </div>
      </ReportCard>

      {/* Monthly Revenue Table */}
      <ReportCard
        title="Monthly Revenue Breakdown"
        subtitle="Detailed monthly revenue by utility type"
        icon={DollarSign}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={monthlyColumns}
          data={monthlyData}
          loading={loading}
          emptyMessage="No monthly revenue data available"
        />
      </ReportCard>

      {/* Utility Revenue Summary Table */}
      <ReportCard
        title="Revenue Summary by Utility"
        subtitle="Total revenue and averages per utility type"
        icon={BarChart3}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={utilityColumns}
          data={utilityRevenue}
          loading={loading}
          emptyMessage="No utility revenue data available"
        />
      </ReportCard>
    </div>
  );
};

RevenueReports.propTypes = {
  filters: PropTypes.object.isRequired
};

export default RevenueReports;
