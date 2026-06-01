import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import sendEmail from '../utils/sendEmail.js';
import { getOrderConfirmationTemplate } from '../templates/orderConfirmation.js';

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// --- Order Controller ---

// @route   POST /api/orders
export const createOrder = async (req, res) => {
  const {
    templateId,
    proposalId,
    isProposal = false,
    direct_amount,
    selectedAddons = [],
    isMaintenanceActive = false,
    email,
    full_name,
    phone,
    address,
    tax_id,
    source,
    tier,
    company,
    notes,
  } = req.body;

  try {
    const userId = req.user?.uid || req.user?.id || null;

    let totalAmount = 0;
    let monthlyFee = 0;
    let dbTemplateId = null;
    let subscriptionPlan = 'Pro';

    if (isProposal && proposalId) {
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (proposalError || !proposal) {
        return res.status(404).json({ message: 'Proposal not found' });
      }

      totalAmount = Number(proposal.amount) || 0;

      const isPlatinum = proposal.project_name?.includes('Platinum') ||
        (proposal.features && (() => { try { return JSON.parse(proposal.features).tier === 'Platinum'; } catch { return false; } })());
      subscriptionPlan = isPlatinum ? 'Platinum' : 'Premium';
      const MAINTENANCE_TIERS = { Corporate: 29, Pro: 49, Premium: 150, Platinum: 250 };
      monthlyFee = isMaintenanceActive ? (MAINTENANCE_TIERS[subscriptionPlan] || 150) : 0;

    } else if (templateId) {
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .eq('project_code', 'erpolart')
        .single();

      if (templateError || !template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      const basePrice = Number(template.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const addonTotal = (template.extra_services || []).reduce((sum, addon) => {
        if (selectedAddons.includes(addon.id)) return sum + (Number(addon.price) || 0);
        return sum;
      }, 0);

      totalAmount = basePrice + addonTotal;
      dbTemplateId = template.id;

      const MAINTENANCE_TIERS = { Corporate: 29, Pro: 49, Premium: 150, Platinum: 250 };
      const tierMap = { 1: 'Corporate', 2: 'Pro', 3: 'Premium', 4: 'Platinum' };
      subscriptionPlan = tierMap[template.tier] || 'Pro';
      monthlyFee = isMaintenanceActive ? (MAINTENANCE_TIERS[subscriptionPlan] || 49) : 0;

    } else {
      // Service order (projects / saas / automations — direct amount)
      totalAmount = Number(direct_amount) || 0;
      subscriptionPlan = tier || 'Custom';
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        template_id: dbTemplateId,
        amount: totalAmount,
        status: 'pending',
        email: email || req.user?.email,
        full_name,
        phone,
        address,
        tax_id,
        project_code: 'erpolart',
        has_own_hosting: false,
        subscription_plan: isMaintenanceActive ? 'Maintenance' : 'None',
        monthly_fee: monthlyFee,
        selected_addons: selectedAddons,
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully.',
    });
  } catch (error) {
    console.error('[CREATE ORDER ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.',
    });
  }
};

// --- PayTR Token ---

// @route   POST /api/payment/paytr-token
export const createPayTRToken = async (req, res) => {
  try {
    const { orderId, merchantOkUrl, merchantFailUrl } = req.body;

    if (!orderId || !merchantOkUrl || !merchantFailUrl) {
      return res.status(400).json({ error: 'orderId, merchantOkUrl ve merchantFailUrl zorunlu.' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, templates:template_id(name)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Sipariş bulunamadı.' });
    }

    const merchant_id   = process.env.PAYTR_MERCHANT_ID;
    const merchant_key  = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return res.status(500).json({ error: 'PayTR credentials eksik.' });
    }

    const merchant_oid   = order.id.replace(/-/g, ''); // 32-char UUID, no dashes
    const payment_amount = Math.round(Number(order.amount) * 100); // USD cents
    const currency       = 'USD';

    // Gerçek IPv4 çıkar (Railway/Cloudflare proxy arkasında)
    const rawIp   = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
    const user_ip = rawIp.replace('::ffff:', '').replace('::1', '') || '127.0.0.1';

    // PayTR telefon formatı: 05XXXXXXXXX
    const rawPhone   = order.phone || '05000000000';
    const user_phone = rawPhone.startsWith('+90')
      ? '0' + rawPhone.slice(3)
      : rawPhone.startsWith('90') && rawPhone.length === 12
        ? '0' + rawPhone.slice(2)
        : rawPhone;

    const basket = JSON.stringify([[
      order.templates?.name || 'Digital Architecture',
      Number(order.amount).toFixed(2),
      1,
    ]]);
    const user_basket = Buffer.from(basket).toString('base64');

    const no_installment  = '0';
    const max_installment = '0';
    const test_mode       = process.env.PAYTR_TEST_MODE || '0';

    const hashSTR = `${merchant_id}${user_ip}${merchant_oid}${order.email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hashSTR + merchant_salt)
      .digest('base64');

    const formData = new URLSearchParams({
      merchant_id,
      merchant_key,
      merchant_salt,
      email:            order.email,
      payment_amount:   payment_amount.toString(),
      merchant_oid,
      user_name:        order.full_name || 'Guest',
      user_address:     order.address  || 'Digital Delivery',
      user_phone,
      merchant_ok_url:  merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      user_basket,
      user_ip,
      timeout_limit:    '30',
      debug_on:         '0',
      test_mode,
      lang:             'tr',
      no_installment,
      max_installment,
      currency,
      paytr_token,
    });

    const paytrRes = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    formData.toString(),
    });

    const data = await paytrRes.json();

    if (data.status === 'success') {
      return res.json({ iframeToken: data.token });
    }

    console.error('[PAYTR TOKEN ERROR]', data);
    res.status(400).json({ error: data.reason || 'PayTR token alınamadı.' });

  } catch (error) {
    console.error('[PAYTR TOKEN EXCEPTION]', error);
    res.status(500).json({ error: error.message });
  }
};

// --- PayTR Callback ---

// @route   POST /api/payment/paytr-callback
// @access  Public (PayTR server-to-server POST)
export const paytrCallback = async (req, res) => {
  try {
    const { merchant_oid, status, total_amount, hash } = req.body;

    const merchant_key  = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    // Hash doğrulama
    const expected = crypto
      .createHmac('sha256', merchant_key)
      .update(merchant_oid + merchant_salt + status + total_amount)
      .digest('base64');

    if (expected !== hash) {
      console.error('[PAYTR CALLBACK] Bad hash — possible spoofing attempt');
      return res.send('PAYTR notification failed: bad hash');
    }

    // merchant_oid (32-char UUID, no dashes) → original UUID
    const r = merchant_oid;
    const orderId = `${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`;

    const { data: order } = await supabase
      .from('orders')
      .select('*, templates:template_id(name)')
      .eq('id', orderId)
      .single();

    if (!order) {
      console.error('[PAYTR CALLBACK] Order not found:', orderId);
      return res.send('OK');
    }

    // Idempotency — tekrar işleme engel
    if (order.status === 'paid') return res.send('OK');

    if (status === 'success') {
      await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', orderId);

      try {
        await sendEmail({
          email:   order.email,
          subject: 'Sipariş Onay Belgesi - ErpolArt Digital Atelier',
          html: getOrderConfirmationTemplate({
            customerName:    order.full_name,
            customerEmail:   order.email,
            customerPhone:   order.phone,
            customerAddress: order.address,
            customerTaxId:   order.tax_id,
            orderId:         order.id.slice(0, 8).toUpperCase(),
            orderDate:       new Date(order.created_at).toLocaleDateString('tr-TR'),
            amount:          order.amount,
            productName:     order.templates?.name || 'Dijital Mimari Şablon',
            isSubscription:  order.subscription_plan !== 'None',
            currency:        '$',
          }),
        });
      } catch (emailErr) {
        console.error(`[EMAIL FAILED] orderId: ${orderId}`, emailErr);
      }

    } else {
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', orderId);
    }

    res.send('OK'); // PayTR mutlaka "OK" bekliyor
  } catch (error) {
    console.error('[PAYTR CALLBACK EXCEPTION]', error);
    res.send('OK'); // Yine de OK dön, aksi halde PayTR tekrar dener
  }
};

// --- Order Config ---

// @route   GET /api/templates/order-config/:orderId
export const getOrderConfig = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) return res.status(404).json({ message: 'Order not found' });

    const currentUserId = req.user.uid || req.user.id;
    if (!order.user_id || order.user_id.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ configuration: order.configuration, editCount: order.editCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/templates/order-config
export const updateOrderConfig = async (req, res) => {
  const { orderId, configuration } = req.body;

  try {
    if (!orderId || !isUUID(orderId)) {
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentUserId = req.user.uid || req.user.id;
    if (order.user_id.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.edit_count >= 3) {
      return res.status(400).json({ message: 'Revision limit reached' });
    }

    const configSource = configuration || req.body.siteData || {};

    const cleanConfig = {
      brandName:        configSource.brandName       || '',
      primaryColor:     configSource.primaryColor    || '#5c73ff',
      secondaryColor:   configSource.secondaryColor  || '#00d1ff',
      notes:            configSource.notes           || '',
      logo:             configSource.logo            || null,
      headline:         configSource.headline        || '',
      description:      configSource.description     || '',
    };

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        configuration: cleanConfig,
        edit_count:    order.edit_count + 1,
        status:        req.body.status || order.status,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updatedOrder);
  } catch (error) {
    console.error('[CONFIG UPDATE FAILED]', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, full_name, email, status, amount, edit_count, created_at,
        project_code, brand_name, brand_colors, logo_url, project_notes,
        has_own_hosting, subscription_plan, monthly_fee,
        templates:template_id (name, image_url)
      `)
      .eq('project_code', 'erpolart')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map(order => ({
      _id:        order.id,
      userId:     { email: order.email || 'Guest Member' },
      templateId: {
        name:      order.templates?.name      || 'Unknown Architecture',
        image_url: order.templates?.image_url || null,
      },
      editCount:        order.edit_count || 0,
      amount:           order.amount,
      status:           order.status,
      created_at:       order.created_at,
      brand_name:       order.brand_name,
      brand_colors:     order.brand_colors,
      logo_url:         order.logo_url,
      project_notes:    order.project_notes,
      has_own_hosting:  order.has_own_hosting,
      subscription_plan: order.subscription_plan,
      monthly_fee:      order.monthly_fee,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
