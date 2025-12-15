import { useState } from 'react';
import { FileText, TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';
import ReportFilterBar from '../components/common/ReportFilterBar';
import APITestPanel from '../components/common/APITestPanel';
import RevenueReports from '../components/reports/RevenueReports';
import CollectionReports from '../components/reports/CollectionReports';
import ConsumptionReports from '../components/reports/ConsumptionReports';
import OperationalReports from '../components/reports/OperationalReports';
import './Reports.css';

/**
 * Reports & Analytics Page
 * Comprehensive reporting dashboard with multiple report sections
 */
const Reports = () => {
  const [activeSection, setActiveSection] = useState('revenue');
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    utilityType: 'All',
    customerType: 'All',
    reportType: 'All'
  });

  // Navigation tabs for different report sections
  const reportSections = [
    { id: 'revenue', label: 'Revenue Reports', icon: DollarSign },
    { id: 'collection', label: 'Collection Reports', icon: TrendingUp },
    { id: 'consumption', label: 'Consumption Reports', icon: Activity },
    { id: 'operational', label: 'Operational Reports', icon: BarChart3 }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      utilityType: 'All',
      customerType: 'All',
      reportType: 'All'
    });
  };

  const handleExport = () => {
    // Export functionality will be implemented later
    console.log('Exporting report data...', filters);
  };

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="reports-page__header">
        <div className="reports-page__header-content">
          <FileText className="reports-page__header-icon" size={32} />
          <div>
            <h1 className="reports-page__title">Reports & Analytics</h1>
            <p className="reports-page__subtitle">Comprehensive business intelligence and reporting</p>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="reports-page__tabs">
        {reportSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              className={`reports-page__tab ${activeSection === section.id ? 'reports-page__tab--active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon size={18} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExport={handleExport}
      />

      {/* API Integration Test Panel */}
      <APITestPanel />

      {/* Report Content Area */}
      <div className="reports-page__content">
        {activeSection === 'revenue' && (
          <div className="reports-page__section">
            <h2 className="reports-page__section-title">Revenue Reports</h2>
            <p className="reports-page__section-description">
              View revenue trends, monthly breakdowns, and utility-wise revenue distribution
            </p>
            <RevenueReports filters={filters} />
          </div>
        )}

        {activeSection === 'collection' && (
          <div className="reports-page__section">
            <h2 className="reports-page__section-title">Collection Reports</h2>
            <p className="reports-page__section-description">
              Monitor collection efficiency, unpaid bills, and defaulting customers
            </p>
            <CollectionReports filters={filters} />
          </div>
        )}

        {activeSection === 'consumption' && (
          <div className="reports-page__section">
            <h2 className="reports-page__section-title">Consumption Reports</h2>
            <p className="reports-page__section-description">
              Analyze consumption patterns and meter reading statistics
            </p>
            <ConsumptionReports filters={filters} />
          </div>
        )}

        {activeSection === 'operational' && (
          <div className="reports-page__section">
            <h2 className="reports-page__section-title">Operational Reports</h2>
            <p className="reports-page__section-description">
              Track active connections, payment history, and system activity
            </p>
            <OperationalReports filters={filters} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
