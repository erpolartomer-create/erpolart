import { supabase } from '../config/supabase.js';
import Iyzipay from 'iyzipay';
import iyzipay from '../config/iyzipay.js';
import sendEmail from '../utils/sendEmail.js';
import { getOrderConfirmationTemplate } from '../templates/orderConfirmation.js';

// Helper to determine if a string is a valid UUID
const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// --- Order Controller ---

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Public
export const createOrder = async (req, res) => {
  const {
    templateId,
    proposalId,
    isProposal = false,
    selectedAddons = [],
    isMaintenanceActive = false,
    email,
    full_name,
    phone,
    address,
    tax_id
  } = req.body;

  try {
    const userId = req.user?.uid || req.user?.id || null;

    let totalAmount = 0;
    let monthlyFee = 0;
    let dbTemplateId = null;
    let subscriptionPlan = 'Pro';

    if (isProposal && proposalId) {
      // Proposal-based order: fetch price from proposals table
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
    } else {
      // Template-based order: fetch from templates table
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .eq('project_code', 'erpolart')
        .single();

      if (templateError || !template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      // Securely calculate total amount on backend
      const basePrice = Number(template.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const addonTotal = (template.extra_services || []).reduce((sum, addon) => {
        if (selectedAddons.includes(addon.id)) {
          return sum + (Number(addon.price) || 0);
        }
        return sum;
      }, 0);

      totalAmount = basePrice + addonTotal;
      dbTemplateId = template.id;

      const MAINTENANCE_TIERS = { Corporate: 29, Pro: 49, Premium: 150, Platinum: 250 };
      const tierMap = { 1: 'Corporate', 2: 'Pro', 3: 'Premium', 4: 'Platinum' };
      subscriptionPlan = tierMap[template.tier] || 'Pro';
      monthlyFee = isMaintenanceActive ? (MAINTENANCE_TIERS[subscriptionPlan] || 49) : 0;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        template_id: dbTemplateId,
        amount: totalAmount,
        status: 'pending',
        email: email || req.user?.email,
        full_name: full_name,
        phone: phone,
        address: address,
        tax_id: tax_id,
        project_code: 'erpolart',
        has_own_hosting: false,
        subscription_plan: isMaintenanceActive ? 'Maintenance' : 'None',
        monthly_fee: monthlyFee,
        selected_addons: selectedAddons
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    res.status(201).json({
      success: true,
      order: order,
      message: 'Order created successfully on secure node.'
    });
  } catch (error) {
    console.error("SECURE CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.'
    });
  }
};

// --- Payment Controller (Iyzico Integration) ---
// @route   POST /api/payment/create
// @access  Private/Public
export const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;

  try {
    // 1. Fetch order from DB
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, templates:template_id(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı.' });
    }

    // FIX: GSM Numarası normalizasyonu (KRİTİK 3)
    let gsm = order.phone || '+905000000000';
    if (!gsm.startsWith('+')) gsm = '+' + gsm.replace(/^0+/, '');

    // FIX: IP Adresi normalizasyonu (UYARI 6)
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '127.0.0.1';

    // Extract city from address (last comma-delimited segment) or fall back to safe default
    const addressParts = (order.address || '').split(',').map(p => p.trim()).filter(Boolean);
    const cityFallback = addressParts[addressParts.length - 1] || 'Istanbul';

    // 2. Prepare Iyzico Request
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order.id,
      price: order.amount.toString(),
      paidPrice: order.amount.toString(),
      currency: Iyzipay.CURRENCY.USD, // FIX: Global sales - USD approved on iyzico account (UYARI 5)
      basketId: 'B' + order.id.replace(/-/g, '').slice(0, 16), // FIX: Unique basketId (UYARI 7)
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5002'}/api/payment/callback`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: order.user_id || 'GUEST',
        name: order.full_name.split(' ')[0] || 'Guest',
        surname: order.full_name.split(' ').slice(1).join(' ') || 'User',
        gsmNumber: gsm, // FIX: Kullanıcıdan gelen phone alanı kullanıldı (KRİTİK 3)
        email: order.email,
        identityNumber: order.tax_id || '00000000000', // FIX: iyzico foreign buyer placeholder (Düzeltme 1)
        lastLoginDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        registrationDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        registrationAddress: order.address || 'N/A',
        ip: clientIp, // FIX: Proxy arkasındaki gerçek IP kullanıldı (UYARI 6)
        city: cityFallback,
        country: order.country || 'Turkey',
        zipCode: '00000'
      },
      shippingAddress: {
        contactName: order.full_name,
        city: cityFallback,
        country: order.country || 'Turkey',
        address: order.address || 'Digital Delivery',
        zipCode: '00000'
      },
      billingAddress: {
        contactName: order.full_name,
        city: cityFallback,
        country: order.country || 'Turkey',
        address: order.address || 'Digital Delivery',
        zipCode: '00000'
      },
      basketItems: [
        {
          id: order.template_id,
          name: order.templates?.name || 'Digital Architecture',
          category1: 'Digital Services',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: order.amount.toString()
        }
      ]
    };

    // 3. Initialize Checkout Form
    iyzipay.checkoutFormInitialize.create(request, function (err, result) {
      if (err || result.status !== 'success') {
        console.error("IYZICO INIT ERROR:", err || result.errorMessage);
        return res.status(500).json({ 
          message: 'Ödeme formu başlatılamadı.', 
          error: result.errorMessage 
        });
      }

      res.status(200).json({
        success: true,
        token: result.token,
        checkoutFormContent: result.checkoutFormContent,
        paymentPageUrl: result.paymentPageUrl
      });
    });

  } catch (error) {
    console.error("PAYMENT INTENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Payment callback (webhook/redirect)
// @route   POST /api/payment/callback
// @access  Public
export const paymentCallback = async (req, res) => {
  const { token } = req.body;

  try {
    iyzipay.checkoutForm.retrieve({
      locale: Iyzipay.LOCALE.TR,
      conversationId: req.body.conversationId,
      token: token
    }, async function (err, result) {
      if (err || result.paymentStatus !== 'SUCCESS') {
        console.error("IYZICO VERIFICATION FAILED:", err || result.errorMessage);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?status=failed`);
      }

      // FIX: Callback sahiplik ve status doğrulaması (KRİTİK 2)
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', result.conversationId)
        .single();

      if (fetchError || !order) {
        console.error("ORDER NOT FOUND IN CALLBACK:", result.conversationId);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?status=failed`);
      }

      // Aynı siparişin iki kez "paid" yapılmasını engelle (KRİTİK 2)
      if (order.status === 'paid') {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success/${order.id}`);
      }

      // 1. Update Order in DB
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid', 
          iyzico_payment_id: result.paymentId,
          paid_at: new Date().toISOString() 
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      // 2. Fetch full order details for email confirmation
      try {
        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*, templates:template_id(name)')
          .eq('id', order.id)
          .single();

        if (fullOrder) {
          await sendEmail({
            email: fullOrder.email,
            subject: 'Sipariş Onay Belgesi - ErpolArt Digital Atelier',
            html: getOrderConfirmationTemplate({
              customerName: fullOrder.full_name,
              customerEmail: fullOrder.email,
              customerPhone: fullOrder.phone,
              customerAddress: fullOrder.address,
              customerTaxId: fullOrder.tax_id,
              orderId: fullOrder.id.slice(0, 8).toUpperCase(),
              orderDate: new Date(fullOrder.created_at).toLocaleDateString('tr-TR'),
              amount: fullOrder.amount,
              productName: fullOrder.templates?.name || 'Dijital Mimari Şablon',
              isSubscription: fullOrder.subscription_plan !== 'None',
              currency: '$'
            })
          });
        }
      } catch (emailErr) {
        // FIX: Email hata logu detaylandırıldı (UYARI 9)
        console.error(`[EMAIL FAILED] orderId: ${order.id} | time: ${new Date().toISOString()} | error:`, emailErr);
      }

      // 3. Redirect to Success Page
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success/${order.id}`);
    });
  } catch (error) {
    console.error("CALLBACK ERROR:", error);
    res.status(400).send(`Verification Error: ${error.message}`);
  }
};

// @desc    Get order configuration
// @route   GET /api/templates/order-config/:orderId
// @access  Private
export const getOrderConfig = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) return res.status(404).json({ message: 'Order not found' });

    // Authorization check
    const currentUserId = req.user.uid || req.user.id;
    if (order.user_id.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ configuration: order.configuration, editCount: order.editCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order configuration
// @route   POST /api/templates/order-config
// @access  Private
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

    // Authorization check
    const currentUserId = req.user.uid || req.user.id;
    if (order.user_id.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.edit_count >= 3) {
      return res.status(400).json({ message: 'Revision limit reached' });
    }

    const configSource = configuration || req.body.siteData || {};

    const cleanConfig = {
      brandName: configSource.brandName || '',
      primaryColor: configSource.primaryColor || '#5c73ff',
      secondaryColor: configSource.secondaryColor || '#00d1ff',
      notes: configSource.notes || '',
      logo: configSource.logo || null,
      headline: configSource.headline || '',
      description: configSource.description || ''
    };

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        configuration: cleanConfig,
        edit_count: order.edit_count + 1,
        status: req.body.status || order.status
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updatedOrder);
  } catch (error) {
    console.error("[CONFIG DEBUG] UPDATE FAILED:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        full_name,
        email,
        status,
        amount,
        edit_count,
        created_at,
        project_code,
        brand_name,
        brand_colors,
        logo_url,
        project_notes,
        has_own_hosting,
        subscription_plan,
        monthly_fee,
        templates:template_id (
          name,
          image_url
        )
      `)
      .eq('project_code', 'erpolart')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Format to match frontend expectations
    const formattedData = data.map(order => ({
      _id: order.id,
      userId: { email: order.email || 'Guest Member' },
      templateId: { 
        name: order.templates?.name || 'Unknown Architecture',
        image_url: order.templates?.image_url || null
      },
      editCount: order.edit_count || 0,
      amount: order.amount,
      status: order.status,
      created_at: order.created_at,
      brand_name: order.brand_name,
      brand_colors: order.brand_colors,
      logo_url: order.logo_url,
      project_notes: order.project_notes,
      has_own_hosting: order.has_own_hosting,
      subscription_plan: order.subscription_plan,
      monthly_fee: order.monthly_fee
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
