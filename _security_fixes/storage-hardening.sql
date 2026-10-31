-- ErpolArt — Storage sertleştirme (gallery / atacelik)  31.10.2026
-- Canlı bulgu: anon anahtarla gallery ve atacelik bucket'ları listelenebiliyor.
-- erpolart.com ve mavera.erpolart.com bundle'larında bu bucket'lara hiçbir referans yok.

-- 1) YEDEK: mevcut storage politikalarını sakla (geri almak için)
create table if not exists public._storage_policy_backup_20261031 as
  select policyname, roles, cmd, permissive, qual, with_check
  from pg_policies where schemaname = 'storage' and tablename = 'objects';
revoke all on public._storage_policy_backup_20261031 from anon, authenticated;

-- 2) gallery: anon/public rollerine açık TÜM politikaları kaldır (okuma/listeleme/yükleme/silme).
--    Bucket "public" ise dosyalar /object/public/gallery/... URL'siyle görünmeye devam eder;
--    yalnızca listeleme, yükleme ve silme kapanır.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and ('public' = any(roles) or 'anon' = any(roles))
      and (coalesce(qual,'') || coalesce(with_check,'')) ilike '%''gallery''%'
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
    raise notice 'kaldırıldı: %', p.policyname;
  end loop;
end $$;

-- 3) atacelik: anon/public okuma (listeleme) politikalarını kaldır. authenticated editor
--    politikaları ekran görüntüsü incelendikten sonra ayrı adımda daraltılacak.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and ('public' = any(roles) or 'anon' = any(roles))
      and (coalesce(qual,'') || coalesce(with_check,'')) ilike '%''atacelik''%'
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
    raise notice 'kaldırıldı: %', p.policyname;
  end loop;
end $$;

-- 4) Kontrol
select policyname, roles, cmd, qual, with_check from pg_policies
where schemaname = 'storage' and tablename = 'objects' order by policyname;
