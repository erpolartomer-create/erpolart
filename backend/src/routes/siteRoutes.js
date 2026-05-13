import express from 'express';
import { createSite, getMySites } from '../controllers/siteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All site routes are protected

router.post('/', createSite);
router.get('/', getMySites);

export default router;
