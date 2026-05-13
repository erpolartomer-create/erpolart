import express from 'express';
import { submitMessage, getMyMessages, getAllMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitMessage); // Public submission
router.get('/', protect, getAllMessages); // Admin retrieval (All messages)
router.get('/:siteId', protect, getMyMessages); // Private retrieval

export default router;
