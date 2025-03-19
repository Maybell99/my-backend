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
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-app-besi-ventures.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Mock Database
const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
];

// Function to Get Product by ID
const getProductFromDatabase = (productId) => {
  return products.find((product) => product.id === parseInt(productId));
};

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// Route to Fetch Product by ID
app.get("/api/products/:productId", (req, res) => {
  const { productId } = req.params;
  console.log(`🔍 Requested product ID: ${productId}`);

  const product = getProductFromDatabase(productId);
  if (!product) {
    return res.status(404).json({ message: "❌ Product not found" });
  }
  res.json(product);
});

// Start Server (Listening on 0.0.0.0 for Render Deployment)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
