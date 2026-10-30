-- ErpolArt — RLS sertleştirme (M1 / M2 / M3)
-- Supabase Dashboard → SQL Editor'da çalıştırın. Önce mevcut durumu görün, sonra uygulayın.
--
-- Mimari notu: Frontend tüm tablo işlemlerini backend proxy (/api/db) üzerinden, backend ise
-- service_role anahtarıyla yapar. service_role RLS'i zaten atlar; dolayısıyla anon/authenticated
-- rollerinin TABLOLARA DOĞRUDAN erişimine gerek yoktur. Aşağıdaki politika seti:
--   * RLS'i tüm hassas tablolarda açar,
--   * anon/authenticated için izin verilen tek şey: `templates` SELECT (katalog) ve
--     giriş yapmış kullanıcının kendi `orders` satırlarını Realtime ile dinlemesi.

-- 0) Mevcut durum
select tablename, rowsecurity from pg_tables where schemaname = 'public'
  and tablename in ('orders','leads','proposals','chat_messages','templates','sites','site_content');
select schemaname, tablename, policyname, roles, cmd, qual, with_check from pg_policies where schemaname = 'public';

-- 1) RLS aç
alter table public.orders        enable row level security;
alter table public.leads         enable row level security;
alter table public.proposals     enable row level security;
alter table public.chat_messages enable row level security;
alter table public.templates     enable row level security;

-- 2) Gevşek politikaları kaldır (create_chat_table.js'in oluşturduğu USING(true) politikaları dahil)
drop policy if exists "chat_select_own"   on public.chat_messages;
drop policy if exists "chat_insert_any"   on public.chat_messages;
drop policy if exists "chat_service_full" on public.chat_messages; -- service_role zaten RLS'i atlar

-- Diğer tablolarda anon/authenticated'a açık ne varsa listeleyip kaldırın:
--   drop policy if exists "<policyname>" on public.<table>;

-- 3) Gerekli minimum politikalar
-- Katalog: herkes şablonları okuyabilir (frontend proxy üzerinden okur ama Realtime/doğrudan okuma zararsız)
drop policy if exists "templates_public_read" on public.templates;
create policy "templates_public_read" on public.templates
  for select to anon, authenticated using (true);

-- Realtime (GlobalSignalReceiver): giriş yapmış kullanıcı yalnızca kendi siparişlerindeki değişiklikleri görür.
-- Realtime, postgres_changes için SELECT politikasını uygular → e-posta filtresi tek başına yetmez.
drop policy if exists "orders_owner_read" on public.orders;
create policy "orders_owner_read" on public.orders
  for select to authenticated
  -- orders.user_id kolonu text tipinde → auth.uid() (uuid) metne çevrilir
  using (user_id = auth.uid()::text or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- leads / proposals / chat_messages: anon ve authenticated için HİÇBİR politika yok → tam kapalı.
-- (Yazma/okuma yalnızca backend service_role ile.)

-- 3b) Tablo yetkileri: Supabase varsayılan olarak anon/authenticated'a ALL verir.
-- Canlı test (29.10.2026): anon PATCH/DELETE/INSERT istekleri yetki hatası almadan RLS'e ulaşıyor.
-- Tüm yazma işlemleri backend service_role ile yapıldığı için doğrudan yazma yetkisini kaldır.
-- (RLS ikinci savunma hattı olarak kalır.)
revoke insert, update, delete, truncate on public.orders, public.leads, public.proposals,
  public.chat_messages, public.templates from anon, authenticated;
revoke select on public.leads, public.proposals, public.chat_messages from anon, authenticated;
-- dm1_appointments ve diğer tablolar için de aynı (varsa):
-- revoke all on public.dm1_appointments from anon, authenticated;

-- 4) Realtime yayını: orders dışındaki tabloları yayından çıkarın (Dashboard → Database → Replication)
--    veya:  alter publication supabase_realtime drop table public.chat_messages;  (yayındaysa)

-- 5) Storage `logos` bucket (M3) — ÖNCELİKLİ
--    CANLI BULGU (29.10.2026): anon `POST /storage/v1/object/list/logos` ile `orders/` altındaki
--    tüm klasörleri listeleyebiliyor → klasör adları SİPARİŞ UUID'leri (8/8). Sipariş ID'si gizli
--    anahtar gibi kullanıldığı için bu, sipariş sayfalarına erişim anahtarlarını herkese açar.
--    Public bucket'ta dosya URL'si ile okuma SELECT politikası gerektirmez; listeleme gerektirir.
--    → anon/authenticated SELECT politikalarını kaldırın:
select policyname, roles, cmd, qual from pg_policies where schemaname = 'storage' and tablename = 'objects';
--    drop policy if exists "<logos için anon SELECT politikası>" on storage.objects;
--
--    Dashboard → Storage → Policies
--    * anon INSERT/UPDATE politikası varsa kaldırın.
--    * authenticated INSERT: bucket_id = 'logos' and (storage.foldername(name))[1] = 'orders'
--    * UPDATE/DELETE: yalnızca service_role (varsayılan)
--    * Public read gerekli (logo URL'leri e-posta/admin panelde gösteriliyor).
--    Örnek:
--    create policy "logos_auth_insert" on storage.objects for insert to authenticated
--      with check (bucket_id = 'logos' and (storage.foldername(name))[1] = 'orders');

-- 6) Doğrulama
select schemaname, tablename, policyname, roles, cmd from pg_policies where schemaname = 'public' order by tablename;
