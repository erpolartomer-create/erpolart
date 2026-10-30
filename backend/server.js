import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import dbRoutes from './src/routes/dbRoutes.js';
import { supabase } from './src/config/supabase.js';
import { isAdminUser } from './src/middleware/authMiddleware.js';
import { registerSocketHandlers } from './src/socket/registerSocketHandlers.js';

import { Server } from 'socket.io';
import { createServer } from 'http';

// Load env variables
dotenv.config();

const app = express();
app.disable('x-powered-by');

// Railway/Cloudflare gibi tek proxy arkasında çalışıyoruz.
// Bu olmadan express-rate-limit X-Forwarded-For'u doğrulayamayıp ValidationError
// fırlatır (tüm /api/db/* çağrıları 500 döner). Ayrıca req.ip'yi gerçek istemci
// IP'sine çevirir — PayTR user_ip için de doğru değer sağlar.
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// Bot susturma listesi (In-memory MVP)
const mutedSessions = new Set();
app.set('mutedSessions', mutedSessions);

const httpServer = createServer(app);
const productionOrigins = [
  'https://erpolart.com',
  'https://www.erpolart.com',
  'https://contractor-os.erpolart.com',
  'https://brand-pulse-ai.erpolart.com',
];

const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? productionOrigins
  : [
      ...productionOrigins,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5252',
      'http://localhost:5253',
      'http://localhost:5254',
      'http://localhost:5255',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5254',
      'http://127.0.0.1:5255',
    ];

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"]
  }
});

// Socket.io instance'ını app'e bağla (controller'lardan erişim için)
app.set('io', io);

registerSocketHandlers(io, { supabase, mutedSessions, isAdminUser });

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// Global Logger
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/db', dbRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('<h1>ErpolArt API is Running (Supabase Edition)</h1>');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ErpolArt Backend is running on Supabase' });
});

// Error Handler Middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  // body-parser gibi ara katmanların kendi durum kodu (ör. bozuk JSON → 400) korunur
  const errStatus = Number(err?.status || err?.statusCode);
  const statusCode = errStatus >= 400 && errStatus < 600 ? errStatus : (res.statusCode === 200 ? 500 : res.statusCode);
  console.error('[UNHANDLED]', err?.message, process.env.NODE_ENV === 'production' ? '' : err?.stack);
  // Hata detayı/stack istemciye sızdırılmaz
  res.status(statusCode).json({ message: statusCode >= 500 ? 'Internal server error' : 'Bad request' });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
