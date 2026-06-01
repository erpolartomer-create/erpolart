import express from 'express';
import rateLimit from 'express-rate-limit';
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

// Rate limit — kötüye kullanım/spam'e karşı (IP başına). PayTR callback'i ve
// 302 redirect'leri HARİÇ tutulur (onlar PayTR sunucusundan gelir).
const payLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40, // bir checkout ~2-4 istek; 40/15dk normal kullanıcıya bol, spam'i durdurur
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek. Lütfen birazdan tekrar deneyin.' },
});
const binLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 90, // kart girilirken (debounced + cache'li) çağrılır → BIN enumeration'ı sınırlar
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek. Lütfen birazdan tekrar deneyin.' },
});

// Sipariş oluşturma — üyelik zorunlu (giriş yapmış müşteri). user_id req.user'dan gelir.
router.post('/orders', payLimiter, customerProtect, createOrder);

// PayTR iFrame token (public — order ID ile çağrılır)
router.post('/payment/paytr-token', payLimiter, createPayTRToken);

// PayTR Direkt API token (public — form doğrudan paytr.com/odeme'ye POST atar)
router.post('/payment/paytr-direct-token', payLimiter, createPayTRDirectToken);

// PayTR BIN sorgulama (public — kart markası/banka tespiti, taksit için)
router.post('/payment/bin-detail', binLimiter, binDetail);

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
