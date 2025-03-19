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

// CORS Middleware - You only need one cors call here
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-app-besi-ventures.netlify.app"], // Allowed origins
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);

// Mock database with numeric product IDs
const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  // Add more products as needed
];

// Function to get a product from the mock database
const getProductFromDatabase = (productId) => {
  return products.find((product) => product.id === parseInt(productId)); // Ensure productId is treated as an integer
};

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// Route to fetch product by ID
app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  console.log(`Requested product ID: ${productId}`);

  const product = getProductFromDatabase(productId); // Fetch the product by ID
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product); // Return the product if found
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
