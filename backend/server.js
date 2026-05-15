import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js';
import siteRoutes from './src/routes/siteRoutes.js';
import contentRoutes from './src/routes/contentRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import { supabase } from './src/config/supabase.js';

import { Server } from 'socket.io';
import { createServer } from 'http';

// Load env variables
dotenv.config();

const app = express();

// Bot susturma listesi (In-memory MVP)
const mutedSessions = new Set();
app.set('mutedSessions', mutedSessions);

const httpServer = createServer(app);
const ALLOWED_ORIGINS = [
  'https://erpolart.com',
  'https://www.erpolart.com',
  'https://erpolart-production.up.railway.app',
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
];

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"]
  }
});

// Socket.io instance'ını app'e bağla (controller'lardan erişim için)
app.set('io', io);

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Client or Admin joins a specific session room
  socket.on('join_session', (sessionId) => {
    console.log(`Socket ${socket.id} joining session: ${sessionId}`);
    socket.join(sessionId);
  });

  // Admin joins the global admin room (requires valid admin token)
  socket.on('admin_join', async (token) => {
    if (!token) return;
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      const ADMIN_EMAIL = 'hello@erpolart.com';
      const isAdmin = !error && user && (
        user.email === ADMIN_EMAIL ||
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'admin'
      );
      if (!isAdmin) return;
      console.log(`Admin ${socket.id} joined admin_room`);
      socket.join('admin_room');
    } catch {
      // ignore invalid token
    }
  });

  // Admin sends a message to a client
  socket.on('admin_send_message', ({ sessionId, content }) => {
    console.log(`Admin sending message to session ${sessionId}: ${content}`);
    // Emit to the specific session room
    io.to(sessionId).emit('message', {
      role: 'admin',
      content,
      timestamp: new Date().toISOString()
    });
    // Also notify other admins if any
    io.to('admin_room').emit('admin_message_sent', { sessionId, content });
  });

  // Admin mutes the bot for a session
  socket.on('mute_bot', (sessionId) => {
    console.log(`Muting bot for session: ${sessionId}`);
    mutedSessions.add(sessionId);
    io.to(sessionId).emit('bot_status_update', { sessionId, isMuted: true });
    io.to('admin_room').emit('bot_status_update', { sessionId, isMuted: true });
  });

  // Admin unmutes the bot for a session
  socket.on('unmute_bot', (sessionId) => {
    console.log(`Unmuting bot for session: ${sessionId}`);
    mutedSessions.delete(sessionId);
    io.to(sessionId).emit('bot_status_update', { sessionId, isMuted: false });
    io.to('admin_room').emit('bot_status_update', { sessionId, isMuted: false });
  });

  // Admin checks mute status of a session
  socket.on('check_mute_status', (sessionId) => {
    const muted = mutedSessions.has(sessionId);
    socket.emit('bot_status_update', { sessionId, isMuted: muted });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/sites', siteRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', paymentRoutes);
app.use('/api/ai', aiRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('<h1>ErpolArt API is Running (Supabase Edition)</h1>');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ErpolArt Backend is running on Supabase' });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
