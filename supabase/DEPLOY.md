# Supabase Edge Functions — Canlıya Alma Rehberi

## 1. Supabase CLI ile giriş yap

```bash
supabase login
supabase link --project-ref fsgatrfeyrscjdykrveu
```

## 2. Secrets (ortam değişkenleri) ayarla

iyzico panelinden gerçek API anahtarlarını aldıktan sonra:

```bash
supabase secrets set IYZICO_API_KEY=gerçek_api_key_buraya
supabase secrets set IYZICO_SECRET_KEY=gerçek_secret_key_buraya
supabase secrets set IYZICO_BASE_URL=https://api.iyzipay.com
supabase secrets set FRONTEND_URL=https://erpolart.com
supabase secrets set RESEND_API_KEY=re_Qmxiewj5_67xeeecMeKHijnYszf4p15oT
```

> Sandbox test için:  IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

## 3. Edge Functions'ı deploy et

```bash
supabase functions deploy create-order
supabase functions deploy payment-create
supabase functions deploy payment-callback
```

## 4. iyzico Başvurusu için Callback URL

iyzico başvuru formunda "Callback URL" alanına şunu yaz:

```
https://fsgatrfeyrscjdykrveu.functions.supabase.co/payment-callback
```

## 5. Canlıya geçiş kontrol listesi

- [ ] Supabase secrets'ta gerçek iyzico anahtarları set edildi
- [ ] `IYZICO_BASE_URL` → `https://api.iyzipay.com` (production)
- [ ] Edge Functions deploy edildi
- [ ] iyzico panelinde callback URL tanımlandı
- [ ] Test ödemesi yapıldı (iyzico sandbox'ta)
- [ ] `order-success` ve `order-cancel` sayfaları test edildi
