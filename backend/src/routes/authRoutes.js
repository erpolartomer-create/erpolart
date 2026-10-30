import express from 'express';
import { getMe, toggleFavorite, getFavorites } from '../controllers/authController.js';
import { customerProtect, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GÜVENLİK: /register, /login, /admin-login kaldırıldı. Bunlar paylaşılan service-role
// istemcisinde signInWithPassword/signUp çağırıyordu → istemcinin bellek içi oturumu kullanıcı
// token'ına dönüyor, sonraki tüm DB sorguları o kullanıcı adına (RLS ile) çalışıyordu.
// Frontend giriş/kayıt işlemlerini doğrudan Supabase Auth ile yapıyor.

// User Profile (Customer)
router.get('/me', customerProtect, getMe);
router.get('/favorites', customerProtect, getFavorites);
router.post('/favorites/:templateId', customerProtect, toggleFavorite);

// Admin Data Check (Optional, for dashboard 'ping')
router.get('/admin-me', adminProtect, getMe);

export default router;
