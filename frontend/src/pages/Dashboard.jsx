import { Users, Plug, FileText, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import UtilityPieChart from '../components/dashboard/UtilityPieChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import './Dashboard.css';

/**
 * Main Dashboard Page
 */
const Dashboard = () => {
  const stats = {
    totalCustomers: 1247,
    activeConnections: 3842,
    unpaidBills: 89,
    todayRevenue: 487250,
  };
  
  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="dashboard__header">
        <h2 className="dashboard__title">Dashboard Overview</h2>
        <p className="dashboard__subtitle">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="dashboard__stats-grid">
        <StatsCard
          icon={Users}
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          trend="+5% this month"
          color="blue"
        />
        <StatsCard
          icon={Plug}
          title="Active Connections"
          value={stats.activeConnections.toLocaleString()}
          trend="+8% this month"
          color="green"
        />
        <StatsCard
          icon={FileText}
          title="Unpaid Bills"
          value={stats.unpaidBills}
          trend="-12% from last month"
          color="orange"
        />
        <StatsCard
          icon={TrendingUp}
          title="Today's Revenue"
          value={`Rs ${stats.todayRevenue.toLocaleString()}`}
          trend="+15% from yesterday"
          color="purple"
        />
      </div>
      
      {/* Charts Section */}
      <div className="dashboard__charts-grid">
        <RevenueChart />
        <UtilityPieChart />
      </div>
      
      {/* Recent Activity Table */}
      <div className="dashboard__recent-activity">
        <RecentActivity />
      </div>
      
      {/* Quick Actions */}
      <div className="dashboard__quick-actions">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
