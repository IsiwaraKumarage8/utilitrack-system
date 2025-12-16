import { useState } from 'react';
import { CheckCircle, XCircle, Loader, Play, RefreshCw, CheckCheck } from 'lucide-react';
import * as reportApi from '../api/reportApi';
import customerApi from '../api/customerApi';
import billingApi from '../api/billingApi';
import paymentApi from '../api/paymentApi';
import meterApi from '../api/meterApi';
import meterReadingApi from '../api/meterReadingApi';
import './APITests.css';

/**
 * API Tests Page
 * Comprehensive testing tool for all system APIs
 */
const APITests = () => {
  const [tests, setTests] = useState([]);
  const [testing, setTesting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFailedOnly, setShowFailedOnly] = useState(false);

  // Comprehensive API test definitions organized by category
  const apiTests = {
    reports: [
      { name: 'Dashboard Summary', fn: () => reportApi.getDashboardSummary() },
      { name: 'Today Revenue', fn: () => reportApi.getTodayRevenue() },
      { name: 'Revenue Trends', fn: () => reportApi.getRevenueTrends(6) },
      { name: 'Utility Distribution', fn: () => reportApi.getUtilityDistribution() },
      { name: 'Recent Activity', fn: () => reportApi.getRecentActivity(10) },
      { name: 'Monthly Revenue', fn: () => reportApi.getMonthlyRevenue({}) },
      { name: 'Revenue By Utility', fn: () => reportApi.getRevenueByUtility({}) },
      { name: 'Collection Efficiency', fn: () => reportApi.getCollectionEfficiency({}) },
      { name: 'Unpaid Bills', fn: () => reportApi.getUnpaidBills({}) },
      { name: 'Defaulting Customers', fn: () => reportApi.getDefaultingCustomers(30) },
      { name: 'Consumption By Utility', fn: () => reportApi.getConsumptionByUtility({}) },
      { name: 'Meter Reading Stats', fn: () => reportApi.getMeterReadingStats() },
      { name: 'Active Connections', fn: () => reportApi.getActiveConnections({}) }
    ],
    customers: [
      { name: 'Get All Customers', fn: () => customerApi.getAll() },
      { name: 'Get Customer By ID', fn: () => customerApi.getById(1) },
      { name: 'Search Customers', fn: () => customerApi.search('test') },
      { name: 'Get Customer Stats', fn: () => customerApi.getStats() }
    ],
    billing: [
      { name: 'Get All Bills', fn: () => billingApi.getAllBills() },
      { name: 'Get Bill By ID', fn: () => billingApi.getBillById(1) },
      { name: 'Get Billing Stats', fn: () => billingApi.getBillingStats() },
      { name: 'Search Bills', fn: () => billingApi.searchBills('BILL') },
      { name: 'Filter By Status', fn: () => billingApi.filterByStatus('Unpaid') },
      { name: 'Get Unprocessed Readings', fn: () => billingApi.getUnprocessedReadings() }
    ],
    payments: [
      { name: 'Get All Payments', fn: () => paymentApi.getAllPayments() },
      { name: 'Get Payment By ID', fn: () => paymentApi.getPaymentById(1) },
      { name: 'Search Payments', fn: () => paymentApi.searchPayments('PAY') },
      { name: 'Filter By Status', fn: () => paymentApi.filterByStatus('Completed') },
      { name: 'Filter By Method', fn: () => paymentApi.filterByMethod('Cash') },
      { name: 'Get Payment Stats', fn: () => paymentApi.getPaymentStats() }
    ],
    meters: [
      { name: 'Get All Meters', fn: () => meterApi.getAllMeters() },
      { name: 'Get Meter By ID', fn: () => meterApi.getMeterById(1) },
      { name: 'Search Meters', fn: () => meterApi.searchMeters('meter') },
      { name: 'Get Meter Stats', fn: () => meterApi.getMeterStats() }
    ],
    readings: [
      { name: 'Get All Readings', fn: () => meterReadingApi.getAllReadings() },
      { name: 'Get Reading By ID', fn: () => meterReadingApi.getReadingById(1) },
      { name: 'Search Readings', fn: () => meterReadingApi.searchReadings('reading') }
    ]
  };

  // Flatten all tests for "all" category
  const getAllTests = () => {
    return Object.entries(apiTests).flatMap(([category, tests]) =>
      tests.map(test => ({ ...test, category }))
    );
  };

  const getFilteredTests = () => {
    let filtered;
    if (selectedCategory === 'all') {
      filtered = getAllTests();
    } else {
      filtered = (apiTests[selectedCategory] || []).map(test => ({ ...test, category: selectedCategory }));
    }
    
    // Apply failed-only filter if enabled
    if (showFailedOnly && tests.length > 0) {
      const failedTestNames = tests.filter(t => t.status === 'error').map(t => t.name);
      filtered = filtered.filter(test => failedTestNames.includes(test.name));
    }
    
    return filtered;
  };

  const runTests = async () => {
    setTesting(true);
    setTests([]);
    const results = [];
    const testsToRun = getFilteredTests();

    for (const test of testsToRun) {
      try {
        const startTime = Date.now();
        const response = await test.fn();
        const duration = Date.now() - startTime;
        
        results.push({
          name: test.name,
          category: test.category,
          status: 'success',
          duration,
          data: response
        });
      } catch (error) {
        results.push({
          name: test.name,
          category: test.category,
          status: 'error',
          error: error.message
        });
      }
      setTests([...results]);
    }

    setTesting(false);
  };

  const filteredTests = getFilteredTests();
  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalTests = filteredTests.length;

  return (
    <div className="api-tests-page">
      {/* Page Header */}
      <div className="api-tests-header">
        <div>
          <h1 className="api-tests-title">API Integration Tests</h1>
          <p className="api-tests-subtitle">Test all system APIs to verify connectivity and functionality</p>
        </div>
        <button 
          className="api-tests-run-btn"
          onClick={runTests}
          disabled={testing}
        >
          {testing ? (
            <>
              <Loader className="spin" size={18} />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="api-tests-filters">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('all'); setShowFailedOnly(false); }}
        >
          <CheckCheck size={16} />
          All APIs ({getAllTests().length})
        </button>
        {errorCount > 0 && (
          <button
            className={`filter-btn filter-btn-error ${showFailedOnly ? 'active' : ''}`}
            onClick={() => { setShowFailedOnly(!showFailedOnly); setSelectedCategory('all'); }}
          >
            <XCircle size={16} />
            Failed Only ({errorCount})
          </button>
        )}
        <button
          className={`filter-btn ${selectedCategory === 'reports' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('reports'); setShowFailedOnly(false); }}
        >
          Reports ({apiTests.reports.length})
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'customers' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('customers'); setShowFailedOnly(false); }}
        >
          Customers ({apiTests.customers.length})
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'billing' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('billing'); setShowFailedOnly(false); }}
        >
          Billing ({apiTests.billing.length})
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'payments' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('payments'); setShowFailedOnly(false); }}
        >
          Payments ({apiTests.payments.length})
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'meters' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('meters'); setShowFailedOnly(false); }}
        >
          Meters ({apiTests.meters.length})
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'readings' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('readings'); setShowFailedOnly(false); }}
        >
          Readings ({apiTests.readings.length})
        </button>
      </div>

      {/* Test Summary */}
      <div className="api-tests-summary">
        <div className="summary-card">
          <div className="summary-label">Total Tests</div>
          <div className="summary-value">{tests.length}/{totalTests}</div>
        </div>
        <div className="summary-card summary-card-success">
          <div className="summary-label">✓ Passed</div>
          <div className="summary-value">{successCount}</div>
        </div>
        <div className="summary-card summary-card-error">
          <div className="summary-label">✗ Failed</div>
          <div className="summary-value">{errorCount}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Success Rate</div>
          <div className="summary-value">
            {tests.length > 0 ? Math.round((successCount / tests.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="api-tests-results">
        {filteredTests.map((apiTest, index) => {
          const result = tests.find(t => t.name === apiTest.name);
          
          return (
            <div key={index} className={`test-item ${result?.status || ''}`}>
              <div className="test-header">
                <div className="test-info">
                  {!result ? (
                    <Loader className="test-icon loading spin" size={20} />
                  ) : result.status === 'success' ? (
                    <CheckCircle className="test-icon success" size={20} />
                  ) : (
                    <XCircle className="test-icon error" size={20} />
                  )}
                  <div>
                    <div className="test-name">{apiTest.name}</div>
                    <div className="test-category">{apiTest.category}</div>
                  </div>
                </div>
                {result && result.duration && (
                  <span className="test-duration">{result.duration}ms</span>
                )}
              </div>
              
              {result && result.status === 'error' && (
                <div className="test-error">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
              
              {result && result.status === 'success' && result.data && (
                <div className="test-success">
                  {result.data.success !== undefined && `Success: ${result.data.success}`}
                  {result.data.count !== undefined && ` | Count: ${result.data.count}`}
                  {result.data.data && Array.isArray(result.data.data) && ` | Records: ${result.data.data.length}`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default APITests;
