import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Log when routes are loaded
console.log("✅ Product routes loaded at /api/products");
console.log("✅ Payment routes loaded at /api/payment");

// Register API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// Default route to check if server is running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
