import express from "express";
import { initiateCheckout, verifyPayment } from "../controllers/checkoutController.js";

const router = express.Router();

// Debugging logs to ensure routes are loaded
console.log("✅ Checkout routes loaded...");

router.post("/initialize-payment", (req, res) => {
  console.log("🔥 /initialize-payment endpoint hit!");
  initiateCheckout(req, res);
});

router.post("/verify-payment", (req, res) => {
  console.log("🔥 /verify-payment endpoint hit!");
  verifyPayment(req, res);
});

export default router;
