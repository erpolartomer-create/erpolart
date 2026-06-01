# Güvenlik Düzeltme Planı — ErpolArt.com

## KOD DEĞİŞİKLİKLERİ (Claude yaptı ✅)

- [x] FIX-1: Socket.io admin event auth guard — `backend/server.js`
- [x] FIX-2: Admin login `.includes` → `===` — `backend/src/controllers/authController.js`
- [x] FIX-3: Rate limiting — `backend/src/routes/authRoutes.js` + `messageRoutes.js`
- [x] FIX-4: `getMyMessages` route koruması — `backend/src/routes/messageRoutes.js`
- [x] FIX-5: Edge Function CORS `*` → domain — `supabase/functions/create-pricing-order/index.ts`
- [x] FIX-6: `helmet` middleware import + kullanımı — `backend/server.js`
- [x] FIX-7: Payment callback error sızıntısı — `backend/src/controllers/paymentController.js`
- [x] FIX-8: `delete process.env.GOOGLE_API_KEY` satırı silindi — `backend/src/controllers/aiController.js`
- [x] FIX-9: `.env` temizliği — MongoDB URI, JWT placeholder secrets silindi

## SEN YAPACAKSIN (Manuel Adımlar)

- [ ] MANUEL-1: Terminal'de şunu çalıştır:
      cd /Users/omererpolat/Desktop/erpolart.com/backend && npm install helmet

- [ ] MANUEL-2: Railway Dashboard → erpolart-production → Variables:
      Yeni key'lerin Railway'e eklendiğini doğrula:
        RESEND_API_KEY=<yeni key>
        GEMINI_API_KEY=<yeni key>
        SUPABASE_SERVICE_ROLE_KEY=<yeni key>

- [ ] MANUEL-3: Supabase Edge Function deploy:
      Terminal'de:
        supabase functions deploy create-pricing-order

- [ ] MANUEL-4: Git push → Railway otomatik deploy alır:
      git add -A && git commit -m "fix: security hardening" && git push
