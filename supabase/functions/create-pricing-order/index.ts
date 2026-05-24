import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendKey = Deno.env.get('RESEND_API_KEY');

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const {
      email, full_name, phone, company, notes,
      source, tier, base, extras = [], extTotal = 0,
      total, maintenance = false, monthly = 0,
      user_id = null,
    } = await req.json();

    if (!email || !full_name || !total) {
      return new Response(
        JSON.stringify({ success: false, message: 'Gerekli alanlar eksik.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const insertPayload: Record<string, unknown> = {
      user_id,
      email,
      full_name,
      amount: total,
      status: 'awaiting_transfer',
      project_code: 'erpolart',
      subscription_plan: `${tier} – ${source}`,
      monthly_fee: maintenance ? monthly : 0,
      selected_addons: extras,
      has_own_hosting: false,
      project_notes: notes || null,
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', JSON.stringify(error));
      return new Response(
        JSON.stringify({ success: false, message: error.message, details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Onay e-postası gönder (non-blocking)
    if (resendKey && order) {
      const ref = order.id.slice(0, 8).toUpperCase();
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'ErpolArt <hello@erpolart.com>',
          to: [email],
          subject: `Siparişiniz Alındı #${ref} — ErpolArt`,
          html: buildOrderEmail(order, source, tier, notes, company),
        }),
      }).catch((e: unknown) => console.error('Email failed:', e));
    }

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sipariş oluşturulurken hata oluştu.';
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

function buildOrderEmail(
  order: Record<string, unknown>,
  source: string,
  tier: string,
  notes: string | null,
  company: string | null,
): string {
  const ref = (order.id as string).slice(0, 8).toUpperCase();
  const sourceLabel: Record<string, string> = {
    projects: 'Web Sitesi',
    saas: 'SaaS Ürünü',
    automations: 'AI Otomasyon',
    templates: 'Hazır Şablon',
  };
  return `
    <div style="font-family:sans-serif;background:#0c0c16;color:#fff;padding:48px 40px;max-width:600px;margin:auto;border-radius:24px;">
      <h1 style="font-style:italic;letter-spacing:-2px;color:#5c73ff;margin:0 0 4px;">ErpolArt</h1>
      <p style="color:#5c73ff;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 24px;">Digital Atelier</p>
      <hr style="border-color:#222;margin:0 0 24px;"/>
      <p style="margin:0 0 8px;">Sayın <strong>${order.full_name}</strong>,</p>
      <p style="color:#aaa;margin:0 0 24px;">Siparişiniz başarıyla alınmıştır. En kısa sürede ödeme bilgilerini ve sonraki adımları e-posta ile ileteceğiz.</p>
      <div style="background:#111;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #222;">
        <p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Sipariş Ref</p>
        <p style="margin:0 0 20px;font-size:22px;font-family:monospace;color:#5c73ff;font-weight:bold;">#${ref}</p>
        <p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Hizmet</p>
        <p style="margin:0 0 20px;">${sourceLabel[source] || source} — ${tier}</p>
        ${company ? `<p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Şirket</p><p style="margin:0 0 20px;">${company}</p>` : ''}
        <p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Tutar</p>
        <p style="margin:0;font-size:28px;font-weight:bold;">$${order.amount}</p>
      </div>
      <div style="background:#0f0f1a;border-radius:16px;padding:20px;margin-bottom:24px;border:1px solid #333;">
        <p style="margin:0 0 8px;color:#5c73ff;font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">Sırada Ne Var?</p>
        <p style="margin:0 0 6px;color:#ccc;font-size:13px;">✓ Logo yükleyin ve revizyon taleplerinizi belirtin</p>
        <p style="margin:0 0 6px;color:#ccc;font-size:13px;">✓ 24 saat içinde ödeme bilgilerini size ileteceğiz</p>
        <p style="margin:0;color:#ccc;font-size:13px;">✓ Proje tamamlandığında tüm kaynak kodlar size teslim edilir</p>
      </div>
      <a href="https://erpolart.com/order-success/${order.id}" style="display:inline-block;background:#5c73ff;color:#fff;padding:16px 32px;text-decoration:none;border-radius:12px;font-weight:900;text-transform:uppercase;font-size:12px;letter-spacing:2px;">Sipariş Formunu Doldur</a>
      <p style="color:#555;font-size:11px;margin-top:32px;">Sorularınız için <a href="mailto:hello@erpolart.com" style="color:#5c73ff;">hello@erpolart.com</a> adresine yazabilirsiniz.</p>
    </div>
  `;
}
