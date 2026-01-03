import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
const router = express.Router();

// Create order
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

export default router;
