const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/reports/dashboard-summary - Dashboard summary statistics
router.get('/dashboard-summary', reportController.getDashboardSummary);

// GET /api/reports/today-revenue - Today's revenue with comparison
router.get('/today-revenue', reportController.getTodayRevenue);

// GET /api/reports/revenue-trends - Revenue trends for charts
router.get('/revenue-trends', reportController.getRevenueTrends);

// GET /api/reports/utility-distribution - Utility distribution statistics
router.get('/utility-distribution', reportController.getUtilityDistribution);

// GET /api/reports/recent-activity - Recent system activity
router.get('/recent-activity', reportController.getRecentActivity);

// GET /api/reports/unpaid-bills - Unpaid bills report
router.get('/unpaid-bills', reportController.getUnpaidBillsReport);

// GET /api/reports/defaulters - Defaulting customers report
router.get('/defaulters', reportController.getDefaultersReport);

// GET /api/reports/payment-history - Payment history report
router.get('/payment-history', reportController.getPaymentHistoryReport);

// GET /api/reports/monthly-revenue - Monthly revenue report
router.get('/monthly-revenue', reportController.getMonthlyRevenueReport);

// GET /api/reports/active-connections - Active connections report
router.get('/active-connections', reportController.getActiveConnectionsReport);

// GET /api/reports/consumption-trends - Consumption trends report
router.get('/consumption-trends', reportController.getConsumptionTrendsReport);

// GET /api/reports/collection-efficiency - Collection efficiency report
router.get('/collection-efficiency', reportController.getCollectionEfficiencyReport);

// GET /api/reports/reading-stats - Reading statistics by utility type
router.get('/reading-stats', reportController.getReadingStatsReport);

module.exports = router;
