import express from 'express';
const router = express.Router();
import { getProducts, getProductById, createProduct, updateProduct,} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// /api/products
router.route('/')
  .get(getProducts)                     
  .post(protect, admin, createProduct); 

// /api/products/:id
router.route('/:id')
  .get(getProductById)                  
  .put(protect, admin, updateProduct);  

export default router;