import { useState, useEffect } from 'react';
import { Users, Plug, AlertCircle, DollarSign, UserCheck, FileText, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import WelcomeCard from '../components/WelcomeCard';
import StatsCard from '../../../components/dashboard/StatsCard';
import RevenueChart from '../../../components/dashboard/RevenueChart';
import UtilityPieChart from '../../../components/dashboard/UtilityPieChart';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import QuickActions from '../../../components/dashboard/QuickActions';
import * as reportApi from '../../../api/reportApi';
import * as userApi from '../../../api/userApi';
import './AdminDashboard.css';

/**
 * Admin Dashboard - Complete System Overview
 * Shows comprehensive stats, charts, and system health for administrators
 */
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeConnections: 0,
    unpaidBills: 0,
    unpaidAmount: 0,
    todayRevenue: 0,
    activeUsers: 0,
    pendingComplaints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard summary, today's revenue, and active staff in parallel
      const [summaryResponse, revenueResponse, staffResponse] = await Promise.all([
        reportApi.getDashboardSummary(),
        reportApi.getTodayRevenue(),
        userApi.getActiveStaff()
      ]);
      
      if (summaryResponse.success) {
        const data = summaryResponse.data;
        const revenueData = revenueResponse.success ? revenueResponse.data : {};
        const staffData = staffResponse.success ? staffResponse.data : { active_count: 0 };
        
        // Map API response to dashboard stats
        setStats({
          // Customer stats
          totalCustomers: data.total_customers || 0,
          activeCustomers: data.active_customers || 0,
          customerTrend: calculateTrend(data.active_customers, data.total_customers),
          
          // Connection stats
          activeConnections: data.active_connections || 0,
          totalConnections: data.total_connections || 0,
          connectionTrend: calculateTrend(data.active_connections, data.total_connections),
          
          // Billing stats
          unpaidBills: data.unpaid_bills || 0,
          unpaidAmount: data.total_outstanding || 0,
          billsThisMonth: data.bills_this_month || 0,
          billedThisMonth: data.billed_this_month || 0,
          
          // Today's revenue stats
          todayRevenue: revenueData.today_revenue || 0,
          yesterdayRevenue: revenueData.yesterday_revenue || 0,
          revenueTrend: revenueData.trend_text || '+0%',
          paymentCount: revenueData.payment_count || 0,
          cashPayments: revenueData.cash_payments || 0,
          cardPayments: revenueData.card_payments || 0,
          bankTransferPayments: revenueData.bank_transfer_payments || 0,
          onlinePayments: revenueData.online_payments || 0,
          
          // Monthly revenue stats
          collectedThisMonth: data.collected_this_month || 0,
          
          // Complaint stats
          openComplaints: data.open_complaints || 0,
          inProgressComplaints: data.in_progress_complaints || 0,
          pendingComplaints: (data.open_complaints || 0) + (data.in_progress_complaints || 0),
          
          // Meter stats
          activeMeters: data.active_meters || 0,
          faultyMeters: data.faulty_meters || 0,
          
          // Payment stats
          paymentsThisMonth: data.payments_this_month || 0,
          
          // Active staff stats
          activeUsers: staffData.active_count || 0,
          staffList: staffData.staff_list || [],
          
          // System status
          systemStatus: 'operational',
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate trend percentage
  const calculateTrend = (current, total) => {
    if (!total || total === 0) return '+0%';
    const percentage = ((current / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        <h2>Failed to Load Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  // Calculate quick message based on pending tasks
  const pendingTasks = stats.unpaidBills + stats.pendingComplaints;
  const quickMessage = pendingTasks > 0 
    ? `You have ${pendingTasks} pending tasks today`
    : 'All tasks are up to date!';

  return (
    <div className="admin-dashboard">
      {/* Welcome Card */}
      <WelcomeCard
        userName={user.full_name || user.username}
        userRole={user.role || user.user_role}
        quickMessage={quickMessage}
      />

      {/* Stats Cards Grid */}
      <div className="admin-dashboard__stats-grid">
        <StatsCard
          icon={Users}
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          trend={`${stats.activeCustomers} active customers`}
          color="blue"
        />
        <StatsCard
          icon={Plug}
          title="Active Connections"
          value={stats.activeConnections.toLocaleString()}
          trend={`of ${stats.totalConnections.toLocaleString()} total`}
          color="green"
        />
        <StatsCard
          icon={AlertCircle}
          title="Unpaid Bills"
          value={stats.unpaidBills}
          trend={`Rs. ${stats.unpaidAmount.toLocaleString()} outstanding`}
          color="orange"
        />
        <StatsCard
          icon={DollarSign}
          title="Today's Revenue"
          value={`Rs ${stats.todayRevenue.toLocaleString()}`}
          trend={`${stats.revenueTrend} from yesterday`}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="admin-dashboard__charts-grid">
        <RevenueChart />
        <UtilityPieChart />
      </div>

      {/* Recent Activity Table */}
      <div className="admin-dashboard__recent-activity">
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard__quick-actions">
        <QuickActions />
      </div>

      {/* System Health Cards */}
      <div className="admin-dashboard__system-health">
        <h3 className="admin-dashboard__section-title">System Health</h3>
        <div className="admin-dashboard__health-grid">
          <div className="health-card health-card--success">
            <div className="health-card__icon">
              <UserCheck size={24} />
            </div>
            <div className="health-card__content">
              <p className="health-card__value">{stats.activeUsers}</p>
              <p className="health-card__label">Staff Online</p>
            </div>
          </div>

          <div className="health-card health-card--warning">
            <div className="health-card__icon">
              <FileText size={24} />
            </div>
            <div className="health-card__content">
              <p className="health-card__value">{stats.pendingComplaints}</p>
              <p className="health-card__label">Pending Complaints</p>
            </div>
          </div>

          <div className="health-card health-card--success">
            <div className="health-card__icon">
              <Activity size={24} />
            </div>
            <div className="health-card__content">
              <p className="health-card__value">
                <span className="status-dot status-dot--active"></span>
                Operational
              </p>
              <p className="health-card__label">System Status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
