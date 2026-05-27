import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, adminLogin, getMe, toggleFavorite, getFavorites, verifyEmail } from '../controllers/authController.js';
import { customerProtect, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.' },
});

// Public Auth
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/admin-login', authLimiter, adminLogin);
router.get('/verifyemail/:verificationToken', verifyEmail);

// User Profile (Customer)
router.get('/me', customerProtect, getMe);
router.get('/favorites', customerProtect, getFavorites);
router.post('/favorites/:templateId', customerProtect, toggleFavorite);

// Admin Data Check (Optional, for dashboard 'ping')
router.get('/admin-me', adminProtect, getMe);

export default router;
