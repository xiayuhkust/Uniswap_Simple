const cron = require('node-cron');
const poolService = require('./pool');
const { logger } = require('../utils');

/**
 * Initialize scheduled tasks
 */
const initializeScheduledTasks = () => {
  // Reset 24h volume at midnight every day
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Resetting 24h volume for all pools');
      await poolService.reset24hVolume();
    } catch (error) {
      logger.error('Error resetting 24h volume', error);
    }
  });

  // Reset weekly volume at midnight on Sunday
  cron.schedule('0 0 * * 0', async () => {
    try {
      logger.info('Resetting weekly volume for all pools');
      await poolService.resetWeeklyVolume();
    } catch (error) {
      logger.error('Error resetting weekly volume', error);
    }
  });

  logger.info('Scheduled tasks initialized');
};

module.exports = {
  initializeScheduledTasks
};
