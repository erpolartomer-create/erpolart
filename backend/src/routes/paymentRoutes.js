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
  getExchangeRates,
  getInstallmentRates,
} from '../controllers/paymentController.js';
import { adminProtect, customerProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sipariş oluşturma — üyelik zorunlu (giriş yapmış müşteri). user_id req.user'dan gelir.
router.post('/orders', customerProtect, createOrder);

// PayTR iFrame token (public — order ID ile çağrılır)
router.post('/payment/paytr-token', createPayTRToken);

// PayTR Direkt API token (public — form doğrudan paytr.com/odeme'ye POST atar)
router.post('/payment/paytr-direct-token', createPayTRDirectToken);

// PayTR BIN sorgulama (public — kart markası/banka tespiti, taksit için)
router.post('/payment/bin-detail', binDetail);

// Döviz kurları (public — frontend fiyat gösterimi için, cache'li)
router.get('/payment/rates', getExchangeRates);

// Taksit oranları (public — kart markasına göre taksit tutarı gösterimi, cache'li)
router.get('/payment/installment-rates', getInstallmentRates);

// PayTR callback (public — PayTR server-to-server POST)
router.post('/payment/paytr-callback', paytrCallback);

// PayTR sonuç yönlendirmeleri (PayTR POST/GET ile çağırır → 302 frontend'e)
router.all('/payment/success/:orderId', paymentSuccessRedirect);
router.all('/payment/fail', paymentFailRedirect);

// Admin
router.get('/admin/orders', adminProtect, getAllOrders);

export default router;
