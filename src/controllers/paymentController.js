import paystack from "../config/paystack.js";

export const initiatePayment = async (req, res) => {
  try {
    const { email, amount, productId } = req.body;

    if (!email || !amount || !productId) {
      return res.status(400).json({ error: "MISSING_FIELDS", message: "Email, amount, and productId are required" });
    }

    const response = await paystack.transaction.initialize({
      email,
      amount: Math.round(amount * 100),
      reference: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currency: "NGN",
      metadata: { productId },
    });

    res.json({ authorizationUrl: response.data.authorization_url, reference: response.data.reference });
  } catch (error) {
    res.status(500).json({ error: "PAYMENT_INIT_FAILED", message: error.message });
  }
};

// ✅ Add verifyPayment function
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ error: "MISSING_REFERENCE", message: "Transaction reference is required" });
    }

    const response = await paystack.transaction.verify(reference);

    if (response.data.status === "success") {
      res.json({ success: true, data: response.data });
    } else {
      res.status(400).json({ error: "PAYMENT_FAILED", message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "PAYMENT_VERIFICATION_FAILED", message: error.message });
  }
};
