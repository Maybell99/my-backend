import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get product by ID
router.get("/:id", getProductById);

export default router;
