import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { callIyzico } from '../_shared/iyzico.ts';

serve(async (req) => {
  const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://erpolart.com';

  try {
    // iyzico sends a browser POST with form-encoded body
    let token: string | null = null;
    let conversationId: string | null = null;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(await req.text());
      token = params.get('token');
      conversationId = params.get('conversationId');
    } else {
      try {
        const body = await req.json();
        token = body.token;
        conversationId = body.conversationId;
      } catch {
        return Response.redirect(`${frontendUrl}/order-cancel`, 302);
      }
    }

    if (!token) {
      return Response.redirect(`${frontendUrl}/order-cancel`, 302);
    }

    // Verify payment result with iyzico
    const verifyResult = await callIyzico(
      'POST',
      '/payment/iyzipos/checkoutform/auth/ecom/detail',
      { locale: 'tr', conversationId: conversationId || '', token },
    );

    if (verifyResult['paymentStatus'] !== 'SUCCESS') {
      console.error('Payment failed:', verifyResult['errorMessage']);
      return Response.redirect(`${frontendUrl}/order-cancel`, 302);
    }

    const orderId = verifyResult['conversationId'] as string;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: order, error: fetchError } = await supabase
      .from('orders').select('*').eq('id', orderId).single();

    if (fetchError || !order) {
      console.error('Order not found in callback:', orderId);
      return Response.redirect(`${frontendUrl}/order-cancel`, 302);
    }

    // Guard against duplicate callbacks
    if (order.status === 'paid') {
      return Response.redirect(`${frontendUrl}/order-success/${orderId}`, 302);
    }

    // Mark order as paid
    await supabase.from('orders').update({
      status: 'paid',
      iyzico_payment_id: verifyResult['paymentId'],
      paid_at: new Date().toISOString(),
    }).eq('id', orderId);

    // Send confirmation email (non-blocking)
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey) {
      const { data: fullOrder } = await supabase
        .from('orders').select('*, templates:template_id(name)').eq('id', orderId).single();
      if (fullOrder) {
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'ErpolArt <hello@erpolart.com>',
            to: [(fullOrder as { email: string }).email],
            subject: `Ödeme Onaylandı #${orderId.slice(0, 8).toUpperCase()} — ErpolArt`,
            html: buildConfirmationEmail(fullOrder as Record<string, unknown>),
          }),
        }).catch((e: unknown) => console.error('Email failed:', e));
      }
    }

    return Response.redirect(`${frontendUrl}/order-success/${orderId}`, 302);
  } catch (err: unknown) {
    console.error('payment-callback error:', err);
    return Response.redirect(`${frontendUrl}/order-cancel`, 302);
  }
});

function buildConfirmationEmail(order: Record<string, unknown>): string {
  const ref = (order.id as string).slice(0, 8).toUpperCase();
  const templateName = ((order.templates as { name?: string } | null)?.name) || 'Dijital Mimari';
  return `
    <div style="font-family:sans-serif;background:#0c0c16;color:#fff;padding:48px 40px;max-width:600px;margin:auto;border-radius:24px;">
      <h1 style="font-style:italic;letter-spacing:-2px;color:#5c73ff;margin:0 0 4px;">ErpolArt</h1>
      <p style="color:#5c73ff;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 24px;">Digital Atelier</p>
      <hr style="border-color:#222;margin:0 0 24px;"/>
      <p style="margin:0 0 8px;">Sayın <strong>${order.full_name}</strong>,</p>
      <p style="color:#aaa;margin:0 0 24px;">Ödemeniz başarıyla alındı. Siparişiniz işleme alınmıştır.</p>
      <div style="background:#111;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #222;">
        <p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Sipariş Ref</p>
        <p style="margin:0 0 20px;font-size:22px;font-family:monospace;color:#5c73ff;font-weight:bold;">#${ref}</p>
        <p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Ürün</p>
        <p style="margin:0 0 20px;">${templateName}</p>
        <p style="margin:0 0 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Tutar</p>
        <p style="margin:0;font-size:28px;font-weight:bold;">$${order.amount}</p>
      </div>
      <p style="color:#555;font-size:11px;">Bu e-posta otomatik gönderilmiştir. Sorularınız için <a href="mailto:hello@erpolart.com" style="color:#5c73ff;">hello@erpolart.com</a> adresine yazabilirsiniz.</p>
    </div>
  `;
}
