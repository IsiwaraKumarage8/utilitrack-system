import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import * as reportApi from '../../api/reportApi';
import './APITestPanel.css';

/**
 * APITestPanel Component
 * Development tool to test all report API endpoints
 */
const APITestPanel = () => {
  const [tests, setTests] = useState([]);
  const [testing, setTesting] = useState(false);

  const apiTests = [
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
  ];

  const runTests = async () => {
    setTesting(true);
    setTests([]);
    const results = [];

    for (const test of apiTests) {
      try {
        const startTime = Date.now();
        const response = await test.fn();
        const duration = Date.now() - startTime;
        
        results.push({
          name: test.name,
          status: 'success',
          duration,
          data: response
        });
      } catch (error) {
        results.push({
          name: test.name,
          status: 'error',
          error: error.message
        });
      }
      setTests([...results]);
    }

    setTesting(false);
  };

  useEffect(() => {
    // Auto-run tests on mount
    runTests();
  }, []);

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;

  return (
    <div className="api-test-panel">
      <div className="api-test-panel__header">
        <h3>API Integration Test Panel</h3>
        <button 
          className="api-test-panel__button"
          onClick={runTests}
          disabled={testing}
        >
          {testing ? 'Testing...' : 'Run Tests Again'}
        </button>
      </div>

      <div className="api-test-panel__summary">
        <div className="api-test-panel__stat api-test-panel__stat--total">
          Total: {tests.length}/{apiTests.length}
        </div>
        <div className="api-test-panel__stat api-test-panel__stat--success">
          ✓ Passed: {successCount}
        </div>
        <div className="api-test-panel__stat api-test-panel__stat--error">
          ✗ Failed: {errorCount}
        </div>
      </div>

      <div className="api-test-panel__results">
        {apiTests.map((apiTest, index) => {
          const result = tests.find(t => t.name === apiTest.name);
          
          return (
            <div key={index} className="api-test-panel__test">
              <div className="api-test-panel__test-header">
                {!result ? (
                  <Loader className="api-test-panel__icon api-test-panel__icon--loading" size={18} />
                ) : result.status === 'success' ? (
                  <CheckCircle className="api-test-panel__icon api-test-panel__icon--success" size={18} />
                ) : (
                  <XCircle className="api-test-panel__icon api-test-panel__icon--error" size={18} />
                )}
                <span className="api-test-panel__test-name">{apiTest.name}</span>
                {result && result.duration && (
                  <span className="api-test-panel__duration">{result.duration}ms</span>
                )}
              </div>
              
              {result && result.status === 'error' && (
                <div className="api-test-panel__error">
                  Error: {result.error}
                </div>
              )}
              
              {result && result.status === 'success' && result.data && (
                <div className="api-test-panel__success">
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

export default APITestPanel;
