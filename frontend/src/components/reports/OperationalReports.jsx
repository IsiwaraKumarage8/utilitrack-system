import { useState, useEffect } from 'react';
import { Network, CreditCard, Calendar, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import ReportCard from '../common/ReportCard';
import ReportTable from '../common/ReportTable';
import SummaryCards from '../common/SummaryCards';
import * as reportApi from '../../api/reportApi';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './OperationalReports.css';

/**
 * OperationalReports Component
 * Displays operational metrics including active connections and payment history
 */
const OperationalReports = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [activeConnections, setActiveConnections] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOperationalData();
  }, [filters]);

  const fetchOperationalData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch operational data in parallel
      const [connectionsRes, paymentsRes] = await Promise.all([
        reportApi.getActiveConnections({}),
        reportApi.getPaymentHistoryReport({})
      ]);

      // Process active connections
      if (connectionsRes.success && connectionsRes.data) {
        setActiveConnections(connectionsRes.data);
      }

      // Process payment history
      if (paymentsRes.success && paymentsRes.data) {
        setPaymentHistory(paymentsRes.data);
      }

    } catch (err) {
      console.error('Error fetching operational data:', err);
      setError(err.message || 'Failed to load operational data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const totalConnections = activeConnections.length;
  const totalPayments = paymentHistory.length;
  const totalPaymentAmount = paymentHistory.reduce((sum, payment) => 
    sum + parseFloat(payment.payment_amount || 0), 0
  );
  const avgPayment = totalPayments > 0 ? (totalPaymentAmount / totalPayments) : 0;

  // Group connections by utility
  const connectionsByUtility = activeConnections.reduce((acc, conn) => {
    const utility = conn.utility_type;
    if (!acc[utility]) {
      acc[utility] = { utility, count: 0 };
    }
    acc[utility].count += 1;
    return acc;
  }, {});

  const connectionChartData = Object.values(connectionsByUtility);

  // Group connections by customer type
  const connectionsByType = activeConnections.reduce((acc, conn) => {
    const type = conn.customer_type;
    if (!acc[type]) {
      acc[type] = { type, count: 0 };
    }
    acc[type].count += 1;
    return acc;
  }, {});

  const typeChartData = Object.values(connectionsByType);

  // Summary cards data
  const summaryCards = [
    {
      title: 'Active Connections',
      value: totalConnections.toLocaleString(),
      subtitle: 'Total service connections',
      icon: Network,
      color: 'blue',
      trend: 7.3
    },
    {
      title: 'Total Payments',
      value: totalPayments.toLocaleString(),
      subtitle: 'Payment transactions',
      icon: CreditCard,
      color: 'green',
      trend: 15.6
    },
    {
      title: 'Total Amount',
      value: `Rs. ${totalPaymentAmount.toLocaleString()}`,
      subtitle: 'Payment received',
      icon: Calendar,
      color: 'purple',
      trend: 12.4
    },
    {
      title: 'Average Payment',
      value: `Rs. ${avgPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      subtitle: 'Per transaction',
      icon: CreditCard,
      color: 'indigo',
      trend: -3.2
    }
  ];

  // Active connections table columns
  const connectionsColumns = [
    { key: 'customer_name', label: 'Customer', align: 'left', width: '20%' },
    { key: 'utility_type', label: 'Utility', align: 'left' },
    { key: 'customer_type', label: 'Type', align: 'left' },
    { 
      key: 'connection_date', 
      label: 'Connected On', 
      align: 'left',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { key: 'meter_number', label: 'Meter No.', align: 'left' },
    { key: 'connection_status', label: 'Status', align: 'center',
      render: (value) => (
        <span className={`operational-reports__status operational-reports__status--${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  // Payment history table columns
  const paymentsColumns = [
    { 
      key: 'payment_date', 
      label: 'Date', 
      align: 'left',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { key: 'customer_name', label: 'Customer', align: 'left', width: '20%' },
    { key: 'bill_number', label: 'Bill No.', align: 'left' },
    { 
      key: 'payment_amount', 
      label: 'Amount', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { key: 'payment_method', label: 'Method', align: 'center' },
    { key: 'payment_status', label: 'Status', align: 'center',
      render: (value) => (
        <span className={`operational-reports__payment operational-reports__payment--${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  const utilityColors = {
    Electricity: '#f59e0b',
    Water: '#3b82f6',
    Gas: '#ef4444',
    Sewage: '#8b5cf6',
    'Street Lighting': '#10b981'
  };

  const typeColors = {
    Residential: '#3b82f6',
    Commercial: '#f59e0b',
    Industrial: '#ef4444'
  };

  return (
    <div className="operational-reports">
      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} loading={loading} />

      {/* Connection Distribution Charts */}
      <ReportCard
        title="Active Connection Distribution"
        subtitle="Breakdown of connections by utility and customer type"
        icon={Network}
        loading={loading}
        error={error}
        actions={
          <button className="operational-reports__download-btn">
            <Download size={16} />
            Export
          </button>
        }
      >
        <div className="operational-reports__charts-row">
          <div className="operational-reports__chart">
            <h4 className="operational-reports__chart-title">By Utility Type</h4>
            {connectionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={connectionChartData}
                    dataKey="count"
                    nameKey="utility"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.utility}: ${entry.count}`}
                  >
                    {connectionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={utilityColors[entry.utility] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="operational-reports__empty">
                <p>No connection data available</p>
              </div>
            )}
          </div>

          <div className="operational-reports__chart">
            <h4 className="operational-reports__chart-title">By Customer Type</h4>
            {typeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="type" 
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
                  <Bar 
                    dataKey="count" 
                    name="Connections"
                    radius={[8, 8, 0, 0]}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={typeColors[entry.type] || '#6b7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="operational-reports__empty">
                <p>No customer type data available</p>
              </div>
            )}
          </div>
        </div>
      </ReportCard>

      {/* Active Connections Table */}
      <ReportCard
        title="Active Connections Details"
        subtitle={`${totalConnections} active service connections`}
        icon={Network}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={connectionsColumns}
          data={activeConnections.slice(0, 50)}
          loading={loading}
          emptyMessage="No active connections found"
        />
      </ReportCard>

      {/* Payment History Table */}
      <ReportCard
        title="Recent Payment History"
        subtitle={`${totalPayments} payment transactions`}
        icon={CreditCard}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={paymentsColumns}
          data={paymentHistory.slice(0, 50)}
          loading={loading}
          emptyMessage="No payment history found"
        />
      </ReportCard>
    </div>
  );
};

OperationalReports.propTypes = {
  filters: PropTypes.object.isRequired
};

export default OperationalReports;
