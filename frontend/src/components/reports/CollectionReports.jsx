import { useState, useEffect } from 'react';
import { AlertCircle, TrendingDown, Users, Clock, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import ReportCard from '../common/ReportCard';
import ReportTable from '../common/ReportTable';
import SummaryCards from '../common/SummaryCards';
import * as reportApi from '../../api/reportApi';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './CollectionReports.css';

/**
 * CollectionReports Component
 * Displays collection analytics including unpaid bills, defaulters, and efficiency metrics
 */
const CollectionReports = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [collectionEfficiency, setCollectionEfficiency] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollectionData();
  }, [filters]);

  const fetchCollectionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all collection data in parallel
      const [unpaidRes, defaultersRes, efficiencyRes] = await Promise.all([
        reportApi.getUnpaidBills({}),
        reportApi.getDefaultingCustomers(30),
        reportApi.getCollectionEfficiency({})
      ]);

      // Process unpaid bills
      if (unpaidRes.success && unpaidRes.data) {
        setUnpaidBills(unpaidRes.data);
        setSummaryStats(unpaidRes.summary || {});
      }

      // Process defaulters
      if (defaultersRes.success && defaultersRes.data) {
        setDefaulters(defaultersRes.data);
      }

      // Process collection efficiency
      if (efficiencyRes.success && efficiencyRes.data) {
        setCollectionEfficiency(efficiencyRes.data);
      }

    } catch (err) {
      console.error('Error fetching collection data:', err);
      setError(err.message || 'Failed to load collection data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const totalUnpaid = summaryStats?.total_bills || 0;
  const totalOutstanding = parseFloat(summaryStats?.total_outstanding || 0);
  const overdueCount = summaryStats?.overdue_count || 0;
  const defaulterCount = defaulters.length;

  // Summary cards data
  const summaryCards = [
    {
      title: 'Unpaid Bills',
      value: totalUnpaid.toLocaleString(),
      subtitle: 'Total unpaid invoices',
      icon: AlertCircle,
      color: 'red',
      trend: -8.5
    },
    {
      title: 'Outstanding Amount',
      value: `Rs. ${totalOutstanding.toLocaleString()}`,
      subtitle: 'Total receivables',
      icon: TrendingDown,
      color: 'yellow',
      trend: -12.3
    },
    {
      title: 'Overdue Bills',
      value: overdueCount.toLocaleString(),
      subtitle: 'Past due date',
      icon: Clock,
      color: 'red',
      trend: -5.7
    },
    {
      title: 'Defaulting Customers',
      value: defaulterCount.toLocaleString(),
      subtitle: '30+ days overdue',
      icon: Users,
      color: 'purple',
      trend: -4.2
    }
  ];

  // Unpaid bills table columns
  const unpaidColumns = [
    { 
      key: 'customer_name', 
      label: 'Customer', 
      align: 'left',
      width: '20%'
    },
    { key: 'utility_type', label: 'Utility', align: 'left' },
    { key: 'bill_number', label: 'Bill No.', align: 'left' },
    { 
      key: 'bill_date', 
      label: 'Bill Date', 
      align: 'left',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'due_date', 
      label: 'Due Date', 
      align: 'left',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'outstanding_balance', 
      label: 'Amount', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { 
      key: 'is_overdue', 
      label: 'Status', 
      align: 'center',
      render: (value) => (
        <span className={`collection-reports__status ${value === 'Yes' ? 'collection-reports__status--overdue' : 'collection-reports__status--pending'}`}>
          {value === 'Yes' ? 'Overdue' : 'Pending'}
        </span>
      )
    }
  ];

  // Defaulters table columns
  const defaultersColumns = [
    { 
      key: 'customer_name', 
      label: 'Customer', 
      align: 'left',
      width: '25%'
    },
    { key: 'contact_number', label: 'Contact', align: 'left' },
    { 
      key: 'total_outstanding', 
      label: 'Total Outstanding', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { key: 'overdue_bills_count', label: 'Overdue Bills', align: 'center' },
    { 
      key: 'oldest_bill_date', 
      label: 'Oldest Bill', 
      align: 'left',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { key: 'days_since_oldest', label: 'Days Overdue', align: 'center' }
  ];

  // Collection efficiency table columns
  const efficiencyColumns = [
    { key: 'month_year', label: 'Month', align: 'left' },
    { 
      key: 'total_billed', 
      label: 'Billed', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { 
      key: 'total_collected', 
      label: 'Collected', 
      align: 'right',
      render: (value) => `Rs. ${parseFloat(value || 0).toLocaleString()}`
    },
    { 
      key: 'collection_rate', 
      label: 'Collection Rate', 
      align: 'center',
      render: (value) => (
        <span className={`collection-reports__rate ${parseFloat(value) >= 80 ? 'collection-reports__rate--good' : parseFloat(value) >= 60 ? 'collection-reports__rate--medium' : 'collection-reports__rate--poor'}`}>
          {parseFloat(value || 0).toFixed(1)}%
        </span>
      )
    },
    { key: 'bills_paid', label: 'Bills Paid', align: 'center' },
    { key: 'bills_pending', label: 'Pending', align: 'center' }
  ];

  // Prepare chart data for unpaid bills by utility
  const unpaidByUtility = unpaidBills.reduce((acc, bill) => {
    const utility = bill.utility_type;
    if (!acc[utility]) {
      acc[utility] = { utility, count: 0, amount: 0 };
    }
    acc[utility].count += 1;
    acc[utility].amount += parseFloat(bill.outstanding_balance || 0);
    return acc;
  }, {});

  const unpaidChartData = Object.values(unpaidByUtility);

  const COLORS = {
    Electricity: '#f59e0b',
    Water: '#3b82f6',
    Gas: '#ef4444',
    Sewage: '#8b5cf6',
    'Street Lighting': '#10b981'
  };

  return (
    <div className="collection-reports">
      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} loading={loading} />

      {/* Unpaid Bills by Utility Chart */}
      <ReportCard
        title="Unpaid Bills by Utility Type"
        subtitle="Distribution of outstanding payments across utilities"
        icon={AlertCircle}
        loading={loading}
        error={error}
        actions={
          <button className="collection-reports__download-btn">
            <Download size={16} />
            Export
          </button>
        }
      >
        <div className="collection-reports__charts-row">
          <div className="collection-reports__chart">
            {unpaidChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={unpaidChartData}
                    dataKey="count"
                    nameKey="utility"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.utility}: ${entry.count}`}
                  >
                    {unpaidChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.utility] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'count' ? 'Bills' : name]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="collection-reports__empty">
                <p>No unpaid bills data available</p>
              </div>
            )}
          </div>

          <div className="collection-reports__chart">
            {unpaidChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unpaidChartData}>
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
                    dataKey="amount" 
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                    name="Outstanding Amount"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="collection-reports__empty">
                <p>No outstanding amount data available</p>
              </div>
            )}
          </div>
        </div>
      </ReportCard>

      {/* Collection Efficiency Table */}
      <ReportCard
        title="Collection Efficiency Trends"
        subtitle="Monthly collection performance metrics"
        icon={TrendingDown}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={efficiencyColumns}
          data={collectionEfficiency}
          loading={loading}
          emptyMessage="No collection efficiency data available"
        />
      </ReportCard>

      {/* Unpaid Bills Table */}
      <ReportCard
        title="Unpaid Bills Details"
        subtitle={`${totalUnpaid} outstanding invoices`}
        icon={AlertCircle}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={unpaidColumns}
          data={unpaidBills.slice(0, 50)}
          loading={loading}
          emptyMessage="No unpaid bills found"
        />
      </ReportCard>

      {/* Defaulting Customers Table */}
      <ReportCard
        title="Defaulting Customers"
        subtitle={`${defaulterCount} customers with 30+ days overdue`}
        icon={Users}
        loading={loading}
        error={error}
      >
        <ReportTable
          columns={defaultersColumns}
          data={defaulters}
          loading={loading}
          emptyMessage="No defaulting customers found"
        />
      </ReportCard>
    </div>
  );
};

CollectionReports.propTypes = {
  filters: PropTypes.object.isRequired
};

export default CollectionReports;
