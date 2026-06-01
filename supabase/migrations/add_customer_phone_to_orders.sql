-- Onay e-postasında müşteri telefonunu gösterebilmek için orders tablosuna
-- customer_phone kolonu ekler. createOrder bu kolon yoksa da çalışır (savunmacı insert),
-- ancak kolon eklenince telefon siparişe kaydedilir ve onay e-postasında görünür.
--
-- Supabase Dashboard → SQL Editor'da çalıştırın:

ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone text;
