#!/usr/bin/env bash
# ErpolArt — canlı güvenlik doğrulaması (VERİ DEĞİŞTİRMEZ).
# Deploy sonrası çalıştır:  bash _security_fixes/prod-smoke.sh
# Tüm istekler okuma amaçlı veya yazamayacak biçimde (var olmayan id, kimliksiz, geçersiz gövde).

set -u
cd "$(dirname "$0")/.."
API="${API:-https://erpolart-production.up.railway.app}"
SITE="${SITE:-https://erpolart.com}"
SB=$(grep '^VITE_SUPABASE_URL=' .env | cut -d= -f2- | tr -d '"'"'"'\r')
AK=$(grep '^VITE_SUPABASE_ANON_KEY=' .env | cut -d= -f2- | tr -d '"'"'"'\r')
Z=00000000-0000-4000-8000-000000000000
pass=0; fail=0
check() { # ad, beklenen, gerçek
  if [[ "$3" == $2 ]]; then printf "  \033[32mPASS\033[0m %-62s (%s)\n" "$1" "$3"; pass=$((pass+1));
  else printf "  \033[31mFAIL\033[0m %-62s beklenen=%s gerçek=%s\n" "$1" "$2" "$3"; fail=$((fail+1)); fi
}
code() { curl -sS --max-time 20 -o /dev/null -w '%{http_code}' "$@"; }
db() { code -X POST "$API/api/db/$1/query" -H 'Content-Type: application/json' -d "$2"; }

# KORUMA: Bazı kontroller (geçersiz e-postalı form, başkasının chat oturumu) YENİ kodda yazmadan
# reddedilir; ESKİ kodda ise gerçekten satır yazar/e-posta gönderir. Yeni backend canlıda değilse dur.
# Belirteç: eski /api/auth/login ucu yeni kodda kaldırıldı (404).
marker=$(code -X POST "$API/api/auth/login" -H 'Content-Type: application/json' -d '{}')
if [ "$marker" != "404" ]; then
  echo "DURDU: Yeni backend canlıda görünmüyor (/api/auth/login → $marker, beklenen 404)."
  echo "Önce deploy edin; eski kodda bu betiğin bazı istekleri veri yazar."
  exit 2
fi

echo "── Backend proxy ──"
check "K4 ilişki gömme (templates→orders) reddedilir"        403 "$(db templates '{"method":"GET","select":"id,orders(count)","filters":[]}')"
check "K1 dizi gövdeyle sipariş eklenemez"                   400 "$(db orders '{"method":"POST","body":[{"status":"paid"}]}')"
check "K2 proxy ile sipariş eklenemez"                       403 "$(db orders '{"method":"POST","body":{"status":"paid"}}')"
check "anonim sipariş listeleyemez"                          403 "$(db orders '{"method":"GET","select":"id","filters":[]}')"
check "Y5 anonim user_ chat okuyamaz"                        403 "$(db chat_messages "$(printf '{"method":"GET","select":"id","filters":[{"type":"eq","column":"session_id","value":"user_%s"}]}' "$Z")")"
check "Y5 proxy ile chat mesajı yazılamaz"                   403 "$(db chat_messages '{"method":"POST","body":{"session_id":"guest_x","role":"assistant","content":"x"}}')"
check "leads okunamaz"                                       403 "$(db leads '{"method":"GET","select":"id","filters":[]}')"
check "leads geçersiz e-posta reddedilir"                    400 "$(db leads '{"method":"POST","body":{"email":"bozuk","message":"x"}}')"
check "proposals listelenemez"                               403 "$(db proposals '{"method":"GET","select":"id","filters":[]}')"
check "or() alt sorgu reddedilir"                            400 "$(db templates '{"method":"GET","select":"id","filters":[{"type":"or","value":"id.in.(1,2)"}]}')"
check "templates anonim yazılamaz"                           403 "$(db templates "$(printf '{"method":"PATCH","filters":[{"type":"eq","column":"id","value":"%s"}],"body":{"price":1}}' "$Z")")"
check "templates okunur (site çalışıyor)"                    200 "$(db templates '{"method":"GET","select":"id","filters":[]}')"

echo "── Ödeme / auth / AI ──"
check "O2 PayTR direkt token kimlik ister"                   401 "$(code -X POST "$API/api/payment/paytr-direct-token" -H 'Content-Type: application/json' -d "{\"orderId\":\"$Z\"}")"
check "O2 PayTR iframe token kimlik ister"                   401 "$(code -X POST "$API/api/payment/paytr-token" -H 'Content-Type: application/json' -d "{\"orderId\":\"$Z\"}")"
check "K3 order-config kimlik ister"                         401 "$(code -X POST "$API/api/templates/order-config" -H 'Content-Type: application/json' -d "$(printf '{"orderId":"%s","status":"paid"}' "$Z")")"
check "callback sahte hash → paid olmaz"                     200 "$(code -X POST "$API/api/payment/paytr-callback" -d "merchant_oid=${Z//-/}x&status=success&total_amount=1&hash=bad")"
check "success redirect UUID dışı → order-cancel"            "*order-cancel" "$(curl -sS --max-time 20 -o /dev/null -w '%{redirect_url}' "$API/api/payment/success/x")"
check "eski /api/auth/login kaldırıldı"                      404 "$(code -X POST "$API/api/auth/login" -H 'Content-Type: application/json' -d '{}')"
check "/api/ai/translate kimlik ister"                       401 "$(code -X POST "$API/api/ai/translate" -H 'Content-Type: application/json' -d '{"text":"a","targetLanguages":["en"]}')"
check "/api/ai/chat başkasının user_ oturumu"                403 "$(code -X POST "$API/api/ai/chat" -H 'Content-Type: application/json' -d "$(printf '{"message":"x","sessionId":"user_%s"}' "$Z")")"
check "/api/messages geçersiz e-posta"                       400 "$(code -X POST "$API/api/messages" -H 'Content-Type: application/json' -d '{"name":"a","email":"bozuk","message":"x"}')"
check "admin uçları kimliksiz"                               401 "$(code "$API/api/admin/orders")"
check "yabancı origin CORS izni yok"                         "" "$(curl -sS --max-time 20 -o /dev/null -D - -X OPTIONS "$API/api/db/templates/query" -H 'Origin: https://evil.example' -H 'Access-Control-Request-Method: POST' | grep -i '^access-control-allow-origin' | tr -d '\r')"

echo "── Supabase (anon key, doğrudan) ──"
# Satır sayısı başlığı; okuma yetkisi tamamen geri alınmışsa "denied:<kod>"
cnt() { local h; h=$(curl -sS --max-time 20 -o /dev/null -D - -X HEAD "$SB/rest/v1/$1?select=id" -H "apikey: $AK" -H "Authorization: Bearer $AK" -H 'Prefer: count=exact'); local cr; cr=$(echo "$h" | grep -i '^content-range' | tr -d '\r' | awk '{print $2}'); [ -n "$cr" ] && echo "$cr" || echo "denied:$(echo "$h" | head -1 | awk '{print $2}')"; }
check "RLS: anon orders satırı göremez" "*/0" "$(cnt orders)"
for t in leads proposals chat_messages; do check "RLS+REVOKE: anon $t okuyamaz" "denied:40[13]" "$(cnt $t)"; done
check "M3 logos bucket anonim listelenemez" "0" "$(curl -sS --max-time 20 -X POST "$SB/storage/v1/object/list/logos" -H "apikey: $AK" -H "Authorization: Bearer $AK" -H 'Content-Type: application/json' -d '{"prefix":"orders/","limit":100}' | python3 -c 'import json,sys; d=json.load(sys.stdin); print(len(d) if isinstance(d,list) else 0)')"
for b in gallery atacelik; do check "storage: $b bucket anonim listelenemez" "0" "$(curl -sS --max-time 20 -X POST "$SB/storage/v1/object/list/$b" -H "apikey: $AK" -H "Authorization: Bearer $AK" -H 'Content-Type: application/json' -d '{"prefix":"","limit":100}' | python3 -c 'import json,sys; d=json.load(sys.stdin); print(len(d) if isinstance(d,list) else 0)')"; done
check "anon leads INSERT yetkisi kaldırıldı (REVOKE)" "40[13]" "$(code -X POST "$SB/rest/v1/leads" -H "apikey: $AK" -H "Authorization: Bearer $AK" -H 'Content-Type: application/json' -d '[]')"
for t in atacelik_editors atacelik_content; do check "anon $t INSERT yetkisi kaldırıldı" "40[13]" "$(code -X POST "$SB/rest/v1/$t" -H "apikey: $AK" -H "Authorization: Bearer $AK" -H 'Content-Type: application/json' -d '[]')"; done
check "is_atacelik_editor() anonim için false" "false" "$(curl -sS --max-time 20 -X POST "$SB/rest/v1/rpc/is_atacelik_editor" -H "apikey: $AK" -H "Authorization: Bearer $AK" -H 'Content-Type: application/json' -d '{}')"
check "e-posta doğrulaması zorunlu" "False" "$(curl -sS --max-time 20 "$SB/auth/v1/settings" -H "apikey: $AK" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("mailer_autoconfirm"))')"

echo "── Edge Functions ──"
FN="$SB/functions/v1"
# Boş gövdeler: eski sürümde bile mail satırına ulaşmadan hata verir (mail gitmez)
check "Y1 auth-send-email imzasız istek reddedilir"          401 "$(code -X POST "$FN/auth-send-email" -H 'Content-Type: application/json' -d '{}')"
check "R10 send-lead-notification public anahtarla kapalı"   401 "$(code -X POST "$FN/send-lead-notification" -H "Authorization: Bearer $AK" -H "apikey: $AK" -H 'Content-Type: application/json' -d '{}')"
check "send-proposal-email public anahtarla 403"             403 "$(code -X POST "$FN/send-proposal-email" -H "Authorization: Bearer $AK" -H 'Content-Type: application/json' -d '{}')"
for f in create-pricing-order create-order payment-create payment-callback; do check "kaldırılan fonksiyon: $f" 404 "$(code -X POST "$FN/$f" -H 'Content-Type: application/json' -d '{}')"; done

echo "── Site başlıkları ──"
H=$(curl -sS --max-time 20 -o /dev/null -D - "$SITE/")
for h in strict-transport-security content-security-policy x-frame-options x-content-type-options referrer-policy permissions-policy; do
  check "başlık: $h" "1" "$(echo "$H" | grep -ci "^$h:")"
done
check "/.env gerçek dosya değil (SPA)" "1" "$(curl -sS --max-time 20 "$SITE/.env" | grep -c '<div id="root">')"

echo; echo "Sonuç: $pass geçti, $fail kaldı."
[ "$fail" -eq 0 ]
