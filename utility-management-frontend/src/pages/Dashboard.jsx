import { Users, Plug, FileText, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import UtilityPieChart from '../components/dashboard/UtilityPieChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RevenueChart />
        <UtilityPieChart />
      </div>
      
      {/* Recent Activity Table */}
      <div className="mt-8">
        <RecentActivity />
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 mb-8">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
