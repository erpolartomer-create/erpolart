import express from 'express';
import {
  getAllOrders,
  createOrder,
  createPayTRToken,
  paytrCallback,
} from '../controllers/paymentController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sipariş oluşturma (public — misafir ve üye)
router.post('/orders', createOrder);

// PayTR iFrame token (public — order ID ile çağrılır)
router.post('/payment/paytr-token', createPayTRToken);

// PayTR callback (public — PayTR server-to-server POST)
router.post('/payment/paytr-callback', paytrCallback);

// Admin
router.get('/admin/orders', adminProtect, getAllOrders);

export default router;
