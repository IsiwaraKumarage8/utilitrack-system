const reportModel = require('../models/reportModel');
const { AppError } = require('../middle-ware/errorHandler');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT CONTROLLER
// Handle HTTP requests for various system reports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const reportController = {
  /**
   * GET /api/reports/unpaid-bills - Get unpaid bills report
   * Query params: utility_type, days_overdue_min
   */
  getUnpaidBillsReport: async (req, res, next) => {
    try {
      const { utility_type, days_overdue_min } = req.query;
      
      const filters = {};
      if (utility_type) filters.utility_type = utility_type;
      if (days_overdue_min) filters.days_overdue_min = parseInt(days_overdue_min);
      
      const unpaidBills = await reportModel.getUnpaidBills(filters);
      
      // Calculate summary statistics
      const summary = {
        total_bills: unpaidBills.length,
        total_outstanding: unpaidBills.reduce((sum, bill) => sum + parseFloat(bill.outstanding_balance || 0), 0),
        overdue_count: unpaidBills.filter(bill => bill.is_overdue === 'Yes').length
      };

      res.status(200).json({
        success: true,
        summary,
        count: unpaidBills.length,
        data: unpaidBills
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/defaulters - Get defaulting customers report
   * Query params: days_overdue (default: 30)
   */
  getDefaultersReport: async (req, res, next) => {
    try {
      const { days_overdue } = req.query;
      const daysOverdue = days_overdue ? parseInt(days_overdue) : 30;
      
      const defaulters = await reportModel.getDefaulters(daysOverdue);
      
      // Calculate summary
      const summary = {
        total_defaulters: defaulters.length,
        total_outstanding: defaulters.reduce((sum, d) => sum + parseFloat(d.total_outstanding || 0), 0),
        total_overdue_bills: defaulters.reduce((sum, d) => sum + parseInt(d.overdue_bills_count || 0), 0)
      };

      res.status(200).json({
        success: true,
        summary,
        count: defaulters.length,
        data: defaulters
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/payment-history - Get payment history report
   * Query params: customer_id, start_date, end_date, payment_method
   */
  getPaymentHistoryReport: async (req, res, next) => {
    try {
      const { customer_id, start_date, end_date, payment_method } = req.query;
      
      const filters = {};
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (payment_method) filters.payment_method = payment_method;
      
      const customerId = customer_id ? parseInt(customer_id) : null;
      const paymentHistory = await reportModel.getPaymentHistory(customerId, filters);
      
      // Calculate summary
      const summary = {
        total_payments: paymentHistory.length,
        total_amount: paymentHistory.reduce((sum, p) => sum + parseFloat(p.payment_amount || 0), 0),
        payment_methods: [...new Set(paymentHistory.map(p => p.payment_method))]
      };

      res.status(200).json({
        success: true,
        summary,
        count: paymentHistory.length,
        data: paymentHistory
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/monthly-revenue - Get monthly revenue report
   * Query params: year, month, utility_type
   */
  getMonthlyRevenueReport: async (req, res, next) => {
    try {
      const { year, month, utility_type } = req.query;
      
      const filters = {};
      if (year) filters.year = parseInt(year);
      if (month) filters.month = parseInt(month);
      if (utility_type) filters.utility_type = utility_type;
      
      const revenueData = await reportModel.getMonthlyRevenue(filters);
      
      // Calculate totals
      const summary = {
        total_records: revenueData.length,
        total_billed: revenueData.reduce((sum, r) => sum + parseFloat(r.total_billed_amount || 0), 0),
        total_collected: revenueData.reduce((sum, r) => sum + parseFloat(r.total_collected || 0), 0),
        total_outstanding: revenueData.reduce((sum, r) => sum + parseFloat(r.total_outstanding || 0), 0),
        overall_collection_rate: 0
      };
      
      if (summary.total_billed > 0) {
        summary.overall_collection_rate = parseFloat(
          ((summary.total_collected / summary.total_billed) * 100).toFixed(2)
        );
      }

      res.status(200).json({
        success: true,
        summary,
        count: revenueData.length,
        data: revenueData
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/active-connections - Get active connections report
   * Query params: utility_type, customer_type, city
   */
  getActiveConnectionsReport: async (req, res, next) => {
    try {
      const { utility_type, customer_type, city } = req.query;
      
      const filters = {};
      if (utility_type) filters.utility_type = utility_type;
      if (customer_type) filters.customer_type = customer_type;
      if (city) filters.city = city;
      
      const connections = await reportModel.getActiveConnections(filters);
      
      // Calculate summary
      const summary = {
        total_connections: connections.length,
        utilities: [...new Set(connections.map(c => c.utility_type))],
        customer_types: [...new Set(connections.map(c => c.customer_type))],
        cities: [...new Set(connections.map(c => c.city))]
      };

      res.status(200).json({
        success: true,
        summary,
        count: connections.length,
        data: connections
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/consumption-trends - Get consumption trends report
   * Query params: start_date, end_date, utility_type, customer_type
   */
  getConsumptionTrendsReport: async (req, res, next) => {
    try {
      const { start_date, end_date, utility_type, customer_type } = req.query;
      
      const filters = {};
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (utility_type) filters.utility_type = utility_type;
      if (customer_type) filters.customer_type = customer_type;
      
      const trends = await reportModel.getConsumptionTrends(filters);
      
      // Calculate summary
      const summary = {
        total_periods: trends.length,
        total_consumption: trends.reduce((sum, t) => sum + parseFloat(t.total_consumption || 0), 0),
        total_readings: trends.reduce((sum, t) => sum + parseInt(t.total_readings || 0), 0),
        overall_avg_consumption: 0
      };
      
      if (summary.total_readings > 0) {
        summary.overall_avg_consumption = parseFloat(
          (summary.total_consumption / summary.total_readings).toFixed(2)
        );
      }

      res.status(200).json({
        success: true,
        summary,
        count: trends.length,
        data: trends
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/collection-efficiency - Get collection efficiency report
   * Query params: start_date, end_date, utility_type
   */
  getCollectionEfficiencyReport: async (req, res, next) => {
    try {
      const { start_date, end_date, utility_type } = req.query;
      
      const filters = {};
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (utility_type) filters.utility_type = utility_type;
      
      const efficiency = await reportModel.getCollectionEfficiency(filters);
      
      // Calculate overall summary
      const summary = {
        total_utilities: efficiency.length,
        overall_billed: efficiency.reduce((sum, e) => sum + parseFloat(e.total_billed || 0), 0),
        overall_collected: efficiency.reduce((sum, e) => sum + parseFloat(e.total_collected || 0), 0),
        overall_outstanding: efficiency.reduce((sum, e) => sum + parseFloat(e.total_outstanding || 0), 0),
        overall_rate: 0
      };
      
      if (summary.overall_billed > 0) {
        summary.overall_rate = parseFloat(
          ((summary.overall_collected / summary.overall_billed) * 100).toFixed(2)
        );
      }

      res.status(200).json({
        success: true,
        summary,
        count: efficiency.length,
        data: efficiency
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/dashboard-summary - Get dashboard summary statistics
   */
  getDashboardSummary: async (req, res, next) => {
    try {
      const summary = await reportModel.getDashboardSummary();

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/reading-stats - Get reading statistics by utility type
   */
  getReadingStatsReport: async (req, res, next) => {
    try {
      const stats = await reportModel.getReadingStatsByUtility();
      
      // Calculate overall summary
      const summary = {
        total_utilities: stats.length,
        overall_readings: stats.reduce((sum, s) => sum + parseInt(s.total_readings || 0), 0),
        overall_consumption: stats.reduce((sum, s) => sum + parseFloat(s.total_consumption || 0), 0),
        overall_unprocessed: stats.reduce((sum, s) => sum + parseInt(s.unprocessed_readings || 0), 0)
      };

      res.status(200).json({
        success: true,
        summary,
        count: stats.length,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/today-revenue - Get today's revenue with comparison to yesterday
   */
  getTodayRevenue: async (req, res, next) => {
    try {
      const revenueData = await reportModel.getTodayRevenue();

      res.status(200).json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/revenue-trends - Get revenue trends for charts
   * Query params: months (default: 6)
   */
  getRevenueTrends: async (req, res, next) => {
    try {
      const { months } = req.query;
      const monthsToFetch = months ? parseInt(months) : 6;

      // Validate months parameter
      if (monthsToFetch < 1 || monthsToFetch > 24) {
        return res.status(400).json({
          success: false,
          message: 'Months parameter must be between 1 and 24'
        });
      }

      const trendsData = await reportModel.getRevenueTrends(monthsToFetch);

      res.status(200).json({
        success: true,
        data: trendsData
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/utility-distribution - Get utility distribution statistics
   */
  getUtilityDistribution: async (req, res, next) => {
    try {
      const distributionData = await reportModel.getUtilityDistribution();

      res.status(200).json({
        success: true,
        data: distributionData
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/recent-activity - Get recent system activity
   * Query params: limit (default: 10)
   */
  getRecentActivity: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const recordLimit = limit ? parseInt(limit) : 10;

      // Validate limit parameter
      if (recordLimit < 1 || recordLimit > 50) {
        return res.status(400).json({
          success: false,
          message: 'Limit parameter must be between 1 and 50'
        });
      }

      const activities = await reportModel.getRecentActivity(recordLimit);

      res.status(200).json({
        success: true,
        count: activities.length,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reportController;
