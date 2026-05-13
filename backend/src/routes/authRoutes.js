import express from 'express';
import { register, login, adminLogin, getMe, toggleFavorite, getFavorites, verifyEmail } from '../controllers/authController.js';
import { customerProtect, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Auth
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/verifyemail/:verificationToken', verifyEmail);

// User Profile (Customer)
router.get('/me', customerProtect, getMe);
router.get('/favorites', customerProtect, getFavorites);
router.post('/favorites/:templateId', customerProtect, toggleFavorite);

// Admin Data Check (Optional, for dashboard 'ping')
router.get('/admin-me', adminProtect, getMe);

export default router;
