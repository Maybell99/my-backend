import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables after __dirname is set
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Check if PAYSTACK_SECRET_KEY is loaded
if (!process.env.PAYSTACK_SECRET_KEY) {
  console.error("🚨 PAYSTACK_SECRET_KEY is missing! Check your .env file.");
  process.exit(1);
}

console.log("✅ PAYSTACK_SECRET_KEY loaded:", process.env.PAYSTACK_SECRET_KEY ? "Yes" : "No");

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-app-besi-ventures.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register API Routes
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);

// Default route to check if the server is running
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
