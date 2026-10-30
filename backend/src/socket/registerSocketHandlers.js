// Socket.io olay işleyicileri — server.js'ten ayrıldı ki güvenlik testleri gerçek
// bir Socket.io sunucusuyla doğrudan çalıştırabilsin.
export const registerSocketHandlers = (io, { supabase, mutedSessions, isAdminUser }) => {
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Client joins its own chat session room.
    // GÜVENLİK: `user_<uuid>` odaları yalnızca o kullanıcının geçerli token'ıyla açılır;
    // aksi halde sipariş/kullanıcı ID'sini bilen biri admin cevaplarını dinleyebilirdi.
    socket.on('join_session', async (sessionId, token) => {
      if (typeof sessionId !== 'string' || sessionId.length > 120 || sessionId === 'admin_room') return;
      if (sessionId.startsWith('user_')) {
        if (!token) return;
        try {
          const { data: { user }, error } = await supabase.auth.getUser(token);
          if (error || !user || sessionId !== `user_${user.id}`) return;
        } catch {
          return;
        }
      }
      socket.join(sessionId);
    });

    // Admin joins the global admin room (requires valid admin token)
    socket.on('admin_join', async (token) => {
      if (!token) return;
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !isAdminUser(user, token)) return;
        console.log(`Admin ${socket.id} joined admin_room`);
        socket.join('admin_room');
      } catch {
        // ignore invalid token
      }
    });

    // Admin sends a message to a client
    socket.on('admin_send_message', ({ sessionId, content }) => {
      if (!socket.rooms.has('admin_room')) return;
      io.to(sessionId).emit('message', {
        role: 'admin',
        content,
        timestamp: new Date().toISOString()
      });
      io.to('admin_room').emit('admin_message_sent', { sessionId, content });
    });

    // Admin mutes the bot for a session
    socket.on('mute_bot', (sessionId) => {
      if (!socket.rooms.has('admin_room')) return;
      mutedSessions.add(sessionId);
      io.to(sessionId).emit('bot_status_update', { sessionId, isMuted: true });
      io.to('admin_room').emit('bot_status_update', { sessionId, isMuted: true });
    });

    // Admin unmutes the bot for a session
    socket.on('unmute_bot', (sessionId) => {
      if (!socket.rooms.has('admin_room')) return;
      mutedSessions.delete(sessionId);
      io.to(sessionId).emit('bot_status_update', { sessionId, isMuted: false });
      io.to('admin_room').emit('bot_status_update', { sessionId, isMuted: false });
    });

    // Admin checks mute status of a session
    socket.on('check_mute_status', (sessionId) => {
      if (!socket.rooms.has('admin_room')) return;
      const muted = mutedSessions.has(sessionId);
      socket.emit('bot_status_update', { sessionId, isMuted: muted });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
