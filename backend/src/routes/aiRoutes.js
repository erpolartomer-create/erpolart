import express from 'express';
import rateLimit from 'express-rate-limit';
import { translateText, chatWithAI } from '../controllers/aiController.js';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla istek gönderildi. Lütfen bekleyin.' },
});

router.post('/translate', aiLimiter, translateText);
router.post('/chat', aiLimiter, chatWithAI);

export default router;
