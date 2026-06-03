export const getOrderConfirmationTemplate = (data) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerTaxId,
    orderId,
    orderDate,
    amount,
    productName,
    isSubscription,
    currency = '$'
  } = data;

  // ── Marka paleti (sitenin koyu/neon havası) ──
  const C = {
    page:   '#050508',
    card:   '#0b0b12',
    inner:  '#13131c',
    border: 'rgba(255,255,255,0.08)',
    line:   'rgba(255,255,255,0.07)',
    text:   '#f1f1f4',
    soft:   '#b9b9c4',
    muted:  '#868694',
    indigo: '#5C73FF',
    cyan:   '#00E6D2',
    rose:   '#FF2B6D',
    green:  '#10b981',
    amber:  '#f59e0b',
  };
  const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
  const SITE = 'https://erpolart.com';

  // ── Yardımcılar (e-posta-uyumlu: tablo + inline stil) ──
  const label = (t, color = C.indigo) =>
    `<div style="font:700 10px ${FONT};letter-spacing:3px;text-transform:uppercase;color:${color};margin:0 0 12px;">${t}</div>`;

  const hairline = `
    <tr><td style="padding:6px 32px;">
      <div style="height:1px;font-size:0;line-height:0;background-color:${C.line};background-image:linear-gradient(90deg, transparent, rgba(92,115,255,0.45), rgba(0,230,210,0.35), transparent);">&nbsp;</div>
    </td></tr>`;

  const row = (lbl, value, valStyle = '') => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid ${C.line};font:600 12px ${FONT};color:${C.muted};width:42%;vertical-align:top;">${lbl}</td>
      <td style="padding:9px 0;border-bottom:1px solid ${C.line};font:500 13px ${FONT};color:${C.text};vertical-align:top;${valStyle}">${value}</td>
    </tr>`;

  const grid = (rows) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>
<body style="margin:0;padding:0;background-color:${C.page};-webkit-font-smoothing:antialiased;">
  <!-- önizleme metni -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Siparişin onaylandı — ${productName} · ${amount} ${currency}. Ödemen başarıyla alındı.
  </div>

  <!-- Sayfa: koyu + sitenin grid dokusu (desteklemeyen istemcide düz koyuya düşer) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:${C.page};background-image:linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);background-size:40px 40px;padding:30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:${C.card};border:1px solid ${C.border};border-radius:24px;overflow:hidden;">

          <!-- üst neon hat -->
          <tr><td style="height:3px;font-size:0;line-height:0;background-color:${C.indigo};background-image:linear-gradient(90deg, ${C.indigo}, ${C.rose} 50%, ${C.cyan});">&nbsp;</td></tr>

          <!-- HEADER: logo + glow + italik gradyan başlık -->
          <tr>
            <td align="center" style="background-color:${C.card};background-image:radial-gradient(circle at 28% 0%, rgba(92,115,255,0.28), transparent 58%), radial-gradient(circle at 82% 18%, rgba(0,230,210,0.18), transparent 52%);padding:40px 32px 34px;">
              <img src="${SITE}/logo-beyaz.png" alt="ErpolArt" width="150" style="width:150px;max-width:60%;height:auto;display:block;margin:0 auto 24px;border:0;outline:none;text-decoration:none;">

              <div style="width:60px;height:60px;margin:0 auto 18px;background-color:rgba(16,185,129,0.14);border:1px solid rgba(16,185,129,0.4);border-radius:50%;text-align:center;">
                <span style="font:700 30px ${FONT};color:${C.green};line-height:60px;">&#10003;</span>
              </div>

              <div style="font:700 10px ${FONT};letter-spacing:4px;text-transform:uppercase;color:${C.muted};margin-bottom:10px;">Ödeme Onaylandı</div>
              <h1 style="margin:0;font:italic 800 30px ${FONT};letter-spacing:-0.5px;color:#ffffff;">
                <span style="background:linear-gradient(90deg, ${C.indigo}, #ffffff 55%, ${C.cyan});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#ffffff;">Siparişin Onaylandı.</span>
              </h1>
              <p style="margin:10px 0 0;font:400 13px ${FONT};color:${C.soft};">Ödemen başarıyla alındı — teşekkür ederiz!</p>
            </td>
          </tr>

          <!-- ÖZET KARTI -->
          <tr>
            <td style="padding:26px 32px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.inner};border:1px solid ${C.border};border-left:3px solid ${C.indigo};border-radius:16px;">
                <tr>
                  <td style="padding:20px 22px;">
                    ${label('Dijital Mimari', C.cyan)}
                    <div style="font:italic 700 18px ${FONT};color:${C.text};margin:0 0 16px;">${productName}</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:bottom;">
                          <div style="font:600 10px ${FONT};letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Tutar · KDV dahil</div>
                          <div style="font:800 28px ${FONT};color:#ffffff;margin-top:3px;">
                            <span style="background:linear-gradient(90deg, ${C.indigo}, ${C.cyan});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:${C.cyan};">${amount} ${currency}</span>
                          </div>
                        </td>
                        <td align="right" style="vertical-align:bottom;">
                          <span style="display:inline-block;background-color:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);color:${C.green};font:700 10px ${FONT};letter-spacing:1.5px;text-transform:uppercase;padding:8px 14px;border-radius:999px;">&#10003; Ödendi</span>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top:16px;padding-top:14px;border-top:1px solid ${C.line};font:500 12px ${FONT};color:${C.soft};">
                      <span style="color:${C.muted};">TÜR:</span> ${isSubscription ? 'Aylık Abonelik' : 'Tek Seferlik'}
                      &nbsp; <span style="color:${C.line};">|</span> &nbsp;
                      <span style="color:${C.muted};">SİPARİŞ NO:</span> <span style="font-family:${MONO};color:${C.text};">${orderId || '-'}</span>
                      &nbsp; <span style="color:${C.line};">|</span> &nbsp;
                      <span style="color:${C.muted};">TARİH:</span> ${orderDate || '-'}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:18px 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr><td align="center" style="border-radius:14px;background-color:${C.indigo};background-image:linear-gradient(135deg, ${C.indigo}, ${C.cyan});">
                  <a href="${SITE}/dashboard" target="_blank" style="display:inline-block;padding:15px 34px;font:700 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:14px;">Panele Git &#8594;</a>
                </td></tr>
              </table>
            </td>
          </tr>

          ${hairline}

          <!-- TESLİMAT -->
          <tr>
            <td style="padding:14px 32px 4px;">
              ${label('Teslimat', C.cyan)}
              <div style="font:500 13px ${FONT};color:${C.soft};line-height:1.8;">
                &bull; <b style="color:${C.text};">Hazır şablonlar:</b> Müşteri paneliniz üzerinden düzenleme ve revizyon taleplerinizi iletebilirsiniz.<br>
                &bull; <b style="color:${C.text};">Özel tasarım / SaaS:</b> Ekibimiz 1 iş günü içinde sizinle iletişime geçecektir.<br>
                &bull; <b style="color:${C.text};">Bakım hizmetleri:</b> Aboneliğiniz aktif edilmiştir.
              </div>
            </td>
          </tr>

          <!-- ALICI -->
          <tr>
            <td style="padding:22px 32px 4px;">
              ${label('Alıcı Bilgileri')}
              ${grid(
                row('Ad Soyad / Unvan', customerName || '-') +
                row('E-posta', customerEmail || '-') +
                row('Telefon', customerPhone || '-') +
                row('Fatura Adresi', customerAddress || '-') +
                row('TC Kimlik / VKN', customerTaxId || '-')
              )}
            </td>
          </tr>

          <!-- SATICI -->
          <tr>
            <td style="padding:22px 32px 4px;">
              ${label('Satıcı Bilgileri')}
              ${grid(
                row('Unvan', 'FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK') +
                row('Adres', 'Pınarlı Mah. 24096 Sk. Kapı No: 19 A Aksu / ANTALYA') +
                row('Vergi No', '9080295761') +
                row('E-posta', 'hello@erpolart.com') +
                row('Web Sitesi', 'erpolart.com')
              )}
            </td>
          </tr>

          <!-- CAYMA HAKKI -->
          <tr>
            <td style="padding:22px 32px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.22);border-radius:14px;">
                <tr><td style="padding:16px 18px;">
                  ${label('Cayma Hakkı Hatırlatması', C.amber)}
                  <p style="margin:0;font:500 12px ${FONT};color:${C.soft};line-height:1.6;">Dijital ürünlerde (şablon, kod) teslimat sonrası cayma hakkı kullanılamaz. Abonelikleri dilediğiniz zaman panelden iptal edebilirsiniz.</p>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:26px 32px 32px;border-top:1px solid ${C.line};">
              <img src="${SITE}/logo-beyaz.png" alt="ErpolArt" width="120" style="width:120px;max-width:50%;height:auto;display:block;margin:0 0 14px;border:0;outline:none;text-decoration:none;">
              <p style="margin:0 0 10px;font:400 11px ${FONT};color:${C.muted};line-height:1.6;">Bu belge, 6502 sayılı Kanun kapsamında sipariş teyidi niteliği taşımaktadır.</p>
              <p style="margin:0;font:600 12px ${FONT};color:${C.soft};line-height:1.7;">
                FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK<br>
                <span style="font-weight:400;color:${C.muted};">Pınarlı Mah. 24096 Sk. No: 19 A Aksu / ANTALYA<br>
                hello@erpolart.com &nbsp;|&nbsp; +90 530 944 07 01</span>
              </p>
            </td>
          </tr>

        </table>

        <div style="font:400 11px ${FONT};color:#4f4f5a;padding:18px 0 4px;letter-spacing:0.5px;">© ErpolArt · Dijital Mimari Atölyesi · erpolart.com</div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
