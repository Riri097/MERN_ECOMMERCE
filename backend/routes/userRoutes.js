import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyEmail,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.post('/verify-email', verifyEmail);

// User Protected Routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin Routes (Get All, Delete, Update specific user)
router
  .route('/')
  .get(protect, admin, getUsers); // Admin sees list

router
  .route('/:id')
  .delete(protect, admin, deleteUser) // Admin deletes user
  .get(protect, admin, getUserById)   // Admin views user details
  .put(protect, admin, updateUser);   // Admin updates user role/details

export default router;