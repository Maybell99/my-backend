import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Import this

// Load environment variables
dotenv.config();

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debugging Middleware - Logs all incoming requests
app.use((req, res, next) => {
  console.log("Incoming Request:");
  console.log("Origin:", req.headers.origin || "No Origin");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Headers:", req.headers);
  next();
});

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

// ✅ Serve static files from 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Register API Routes
console.log("✅ Product routes loaded at /api/products");
console.log("✅ Payment routes loaded at /api/checkout");

app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);

// ✅ Debug all registered routes
console.log("\n🔹 Debugging Registered Routes:");
app._router.stack.forEach((middleware) => {
  if (middleware.route) { 
    console.log(`✅ Route registered: ${middleware.route.path}`);
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(`✅ Route registered: ${handler.route.path}`);
      }
    });
  }
});

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
