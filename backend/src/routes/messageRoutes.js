import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitMessage, getMyMessages, getAllMessages } from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const messageLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Çok fazla mesaj gönderildi. Lütfen bekleyin.' },
});

router.post('/', messageLimiter, submitMessage);
router.get('/', adminOnly, getAllMessages);
router.get('/:siteId', adminOnly, getMyMessages);

export default router;
