import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import sendEmail from '../utils/sendEmail.js';
import { getOrderConfirmationTemplate } from '../templates/orderConfirmation.js';
import { computeServiceTotal, SERVICE_SOURCES } from '../config/pricing.js';

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
    extras = [],
    pages,
    langCount,
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
      // Service order (projects / saas / automations)
      // GÜVENLİK: tutarı SUNUCUDA otoriter hesapla — istemciden gelen direct_amount'a
      // güvenme (aksi halde 1$'a hizmet alınabilir).
      if (SERVICE_SOURCES.has(source)) {
        const computed = computeServiceTotal({ source, tier, extras, pages, langCount });
        if (computed == null || computed <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Geçersiz sipariş parametreleri. Lütfen seçiminizi yenileyip tekrar deneyin.',
          });
        }
        totalAmount = computed;
      } else {
        // Bilinmeyen kaynak — güvenli taraf: reddet (sessizce direct_amount'a düşme).
        return res.status(400).json({ success: false, message: 'Geçersiz sipariş kaynağı.' });
      }
      subscriptionPlan = tier || 'Custom';
    }

    const baseInsert = {
      user_id:           userId,
      template_id:       dbTemplateId,
      amount:            totalAmount,
      status:            'pending',
      email:             email || req.user?.email,
      full_name,
      project_code:      'erpolart',
      has_own_hosting:   false,
      subscription_plan: isMaintenanceActive ? 'Maintenance' : 'None',
      monthly_fee:       monthlyFee,
      selected_addons:   selectedAddons,
      project_notes:     notes || null,
      customer_phone:    phone || null,
    };

    let { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([baseInsert])
      .select()
      .single();

    // customer_phone kolonu henüz eklenmemişse (PGRST204) onsuz tekrar dene —
    // SQL migration uygulanmadan da createOrder çalışmaya devam etsin.
    if (orderError && (orderError.code === 'PGRST204' || /column/i.test(orderError.message || ''))) {
      const { customer_phone, ...withoutPhone } = baseInsert;
      ({ data: order, error: orderError } = await supabase
        .from('orders')
        .insert([withoutPhone])
        .select()
        .single());
    }

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
    const { orderId, merchantOkUrl, merchantFailUrl, userPhone, userName, currency: reqCurrency } = req.body;

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

    // PayTR desteklenen para birimleri (mağazada aktif olanlar): şu an sadece TL.
    // Diğerleri PayTR onayı sonrası eklenir: 'USD', 'EUR', 'GBP'
    const PAYTR_CURRENCIES = ['TL'];
    const currency = PAYTR_CURRENCIES.includes(reqCurrency) ? reqCurrency : 'TL';

    // Para birimi dönüşümü (DB'deki tutar USD cinsinden)
    // Aylık bakım varsa ilk ay ücretini de dahil et (Seçenek B)
    const usdAmount = Number(order.amount) + Number(order.monthly_fee || 0);
    let convertedAmount = usdAmount;

    if (currency !== 'USD') {
      try {
        const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await rateRes.json();
        const rateKey  = currency === 'TL' ? 'TRY' : currency;
        const rate     = rateData?.rates?.[rateKey];
        if (rate) convertedAmount = usdAmount * rate;
      } catch {
        // Fallback sabit kurlar (güncel değerlere yakın)
        const fallback = { TL: 38, EUR: 0.92, GBP: 0.79 };
        convertedAmount = usdAmount * (fallback[currency] || 1);
      }
    }

    const merchant_oid   = order.id.replace(/-/g, ''); // 32-char UUID, no dashes
    const payment_amount = Math.round(convertedAmount * 100);

    // Gerçek IPv4 çıkar (Railway/Cloudflare proxy arkasında)
    const rawIp   = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
    const user_ip = rawIp.replace('::ffff:', '').replace('::1', '') || '127.0.0.1';

    // PayTR telefon formatı: 05XXXXXXXXX (form'dan direkt alınır — orders tablosunda depolanmıyor)
    const rawPhone   = userPhone || '05000000000';
    const user_phone = rawPhone.startsWith('+90')
      ? '0' + rawPhone.slice(3)
      : rawPhone.startsWith('90') && rawPhone.length === 12
        ? '0' + rawPhone.slice(2)
        : rawPhone;
    const user_name = userName || order.full_name || 'Guest';

    const monthlyFeeUsd = Number(order.monthly_fee || 0);
    const rate          = usdAmount > 0 ? convertedAmount / usdAmount : 1;

    const basketItems = [[
      order.templates?.name || 'Digital Architecture',
      (Number(order.amount) * rate).toFixed(2),
      1,
    ]];
    if (monthlyFeeUsd > 0) {
      basketItems.push(['Aylık Bakım (1. Ay)', (monthlyFeeUsd * rate).toFixed(2), 1]);
    }
    const basket      = JSON.stringify(basketItems);
    const user_basket = Buffer.from(basket).toString('base64');

    const no_installment  = '0';
    const max_installment = '0';
    const test_mode       = process.env.PAYTR_TEST_MODE || '0';
    const debug_on        = test_mode === '1' ? '1' : '0'; // test modunda hata mesajlarını göster

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
      user_name,
      user_address:     order.address  || 'Digital Delivery',
      user_phone,
      merchant_ok_url:  merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      user_basket,
      user_ip,
      timeout_limit:    '30',
      debug_on,
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
    console.log(`[PAYTR CALLBACK] geldi → oid=${merchant_oid} status=${status} total=${total_amount}`);

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

    // merchant_oid → original UUID
    // İlk 32 karakter UUID (dashesiz), sonrası benzersizlik suffix'i (yok sayılır)
    const r = merchant_oid.slice(0, 32);
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

    // Derinlemesine savunma (bloklamaz): tahsil edilen tutarı beklenen taban tutarla
    // karşılaştır. total_amount PayTR'den kuruş (×100 TL) gelir. order.amount USD'dir.
    // Çok düşük FX (konservatif) ile taban hesaplanır; tahsilat tabanın %50'sinin
    // altındaysa olası yapılandırma/manipülasyon uyarısı logla (ödemeyi reddetme).
    if (status === 'success') {
      const baseUsd = Number(order.amount || 0) + Number(order.monthly_fee || 0);
      const floorKurus = baseUsd * 25 * 100 * 0.5; // 25 TRY/USD konservatif × %50 tolerans
      const paidKurus = Number(total_amount || 0);
      if (baseUsd > 0 && paidKurus > 0 && paidKurus < floorKurus) {
        console.warn(`[PAYTR CALLBACK] ⚠️ Tutar şüpheli düşük → oid=${merchant_oid} tahsil=${paidKurus}kr beklenen_taban≈${Math.round(floorKurus)}kr (orderUSD=${baseUsd})`);
      }
    }

    if (status === 'success') {
      // Önce paid_at ile dene; kolon yoksa (PGRST204 / "column ... does not exist")
      // SADECE status ile tekrar dene. Yoksa update tamamen reddedilir ve sipariş
      // 'pending' kalır (müşteri ödediği halde turuncu "ÖDEME BEKLENİYOR" görür).
      let { error: paidErr } = await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', orderId);

      if (paidErr && (paidErr.code === 'PGRST204' || /column/i.test(paidErr.message || ''))) {
        ({ error: paidErr } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId));
      }

      if (paidErr) {
        console.error(`[PAYTR CALLBACK] sipariş 'paid' YAPILAMADI → ${orderId}`, paidErr.message);
      } else {
        console.log(`[PAYTR CALLBACK] sipariş 'paid' yapıldı → ${orderId}`);
      }

      try {
        await sendEmail({
          email:   order.email,
          subject: 'Sipariş Onay Belgesi - ErpolArt Digital Atelier',
          html: getOrderConfirmationTemplate({
            customerName:    order.full_name,
            customerEmail:   order.email,
            customerPhone:   order.customer_phone || order.phone,
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

// --- Döviz Kurları (cache'li proxy) ---
// Frontend doğrudan open.er-api.com'a çağrı yapamıyor (CSP engeli) — bu yüzden
// backend üzerinden (CSP'de izinli) servis ediyoruz. 1 saat cache.
let _ratesCache = { rates: null, ts: 0 };

// @route   GET /api/payment/rates
export const getExchangeRates = async (req, res) => {
  try {
    if (_ratesCache.rates && Date.now() - _ratesCache.ts < 3600000) {
      return res.json({ rates: _ratesCache.rates });
    }
    const r = await fetch('https://open.er-api.com/v6/latest/USD');
    const d = await r.json();
    if (d?.rates) {
      _ratesCache = { rates: d.rates, ts: Date.now() };
      return res.json({ rates: d.rates });
    }
    res.json({ rates: null });
  } catch {
    res.json({ rates: null });
  }
};

// --- PayTR Taksit Oranları Sorgulama (cache'li) ---
// Mağazaya tanımlı taksit oranlarını kart markasına göre döner.
// Oranlar günlük değişebilir → 6 saat cache.
// ÖNEMLİ (PayTR Direkt API): taksitli işlemde vade farkı OTOMATİK eklenmez.
// Vade farkını müşteriye yansıtmak için taksitli tutarı biz hesaplayıp göndeririz:
//   taksitliTutar = tutar / ((100 - oran) / 100)
let _instCache = { data: null, ts: 0 };

// PayTR 'oranlar' yapısını { brand: { taksitSayısı: oran } } biçimine normalize et.
// Farklı olası yapıları (obje/array, farklı alan adları) savunmacı şekilde ele alır.
const normalizeInstallmentRates = (oranlar) => {
  const out = {};
  for (const [brand, val] of Object.entries(oranlar || {})) {
    const map = {};
    if (Array.isArray(val)) {
      // [{taksit:2, oran:3.5}, ...] veya [sayı, sayı, ...]
      val.forEach((item, idx) => {
        if (item && typeof item === 'object') {
          const t = Number(item.taksit ?? item.installment ?? item.ay ?? item.count ?? item.taksit_sayisi);
          const o = Number(item.oran ?? item.rate ?? item.ratio ?? item.yuzde ?? item.komisyon);
          if (t > 1 && isFinite(o) && o > 0) map[t] = o;
        } else if (item != null && !isNaN(Number(item))) {
          const o = Number(item);
          if (idx + 1 > 1 && o > 0) map[idx + 1] = o; // index → taksit sayısı (1 bazlı)
        }
      });
    } else if (val && typeof val === 'object') {
      // { "2": 3.5, "3": 5.0, ... }
      for (const [k, v] of Object.entries(val)) {
        const t = Number(k); const o = Number(v);
        if (t > 1 && isFinite(o) && o > 0) map[t] = o;
      }
    }
    out[brand] = map;
  }
  return out;
};

// Paylaşılan: normalize edilmiş taksit verisini (cache'li) getir.
const fetchInstallmentData = async () => {
  if (_instCache.data && Date.now() - _instCache.ts < 6 * 3600000) {
    return _instCache.data;
  }
  const merchant_id   = process.env.PAYTR_MERCHANT_ID;
  const merchant_key  = process.env.PAYTR_MERCHANT_KEY;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
  if (!merchant_id || !merchant_key || !merchant_salt) {
    return { status: 'error', err_msg: 'PayTR credentials eksik.', maxInstallment: 0, ratesByBrand: {} };
  }

  const request_id  = Date.now().toString();
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(merchant_id + request_id + merchant_salt)
    .digest('base64');

  const form = new URLSearchParams({ merchant_id, request_id, paytr_token });
  const r = await fetch('https://www.paytr.com/odeme/taksit-oranlari', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    form.toString(),
  });
  const data = await r.json();

  if (data.status === 'success') {
    // Yapıyı doğrulamak için ham veriyi bir kez logla (cache yüzünden nadiren çalışır)
    console.log('[INSTALLMENT RATES RAW]', JSON.stringify(data.oranlar || {}).slice(0, 1500));
    const payload = {
      status:         'success',
      maxInstallment: Number(data.max_inst_non_bus) || 0,
      ratesByBrand:   normalizeInstallmentRates(data.oranlar || {}),
    };
    _instCache = { data: payload, ts: Date.now() };
    return payload;
  }

  console.error('[INSTALLMENT RATES ERROR]', data);
  return { status: 'error', err_msg: data.err_msg || 'Taksit oranları alınamadı.', maxInstallment: 0, ratesByBrand: {} };
};

// Belirli kart markası + taksit sayısı için oranı çöz (yoksa null).
const resolveInstallmentRate = (data, brand, count) => {
  if (!data?.ratesByBrand || !brand || !(count > 1)) return null;
  const map = data.ratesByBrand[brand] || data.ratesByBrand[String(brand).toLowerCase()];
  const rate = map ? Number(map[count]) : NaN;
  return isFinite(rate) && rate > 0 && rate < 100 ? rate : null;
};

// @route   GET /api/payment/installment-rates
export const getInstallmentRates = async (req, res) => {
  try {
    const data = await fetchInstallmentData();
    res.json(data);
  } catch (error) {
    console.error('[INSTALLMENT RATES EXCEPTION]', error);
    res.json({ status: 'error', err_msg: error.message, maxInstallment: 0, ratesByBrand: {} });
  }
};

// --- PayTR BIN Sorgulama ---
// Kart numarasının ilk 6-8 hanesiyle kart markası/bankası/şeması öğrenilir.
// brand (axess/bonus/world...) → taksit için card_type olarak kullanılır.
// brand 'none' veya status 'failed' (yabancı kart) → taksit yapılamaz.

// @route   POST /api/payment/bin-detail
export const binDetail = async (req, res) => {
  try {
    const { binNumber } = req.body;
    const bin = String(binNumber || '').replace(/\D/g, '').slice(0, 8);
    if (bin.length < 6) {
      return res.status(400).json({ status: 'error', err_msg: 'BIN en az 6 hane olmalı.' });
    }

    const merchant_id   = process.env.PAYTR_MERCHANT_ID;
    const merchant_key  = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
    if (!merchant_id || !merchant_key || !merchant_salt) {
      return res.status(500).json({ status: 'error', err_msg: 'PayTR credentials eksik.' });
    }

    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(bin + merchant_id + merchant_salt)
      .digest('base64');

    const form = new URLSearchParams({ merchant_id, bin_number: bin, paytr_token });

    const r = await fetch('https://www.paytr.com/odeme/api/bin-detail', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    form.toString(),
    });
    const data = await r.json();

    // Sadece gerekli alanları dön (kart no asla loglanmaz/saklanmaz)
    res.json({
      status:       data.status,
      brand:        data.brand || 'none',     // axess, bonus, world... veya none
      cardType:     data.cardType || null,    // credit / debit
      bank:         data.bank || null,
      schema:       data.schema || null,      // VISA, MASTERCARD, TROY, AMEX, OTHER
      businessCard: data.businessCard || null,
    });
  } catch (error) {
    console.error('[BIN DETAIL ERROR]', error);
    res.status(500).json({ status: 'error', err_msg: error.message });
  }
};

// --- PayTR Sonuç Yönlendirmeleri ---
// PayTR ödeme sonrası merchant_ok_url / merchant_fail_url'e POST atar.
// Cloudflare Pages (statik SPA) POST'a index.html döndüremez → bu endpoint'ler
// POST'u Express'te karşılayıp 302 ile frontend SPA rotasına (GET) yönlendirir.

const FRONTEND = process.env.FRONTEND_URL || 'https://erpolart.com';

// @route   GET|POST /api/payment/success/:orderId
export const paymentSuccessRedirect = (req, res) => {
  const { orderId } = req.params;
  // Uyarı: bu noktada ödeme henüz onaylanmamış olabilir — kesin durum callback'ten gelir.
  res.redirect(302, `${FRONTEND}/order-success/${orderId}`);
};

// @route   GET|POST /api/payment/fail
export const paymentFailRedirect = (req, res) => {
  res.redirect(302, `${FRONTEND}/order-cancel`);
};

// --- PayTR Direkt API Token ---

// @route   POST /api/payment/paytr-direct-token
// @access  Public
export const createPayTRDirectToken = async (req, res) => {
  try {
    const {
      orderId,
      merchantOkUrl,
      merchantFailUrl,
      userPhone,
      userName,
      installment_count = '0',
      currency: reqCurrency,
      cardType: reqCardType,
    } = req.body;

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

    // Para birimi ve kur dönüşümü
    // Mağazada aktif para birimleri: şu an sadece TL.
    // PayTR diğerlerini onaylayınca ekle: 'USD', 'EUR', 'GBP'
    const SUPPORTED = ['TL'];
    const currency   = SUPPORTED.includes(reqCurrency) ? reqCurrency : 'TL';

    const usdAmount = Number(order.amount) + Number(order.monthly_fee || 0);
    let convertedAmount = usdAmount;

    if (currency !== 'USD') {
      try {
        const rateRes  = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await rateRes.json();
        const rateKey  = currency === 'TL' ? 'TRY' : currency;
        const rate     = rateData?.rates?.[rateKey];
        if (rate) convertedAmount = usdAmount * rate;
      } catch {
        const fallback = { TL: 38, EUR: 0.92, GBP: 0.79 };
        convertedAmount = usdAmount * (fallback[currency] || 1);
      }
    }

    // VADE FARKI (PayTR Direkt API): taksitte komisyon otomatik EKLENMEZ.
    // Müşteriye yansıtmak için taksitli tutarı hesapla:
    //   taksitliTutar = tutar / ((100 - oran) / 100)
    // Oran çözülemezse GÜVENLİ geri dönüş: tek çekime düş (komisyon kaybı yaşama).
    let finalInstallment = (installment_count && installment_count !== '0') ? String(installment_count) : '0';
    let chargeAmount = convertedAmount;
    if (finalInstallment !== '0') {
      const instData = await fetchInstallmentData();
      const brand = (reqCardType && reqCardType !== 'none') ? reqCardType : null;
      const oran = resolveInstallmentRate(instData, brand, Number(finalInstallment));
      if (oran != null) {
        chargeAmount = convertedAmount / ((100 - oran) / 100); // vade farkı dahil toplam
      } else {
        console.warn(`[PAYTR] Taksit oranı çözülemedi (brand=${brand}, taksit=${finalInstallment}) → tek çekime düşüldü`);
        finalInstallment = '0';
      }
    }

    // Taksitli işlemde kart markası gönderilmeli; tek çekimde boş.
    const card_type = (finalInstallment !== '0' && reqCardType && reqCardType !== 'none') ? reqCardType : '';

    // ÖNEMLİ: Direkt API payment_amount = decimal string "100.99" (×100 değil)
    const payment_amount = chargeAmount.toFixed(2);

    // merchant_oid: order UUID (32 hex char) + benzersiz suffix.
    // Aynı sipariş için ödeme tekrar denenebilsin diye her denemede farklı olmalı.
    // Callback'te ilk 32 karakter UUID'ye geri çevrilir, suffix yok sayılır.
    const merchant_oid = order.id.replace(/-/g, '') + Date.now().toString(36);
    const user_ip      = (req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '')
      .replace('::ffff:', '')
      .replace('::1', '') || '1.2.3.4';

    // PayTR telefon formatı: 05XXXXXXXXX
    const rawPhone   = userPhone || '05000000000';
    const user_phone = rawPhone.startsWith('+90')
      ? '0' + rawPhone.slice(3)
      : rawPhone.startsWith('90') && rawPhone.length === 12
        ? '0' + rawPhone.slice(2)
        : rawPhone;

    // Basket — Direkt API: PLAIN JSON string (base64 DEĞİL).
    // Tek satır = toplam tutar (vade farkı dahil) → sepet toplamı payment_amount ile birebir uyumlu.
    const productName = order.templates?.name
      || (finalInstallment !== '0' ? 'Dijital Hizmet (Taksitli)' : 'Dijital Hizmet');
    const user_basket = JSON.stringify([[productName, chargeAmount.toFixed(2), 1]]);

    const payment_type = 'card';
    const non_3d       = '0';
    const test_mode    = process.env.PAYTR_TEST_MODE || '0';
    const debug_on     = test_mode === '1' ? '1' : '0';

    // Hash formülü Direkt API'ye özgü (iFrame'den farklı!) — finalInstallment kullanılır
    const hashSTR = `${merchant_id}${user_ip}${merchant_oid}${order.email}${payment_amount}${payment_type}${finalInstallment}${currency}${test_mode}${non_3d}`;
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hashSTR + merchant_salt)
      .digest('base64');

    res.json({
      paytr_token,
      merchant_id,
      user_ip,
      merchant_oid,
      email:             order.email,
      payment_type,
      payment_amount,
      currency,
      test_mode,
      non_3d,
      merchant_ok_url:   merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      user_name:         userName || order.full_name || 'Guest',
      user_address:      'Digital Delivery',
      user_phone,
      user_basket,
      debug_on,
      client_lang:       'tr',
      non3d_test_failed: '0',
      installment_count: finalInstallment,
      card_type,
    });
  } catch (error) {
    console.error('[PAYTR DIRECT TOKEN ERROR]', error);
    res.status(500).json({ error: error.message });
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
