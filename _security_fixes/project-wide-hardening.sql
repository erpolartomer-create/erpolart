-- Proje geneli sertleştirme (03.11.2026) — envanter: kullanıcının pg_policies + grant çıktısı.
-- Aynı Supabase projesi: erpolart, atacelik, lunina-dental (dm1_*), mavera (mv_*), vero villaları (vero_*).

-- 1) KRİTİK: dm1_gallery / dm1_settings herkese ALL açık → yazma politikalarını kaldır, herkese açık okuma kalsın.
do $$
declare p record; t text;
begin
  foreach t in array array['dm1_gallery','dm1_settings'] loop
    for p in select policyname from pg_policies where schemaname='public' and tablename=t and cmd in ('ALL','INSERT','UPDATE','DELETE') loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename=t and cmd='SELECT') then
      execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t || '_public_read', t);
    end if;
    execute format('revoke insert, update, delete, truncate on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- 2) dm1_leads: ALL politikası → yalnız INSERT (iletişim formu). Okuma/güncelleme/silme yok.
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='dm1_leads' loop
    execute format('drop policy %I on public.dm1_leads', p.policyname);
  end loop;
  create policy dm1_leads_public_insert on public.dm1_leads for insert to anon, authenticated with check (true);
end $$;
revoke select, update, delete, truncate on public.dm1_leads from anon, authenticated;
do $$
declare c record;
begin
  for c in select column_name from information_schema.columns
    where table_schema='public' and table_name='dm1_leads' and data_type in ('text','character varying')
      and not exists (select 1 from pg_constraint where conname = 'dm1_leads_len_' || column_name)
  loop
    execute format('alter table public.dm1_leads add constraint %I check (char_length(%I) <= 5000) not valid', 'dm1_leads_len_' || c.column_name, c.column_name);
  end loop;
end $$;

-- 3) erpolart_orders: kullanılmayan eski tablo, herkese INSERT açık → kapat.
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='erpolart_orders' loop
    execute format('drop policy %I on public.erpolart_orders', p.policyname);
  end loop;
end $$;
revoke all on public.erpolart_orders from anon, authenticated;

-- 4) İkinci savunma hattı: politikası olmayan yazma yetkilerini kaldır.
revoke insert, update, delete, truncate on public.dm1_clinics, public.dm1_content, public.dm1_doctors,
  public.dm1_services, public.mv_site_data from anon, authenticated;
revoke insert, update, delete, truncate on public.atacelik_backups from anon;
revoke select on public.atacelik_backups from anon;
revoke all on public.vero_bookings, public.vero_seasonal_prices, public.vero_settings,
  public.vero_users, public.vero_villas from anon, authenticated;
