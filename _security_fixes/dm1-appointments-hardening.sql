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
