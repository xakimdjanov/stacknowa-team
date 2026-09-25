const axios = require("axios");

class InPayService {
  constructor() {
    this.baseUrl = (process.env.INPAY_BASE_URL || "https://inpay.uz/api/v1/").replace(/\/?$/, "/");
    this.merchantId = process.env.INPAY_MERCHANT_ID;
    this.merchantToken = process.env.INPAY_MERCHANT_TOKEN;
    this.cachedBearerToken = null;
    this.tokenExpiresAt = 0;
  }

  /**
   * 1. Get Bearer Token (Valid for 24h)
   * GET /api/v1/authorization/?merchant_id=...&merchant_token=...
   */
  async getBearerToken() {
    const now = Date.now();
    // 23 soat keshlaymiz
    if (this.cachedBearerToken && this.tokenExpiresAt > now) {
      return this.cachedBearerToken;
    }

    try {
      const response = await axios.get(`${this.baseUrl}authorization/`, {
        params: {
          merchant_id: this.merchantId,
          merchant_token: this.merchantToken,
        },
        headers: { Accept: "application/json" },
      });

      if (response.data && response.data.success && response.data.bearer_token) {
        this.cachedBearerToken = response.data.bearer_token;
        this.tokenExpiresAt = now + 23 * 60 * 60 * 1000; // 23h
        return this.cachedBearerToken;
      } else {
        throw new Error(response.data?.message || "inPAY authorization failed");
      }
    } catch (error) {
      console.error("inPAY Auth Error:", error.response?.data || error.message);
      throw new Error(`inPAY auth error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * 2. Create Payment Invoice
   * POST /api/v1/create/
   */
  async createPayment({ amount, description, paymentMethod, phone, clientIp, callbackUrl }) {
    const bearerToken = await this.getBearerToken();

    try {
      const payload = {
        merchant_id: String(this.merchantId),
        token: this.merchantToken,
        amount: Number(amount),
        description: description || "AI Practice Obuna To'lovi",
        callback_url: callbackUrl || process.env.INPAY_CALLBACK_URL,
      };

      if (paymentMethod) payload.payment_method = paymentMethod;
      if (phone) payload.phone = phone;
      if (clientIp) payload.client_ip = clientIp;

      const response = await axios.post(`${this.baseUrl}create/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("inPAY Create Payment Error:", error.response?.data || error.message);
      throw new Error(`inPAY payment creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * 3. Check Transaction Status
   * GET /api/v1/transactions/?order_id=...
   */
  async getTransactionStatus(orderId) {
    try {
      const response = await axios.get(`${this.baseUrl}transactions/`, {
        params: { order_id: orderId },
        headers: { Accept: "application/json" },
      });

      return response.data;
    } catch (error) {
      console.error("inPAY Get Transaction Status Error:", error.response?.data || error.message);
      throw new Error(`inPAY status error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * 4. Merchant Balance Info
   * GET /api/v1/info/merchant/:id
   */
  async getMerchantInfo() {
    const bearerToken = await this.getBearerToken();
    try {
      const response = await axios.get(`${this.baseUrl}info/merchant/${this.merchantId}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("inPAY Merchant Info Error:", error.response?.data || error.message);
      throw new Error(`inPAY info error: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new InPayService();
