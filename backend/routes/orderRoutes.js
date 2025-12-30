import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

// Create order
router.post("/", protect, createOrder);
router.get('/myorders', protect, getMyOrders);

export default router;
