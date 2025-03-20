import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

async function initiateCheckout(req, res) {
  try {
    const { email, amount, name, address, product_id, quantity } = req.body;

    if (!email || !amount || !name || !address || !product_id || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount, // Paystack requires amount in kobo
        currency: "GHS",
        callback_url: "http://localhost:5173/order-success",
        metadata: {
          name,
          address,
          product_id,
          quantity,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json(paystackResponse.data);
  } catch (error) {
    console.error("Payment initialization failed:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
}

async function verifyPayment(req, res) {
  try {
    // Your payment verification logic
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
}

// Ensure you use named exports correctly
export { initiateCheckout, verifyPayment };
