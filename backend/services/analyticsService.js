class AnalyticsService {
  record(event, data) {
    console.log('analytics', event, data);
  }
}

module.exports = { AnalyticsService };
