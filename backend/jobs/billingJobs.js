const cron = require('node-cron');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Mark overdue bills
 * Executes sp_MarkOverdueBills stored procedure to update bill status
 */
const markOverdueBills = async () => {
  try {
    logger.info('Starting scheduled job: Mark Overdue Bills');

    const result = await query('EXEC sp_MarkOverdueBills');
    const billsMarked = result.recordset[0]?.bills_marked_overdue || 0;

    logger.info(`Scheduled job completed: ${billsMarked} bills marked as overdue`);
    
    return billsMarked;
  } catch (error) {
    logger.error(`Error in markOverdueBills job: ${error.message}`);
    throw error;
  }
};

/**
 * Initialize all billing scheduled jobs
 */
const initBillingJobs = () => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    logger.info('Executing daily billing job: Mark Overdue Bills');
    await markOverdueBills();
  }, {
    timezone: "Africa/Nairobi" // Adjust to your timezone
  });

  logger.info('Billing scheduled jobs initialized');
  logger.info('- Mark Overdue Bills: Daily at 00:00');
};

module.exports = {
  initBillingJobs,
  markOverdueBills // Export for manual execution if needed
};
