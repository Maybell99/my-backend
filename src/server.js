import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware
app.use(cors({ 
  origin: ["http://localhost:5173", "https://my-app-besi-ventures.netlify.app"], 
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
