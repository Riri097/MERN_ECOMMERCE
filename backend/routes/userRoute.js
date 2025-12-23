import express from 'express';
import { registerUser, verifyEmail, authUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/verify', verifyEmail); 
router.post('/login', authUser);

export default router;