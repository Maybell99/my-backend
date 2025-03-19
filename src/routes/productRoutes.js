import express from "express";
import path from "path";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// Serve images from the 'uploads' directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Get all products
router.get("/", getProducts);

// Get product by ID with logging middleware
router.get("/:id", (req, res, next) => {
  console.log(`📡 Received request for product ID: ${req.params.id}`); // Log the ID for debugging
  next(); // Proceed to the next middleware or route handler
}, getProductById);

export default router;
