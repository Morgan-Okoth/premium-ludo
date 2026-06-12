class PaymentService {
  async createPaymentIntent(amount, currency = 'USD') {
    return { ok: true, amount, currency, id: 'pi_demo_' + Date.now() };
  }
}

module.exports = { PaymentService };
