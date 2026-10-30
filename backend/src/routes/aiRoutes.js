import express from 'express';
import rateLimit from 'express-rate-limit';
import { translateText, chatWithAI } from '../controllers/aiController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla istek gönderildi. Lütfen bekleyin.' },
});

// Yalnızca admin şablon editörü kullanıyor — herkese açık çeviri proxy'si olmasın
router.post('/translate', aiLimiter, adminProtect, translateText);
router.post('/chat', aiLimiter, chatWithAI);

export default router;
