import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    // SADECE yeni bir sipariş 'awaiting_transfer' durumunda oluşturulduğunda mail at
    if (record.status !== 'awaiting_transfer') {
      return new Response(JSON.stringify({ message: 'Not a new awaiting order' }), { headers: corsHeaders })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ErpolArt <hello@erpolart.com>',
        to: [record.email],
        subject: `ErpolArt: Siparişiniz Alındı (ID: #${record.id.slice(0, 8).toUpperCase()})`,
        html: `
          <div style="font-family: sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 30px; max-width: 600px; margin: auto; border: 1px solid #222;">
            <h1 style="font-style: italic; letter-spacing: -2px; font-size: 32px; margin-bottom: 10px;">ERPOLART</h1>
            <p style="color: #5c73ff; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">SİPARİŞ ÖZETİ & ÖDEME TALİMATI</p>
            <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
            
            <p style="font-size: 16px; line-height: 1.6; color: #ccc;">Sayın <strong>${record.full_name || 'Müşterimiz'}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #ccc;">Siparişiniz başarıyla sistemimize kaydedilmiştir. Kurulum sürecini başlatabilmemiz için aşağıda belirtilen tutarı IBAN adresimize transfer etmenizi rica ederiz.</p>
            
            <div style="background: #111; border-radius: 20px; padding: 30px; margin: 30px 0; border: 1px solid #333;">
              <p style="margin: 0 0 15px 0; color: #5c73ff; font-size: 10px; font-weight: bold; letter-spacing: 2px;">ÖDEME BİLGİLERİ</p>
              <p style="margin: 5px 0; font-size: 18px; color: #fff; font-weight: bold;">Tutar: $${record.amount || '0'}</p>
              <p style="margin: 20px 0 5px 0; color: #888; font-size: 12px;">IBAN (ENPARA):</p>
              <p style="margin: 0; font-size: 14px; color: #fff; font-family: monospace; letter-spacing: 1px;">TR65 0015 7000 0000 0076 6951 02</p>
              <p style="margin: 15px 0 5px 0; color: #888; font-size: 12px;">Alıcı:</p>
              <p style="margin: 0; font-size: 14px; color: #fff;">Ömer Erpolat</p>
              <p style="margin: 15px 0 0 0; color: #ffab00; font-size: 11px;">* Lütfen açıklama kısmına <strong>#${record.id.slice(0, 8).toUpperCase()}</strong> kodunu yazmayı unutmayın.</p>
            </div>

            <a href="https://erpolart.com/order-success/${record.id}" style="display: inline-block; background: #fff; color: #000; padding: 18px 35px; text-decoration: none; border-radius: 15px; font-weight: 900; margin-top: 10px; text-transform: uppercase; font-size: 13px;">Kurulum Formunu Doldur</a>
            
            <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #111;">
              <p style="color: #444; font-size: 10px; margin: 0;">ORDER_ID: ${record.id.toUpperCase()}</p>
              <p style="color: #444; font-size: 10px; margin: 5px 0 0 0;">© 2026 ErpolArt Digital Atelier</p>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})
