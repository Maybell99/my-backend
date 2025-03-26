import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Debugging: Ensure the Paystack secret key is loaded
if (!PAYSTACK_SECRET_KEY) {
  console.error("🚨 PAYSTACK_SECRET_KEY is missing! Check your .env file.");
} else {
  console.log("✅ PAYSTACK_SECRET_KEY Loaded Successfully");
}

// Function to get headers for Paystack requests
const getPaystackHeaders = () => ({
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json"
});

// Initialize Payment Route
router.post("/initialize-payment", async (req, res) => {
    console.log("🔥 Received Request Body:", req.body);

    const { email, amount, name, address, product_id, quantity } = req.body;

    // Validate Required Fields
    if (!email || !amount || !name || !address || !product_id || !quantity) {
        console.log("❌ Missing Fields:", { email, amount, name, address, product_id, quantity });
        return res.status(400).json({ error: "All fields are required" });
    }

    const amountInKobo = parseInt(amount) * 100; // Convert amount to kobo

    try {
        console.log(`✅ Initiating Paystack Payment for ${email}, Amount: ${amountInKobo} kobo`);

        const paystackResponse = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amountInKobo,
                currency: "GHS",
                callback_url: "https://my-app-besi-ventures.netlify.app/order-success",
                metadata: { name, address, product_id, quantity }
            },
            { headers: getPaystackHeaders() } // Ensure headers are included
        );

        console.log("✅ Payment Initialized Successfully:", paystackResponse.data);
        res.status(200).json(paystackResponse.data);
    } catch (error) {
        console.error("❌ PAYSTACK ERROR:", error.response?.data || error.message);
        res.status(500).json({ error: "Payment initialization failed", details: error.response?.data || error.message });
    }
});

// Verify Payment Route
router.post("/verify-payment", async (req, res) => {
    console.log("🔍 Verifying Payment:", req.body);

    const { reference } = req.body;

    if (!reference) {
        console.log("❌ Missing Payment Reference");
        return res.status(400).json({ error: "Payment reference is required" });
    }

    try {
        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            { headers: getPaystackHeaders() } // Ensure headers are included
        );

        const paymentStatus = paystackResponse.data.data.status;

        if (paymentStatus === "success") {
            console.log("✅ Payment Verified Successfully");
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            console.error("❌ Payment Verification Failed:", paystackResponse.data);
            return res.status(400).json({ error: "Payment verification failed" });
        }
    } catch (error) {
        console.error("❌ Payment Verification Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Payment verification error", details: error.response?.data || error.message });
    }
});

export default router;
