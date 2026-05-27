import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'hello@erpolart.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://erpolart.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Verify caller is admin
  const authHeader = req.headers.get('Authorization') || ''
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }
  try {
    const token = authHeader.split(' ')[1]
    const sc = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: { user }, error: authErr } = await sc.auth.getUser(token)
    const isAdmin = !authErr && user && (
      user.email === ADMIN_EMAIL ||
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin'
    )
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Auth check failed' }), { status: 401, headers: corsHeaders })
  }

  try {
    const { toEmail, toName, proposalUrl, projectName, projectType } = await req.json()

    if (!toEmail || !proposalUrl) {
      return new Response(
        JSON.stringify({ error: 'toEmail and proposalUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const accentColor = projectType === 'automation' ? '#34d399' : '#5c73ff'
    const typeLabel = projectType === 'automation' ? 'AI OTOMASYon' : 'SaaS'
    const displayName = toName || 'Değerli Müşterimiz'
    const displayProject = projectName || `${typeLabel} Projesi`

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 30px; max-width: 600px; margin: auto; border: 1px solid #222;">
        <h1 style="font-style: italic; letter-spacing: -2px; font-size: 32px; margin: 0 0 8px 0;">ERPOLART</h1>
        <p style="color: ${accentColor}; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; margin: 0 0 30px 0;">TEKLİFİNİZ HAZIR</p>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin: 0 0 40px 0;" />

        <p style="font-size: 16px; line-height: 1.7; color: #ccc; margin: 0 0 16px 0;">
          Sayın <strong style="color: #fff;">${displayName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.7; color: #999; margin: 0 0 32px 0;">
          <strong style="color: #fff;">${displayProject}</strong> için hazırladığımız özel teklifiniz artık görüntülemeye hazır.
          Aşağıdaki butona tıklayarak teklifin tüm detaylarına, fiyat bilgisine ve kapsama ulaşabilirsiniz.
        </p>

        <a href="${proposalUrl}"
          style="display: inline-block; background: ${accentColor}; color: #000; padding: 18px 40px; text-decoration: none; border-radius: 14px; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 40px;">
          Teklifi İncele →
        </a>

        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 14px; padding: 20px 24px; margin-bottom: 40px;">
          <p style="color: #555; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Teklif Bağlantısı</p>
          <p style="color: #666; font-size: 11px; margin: 0; font-family: monospace; word-break: break-all;">${proposalUrl}</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #111; margin: 0 0 30px 0;" />

        <p style="color: #333; font-size: 11px; line-height: 1.8; margin: 0;">
          Bu e-posta <strong style="color: #444;">ErpolArt</strong> ekibi tarafından gönderilmiştir.<br/>
          <a href="https://erpolart.com" style="color: ${accentColor}; text-decoration: none;">erpolart.com</a>
          &nbsp;·&nbsp; hello@erpolart.com<br/>
          © 2026 ErpolArt Digital Atelier
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ErpolArt <hello@erpolart.com>',
        to: [toEmail],
        subject: `ErpolArt — Teklifiniz Hazır ✦`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || 'Resend API error')
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
