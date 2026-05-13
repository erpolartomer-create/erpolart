import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { callIyzico } from '../_shared/iyzico.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  try {
    const { orderId } = await req.json();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, templates:template_id(name)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return new Response(
        JSON.stringify({ success: false, message: 'Sipariş bulunamadı.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://erpolart.com';

    // Derive Edge Functions base URL from SUPABASE_URL
    const projectRef = supabaseUrl.split('.')[0].replace('https://', '');
    const callbackUrl = `https://${projectRef}.functions.supabase.co/payment-callback`;

    // Phone normalization
    let gsm = (order.phone as string) || '+905000000000';
    if (!gsm.startsWith('+')) gsm = '+' + gsm.replace(/^0+/, '');

    // City extraction from address
    const addressParts = ((order.address as string) || '').split(',').map((p: string) => p.trim()).filter(Boolean);
    const city = addressParts[addressParts.length - 1] || 'Istanbul';

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    const isoNow = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');

    const iyzicoRequest = {
      locale: 'tr',
      conversationId: order.id as string,
      price: (order.amount as number).toString(),
      paidPrice: (order.amount as number).toString(),
      currency: 'USD',
      basketId: 'B' + (order.id as string).replace(/-/g, '').slice(0, 16),
      paymentGroup: 'PRODUCT',
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: (order.user_id as string) || 'GUEST',
        name: (order.full_name as string).split(' ')[0] || 'Guest',
        surname: (order.full_name as string).split(' ').slice(1).join(' ') || 'User',
        gsmNumber: gsm,
        email: order.email as string,
        identityNumber: (order.tax_id as string) || '00000000000',
        lastLoginDate: isoNow,
        registrationDate: isoNow,
        registrationAddress: (order.address as string) || 'N/A',
        ip: clientIp,
        city,
        country: (order.country as string) || 'Turkey',
        zipCode: '00000',
      },
      shippingAddress: {
        contactName: order.full_name as string,
        city,
        country: (order.country as string) || 'Turkey',
        address: (order.address as string) || 'Digital Delivery',
        zipCode: '00000',
      },
      billingAddress: {
        contactName: order.full_name as string,
        city,
        country: (order.country as string) || 'Turkey',
        address: (order.address as string) || 'Digital Delivery',
        zipCode: '00000',
      },
      basketItems: [{
        id: (order.template_id as string) || orderId,
        name: ((order.templates as { name?: string })?.name) || 'Digital Architecture',
        category1: 'Digital Services',
        itemType: 'VIRTUAL',
        price: (order.amount as number).toString(),
      }],
    };

    const result = await callIyzico(
      'POST',
      '/payment/iyzipos/checkoutform/initialize/auth/ecom',
      iyzicoRequest as unknown as Record<string, unknown>,
    );

    if (result['status'] !== 'success') {
      console.error('Iyzico init failed:', result['errorMessage']);
      return new Response(
        JSON.stringify({ success: false, message: (result['errorMessage'] as string) || 'Ödeme formu başlatılamadı.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        token: result['token'],
        checkoutFormContent: result['checkoutFormContent'],
        paymentPageUrl: result['paymentPageUrl'],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ödeme hatası.';
    console.error('payment-create error:', message);
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
