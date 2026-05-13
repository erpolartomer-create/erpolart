import express from 'express';
import { getContent, updateContent } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:siteId', getContent);
router.put('/:siteId', protect, updateContent); // Only owner can update

export default router;
