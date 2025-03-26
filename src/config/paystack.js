import dotenv from "dotenv";
dotenv.config(); // Ensure this loads before anything else

import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Debugging Logs
console.log("🛠 PAYSTACK_SECRET_KEY:", PAYSTACK_SECRET_KEY ? "Loaded" : "❌ MISSING");

if (!PAYSTACK_SECRET_KEY) {
  console.error("🚨 PAYSTACK_SECRET_KEY is missing! Check your environment variables.");
}

async function initiateCheckout(req, res) {
  try {
    console.log("🔥 Received Data:", req.body);

    const { email, amount, name, address, product_id, quantity } = req.body;

    if (!email || !amount || !name || !address || !product_id || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("✅ Initiating Paystack Payment for:", email, "Amount:", amount);

    const headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    console.log("🔑 Using API Key:", headers.Authorization);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert to kobo
        currency: "GHS",
        callback_url: "https://my-app-besi-ventures.netlify.app/order-success",
        metadata: { name, address, product_id, quantity },
      },
      { headers }
    );

    console.log("✅ Payment Initialized Successfully:", paystackResponse.data);

    return res.json(paystackResponse.data);
  } catch (error) {
    console.error("❌ Payment initialization failed:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Payment initialization failed" });
  }
}

async function verifyPayment(req, res) {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ error: "Payment reference is required" });
    }

    console.log("🔍 Verifying Paystack Payment:", reference);

    const headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    };

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers }
    );

    const paymentStatus = paystackResponse.data.data.status;

    if (paymentStatus === "success") {
      console.log("✅ Payment Verified Successfully");
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      console.error("❌ Payment verification failed:", paystackResponse.data);
      return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment verification error" });
  }
}

export { initiateCheckout, verifyPayment };
