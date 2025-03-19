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

// Debugging Middleware - Logs all incoming requests
app.use((req, res, next) => {
  console.log("Incoming Request:");
  console.log("Origin:", req.headers.origin);
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Headers:", req.headers);
  next();
});

// CORS Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-app-besi-ventures.netlify.app"], // Update this with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (cookies, auth headers)
  })
);

// Middleware to parse JSON
app.use(express.json());

// Log when routes are loaded
console.log("✅ Product routes loaded at /api/products");
console.log("✅ Payment routes loaded at /api/payment");

// Register API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// Default route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Handle unknown routes (404) - This should be placed at the bottom
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
