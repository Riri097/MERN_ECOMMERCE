import express from 'express';
import { registerUser, verifyEmail, authUser, logoutUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verifyEmail); 
router.post('/login', authUser);
router.post('/logout', logoutUser); 

export default router;