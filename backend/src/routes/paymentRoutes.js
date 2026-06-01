import express from 'express';
import {
  getAllOrders,
  createOrder,
  createPayTRToken,
  createPayTRDirectToken,
  paytrCallback,
  paymentSuccessRedirect,
  paymentFailRedirect,
  binDetail,
} from '../controllers/paymentController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sipariş oluşturma (public — misafir ve üye)
router.post('/orders', createOrder);

// PayTR iFrame token (public — order ID ile çağrılır)
router.post('/payment/paytr-token', createPayTRToken);

// PayTR Direkt API token (public — form doğrudan paytr.com/odeme'ye POST atar)
router.post('/payment/paytr-direct-token', createPayTRDirectToken);

// PayTR BIN sorgulama (public — kart markası/banka tespiti, taksit için)
router.post('/payment/bin-detail', binDetail);

// PayTR callback (public — PayTR server-to-server POST)
router.post('/payment/paytr-callback', paytrCallback);

// PayTR sonuç yönlendirmeleri (PayTR POST/GET ile çağırır → 302 frontend'e)
router.all('/payment/success/:orderId', paymentSuccessRedirect);
router.all('/payment/fail', paymentFailRedirect);

// Admin
router.get('/admin/orders', adminProtect, getAllOrders);

export default router;
