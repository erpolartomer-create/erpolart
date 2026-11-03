-- dm1_appointments: herkese açık randevu formu (INSERT with_check true). Okuma kapalı.
-- Bu dosya formu bozmadan uygulanabilecek kısımdır; sütun bazlı kısıtlar sütun listesi görüldükten sonra.

-- 1) Formun ihtiyacı olmayan yazma yetkileri (RLS zaten engelliyor; ikinci savunma hattı)
revoke update, delete, truncate on public.dm1_appointments from anon, authenticated;

-- 2) Her metin sütununa 5000 karakter üst sınırı (NOT VALID: mevcut kayıtlara dokunmaz, yalnız yeni kayıtları denetler)
do $$
declare c record;
begin
  for c in
    select column_name from information_schema.columns
    where table_schema = 'public' and table_name = 'dm1_appointments'
      and data_type in ('text', 'character varying')
  loop
    execute format(
      'alter table public.dm1_appointments add constraint %I check (char_length(%I) <= 5000) not valid',
      'dm1_len_' || c.column_name, c.column_name);
  end loop;
end $$;

-- 3) Sütunlar (03.11.2026): id uuid, patient_name, phone, email, appointment_date, treatment_type,
--    status (default 'scheduled'), created_at, first_name, last_name, service, appointment_time, notes.
--    Risk: anonim ekleme status/id/created_at alanlarını kendisi belirleyebiliyor (ör. status='confirmed').
--    Çözüm: anon/authenticated eklemelerinde bu alanları sunucu tarafında zorla. Form ne gönderirse göndersin çalışır.
create or replace function public.dm1_appt_sanitize() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
begin
  if current_user in ('anon', 'authenticated') then
    new.id := gen_random_uuid();
    new.status := 'scheduled';
    new.created_at := now();
  end if;
  return new;
end $$;
revoke all on function public.dm1_appt_sanitize() from public, anon, authenticated;
drop trigger if exists dm1_appt_sanitize on public.dm1_appointments;
create trigger dm1_appt_sanitize before insert on public.dm1_appointments
  for each row execute function public.dm1_appt_sanitize();

-- 4) Kontrol
select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.dm1_appointments'::regclass and contype = 'c'
union all
select tgname, 'trigger' from pg_trigger where tgrelid = 'public.dm1_appointments'::regclass and not tgisinternal
union all
select 'grant: ' || grantee, string_agg(privilege_type, ',') from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'dm1_appointments' and grantee in ('anon','authenticated') group by grantee;
