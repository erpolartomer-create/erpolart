import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAINTENANCE_TIERS: Record<string, number> = {
  Corporate: 29, Pro: 49, Premium: 150, Platinum: 250,
};
const TIER_MAP: Record<number, string> = {
  1: 'Corporate', 2: 'Pro', 3: 'Premium', 4: 'Platinum',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, serviceKey);

  // Identify current user from JWT (optional — checkout page is always auth'd)
  let userId: string | null = null;
  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    userId = user?.id ?? null;
  }

  try {
    const {
      templateId, proposalId, isProposal = false,
      selectedAddons = [], isMaintenanceActive = false,
      email, full_name, phone, address, tax_id,
    } = await req.json();

    let totalAmount = 0;
    let monthlyFee = 0;
    let dbTemplateId: string | null = null;

    if (isProposal && proposalId) {
      const { data: proposal, error } = await supabase
        .from('proposals').select('*').eq('id', proposalId).single();
      if (error || !proposal) {
        return new Response(
          JSON.stringify({ success: false, message: 'Proposal not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      totalAmount = Number(proposal.amount) || 0;
      const isPlatinum = proposal.project_name?.includes('Platinum');
      monthlyFee = isMaintenanceActive ? (isPlatinum ? 250 : 150) : 0;
    } else {
      const { data: template, error } = await supabase
        .from('templates').select('*')
        .eq('id', templateId).eq('project_code', 'erpolart').single();
      if (error || !template) {
        return new Response(
          JSON.stringify({ success: false, message: 'Template not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      const basePrice = Number(String(template.price).replace(/[^0-9.]/g, '')) || 0;
      const addonTotal = (template.extra_services || []).reduce((sum: number, addon: { id: string; price: unknown }) => {
        return selectedAddons.includes(addon.id) ? sum + (Number(addon.price) || 0) : sum;
      }, 0);
      totalAmount = basePrice + addonTotal;
      dbTemplateId = template.id;
      const plan = TIER_MAP[template.tier as number] || 'Pro';
      monthlyFee = isMaintenanceActive ? (MAINTENANCE_TIERS[plan] || 49) : 0;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        template_id: dbTemplateId,
        amount: totalAmount,
        status: 'pending',
        email, full_name, phone, address, tax_id,
        project_code: 'erpolart',
        has_own_hosting: false,
        subscription_plan: isMaintenanceActive ? 'Maintenance' : 'None',
        monthly_fee: monthlyFee,
        selected_addons: selectedAddons,
      }])
      .select().single();

    if (orderError) throw orderError;

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
