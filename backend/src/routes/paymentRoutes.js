import express from 'express';
import { getAllOrders } from '../controllers/paymentController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Order routes (payment flow is handled by Supabase Edge Functions)
router.get('/admin/orders', adminProtect, getAllOrders);

export default router;
