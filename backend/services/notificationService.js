class NotificationService {
  sendTo(userId, message) {
    console.log('notify', userId, message);
  }
}

module.exports = { NotificationService };
