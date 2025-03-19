import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get product by ID
router.get("/:id", (req, res, next) => {
    console.log(`Received request for product ID: ${req.params.id}`);
    next(); // Allow the request to continue to the handler
  }, getProductById);
  

export default router;
