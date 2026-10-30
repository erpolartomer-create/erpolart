import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Sertleştirilmiş sürüm (canlıdaki önceki sürüm: kimliksiz, CORS '*', kaçışsız HTML).
// Canlı test 30.10.2026: sitenin public (publishable) anahtarı fonksiyon koduna ulaşmaya
// yetiyordu → herkes erpolart.ai@gmail.com'a sınırsız HTML mail gönderebiliyordu.
//
// Bu fonksiyon bir Database Webhook'tan ({ record }) çağrılır. Webhook'un HTTP header'larına
//   Authorization: Bearer <SERVICE_ROLE_KEY>
// eklenmiş olmalıdır (send-order-confirmation ile aynı kalıp). Tarayıcıdan çağrılmaz → CORS yok.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const esc = (v: unknown) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  if (!SERVICE_ROLE_KEY || req.headers.get('Authorization') !== `Bearer ${SERVICE_ROLE_KEY}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { record } = await req.json()
    if (!record || typeof record !== 'object') {
      return new Response(JSON.stringify({ error: 'Bad payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const name = esc(String(record.full_name || '-').slice(0, 120))
    const email = String(record.email || '')
    const plan = esc(String(record.selected_plan || '-').slice(0, 120))
    const safeEmail = EMAIL_RX.test(email) ? email : ''

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Mavera Leads <onboarding@resend.dev>',
        to: ['erpolart.ai@gmail.com'],
        subject: `🚀 Yeni Proje Talebi: ${String(record.full_name || '-').replace(/[\r\n]/g, ' ').slice(0, 120)}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">Yeni Bir Talep Geldi!</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Müşteri:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>E-posta:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(email || '-')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Seçilen Plan:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${plan}</td></tr>
            </table>
            ${safeEmail ? `<br /><a href="mailto:${esc(safeEmail)}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Müşteriye Yanıt Ver</a>` : ''}
          </div>
        `,
      }),
    })

    const data = await res.json().catch(() => ({}))
    return new Response(JSON.stringify(res.ok ? { id: data.id } : { error: 'Mail gönderilemedi' }), {
      headers: { 'Content-Type': 'application/json' },
      status: res.ok ? 200 : 502,
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request' }), { headers: { 'Content-Type': 'application/json' }, status: 400 })
  }
})
