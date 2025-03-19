import paystack from "../config/paystack.js";

export const initiatePayment = async (req, res) => {
  try {
    console.log("Incoming Payment Request:", req.body); // ✅ Check request data

    const { email, amount, productId } = req.body;

    if (!email || !amount || !productId) {
      return res.status(400).json({ error: "MISSING_FIELDS", message: "Email, amount, and productId are required" });
    }

    console.log("Processed Payment Details:", { email, amount, productId }); // ✅ Check extracted values

    const response = await paystack.transaction.initialize({
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      reference: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currency: "NGN",
      metadata: { productId },
    });

    res.json({ authorizationUrl: response.data.authorization_url, reference: response.data.reference });
  } catch (error) {
    console.error("Payment Initialization Error:", error); // ✅ Log error
    res.status(500).json({ error: "PAYMENT_INIT_FAILED", message: error.message });
  }
};


// ✅ Add verifyPayment function
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

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
