// Ortak premium koyu e-posta kabuğu (sipariş onayıyla aynı marka dili).
// Bildirim tipi mailler (ödeme başarısız, durum güncelleme, iletişim yanıtı,
// admin bildirimleri) bu kabuğu kullanır. E-posta-uyumlu: tablo + inline stil.

const C = {
  page: '#050508', card: '#0b0b12', inner: '#13131c',
  border: 'rgba(255,255,255,0.08)', line: 'rgba(255,255,255,0.07)',
  text: '#f1f1f4', soft: '#b9b9c4', muted: '#868694',
  indigo: '#5C73FF', cyan: '#00E6D2', rose: '#FF2B6D', green: '#10b981', amber: '#f59e0b', red: '#ef4444',
};
const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
const SITE = 'https://erpolart.com';

export const PALETTE = C;
export const EMAIL_FONT = FONT;
export const EMAIL_MONO = MONO;

// Detay kartı (label/value satırları)
export const kvRow = (label, value) => `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid ${C.line};font:600 12px ${FONT};color:${C.muted};width:42%;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${C.line};font:500 13px ${FONT};color:${C.text};vertical-align:top;">${value}</td>
  </tr>`;

export const detailCard = (rowsHtml, accent = C.indigo) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.inner};border:1px solid ${C.border};border-left:3px solid ${accent};border-radius:14px;margin:4px 0 8px;">
    <tr><td style="padding:16px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rowsHtml}</table>
    </td></tr>
  </table>`;

/**
 * Premium koyu marka maili gövdesi.
 * @param {object} o { lang, accent, eyebrow, title, subtitle, preheader, bodyHtml, ctaText, ctaUrl }
 */
export const renderBrandEmail = (o = {}) => {
  const {
    lang = 'tr', accent = C.indigo, accent2 = C.cyan,
    eyebrow = '', title = '', subtitle = '', preheader = '',
    bodyHtml = '', ctaText = '', ctaUrl = '',
  } = o;

  const ctaBlock = ctaText && ctaUrl ? `
    <tr><td align="center" style="padding:8px 32px 4px;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td align="center" style="border-radius:14px;background-color:${accent};background-image:linear-gradient(135deg, ${accent}, ${accent2});">
          <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:15px 34px;font:700 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:14px;">${ctaText}</a>
        </td></tr>
      </table>
    </td></tr>` : '';

  return `<!DOCTYPE html>
<html lang="${String(lang).slice(0, 2)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>
<body style="margin:0;padding:0;background-color:${C.page};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:${C.page};background-image:linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);background-size:40px 40px;padding:30px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:${C.card};border:1px solid ${C.border};border-radius:24px;overflow:hidden;">

        <tr><td style="height:3px;font-size:0;line-height:0;background-color:${accent};background-image:linear-gradient(90deg, ${accent}, ${C.rose} 50%, ${accent2});">&nbsp;</td></tr>

        <tr>
          <td align="center" style="background-color:${C.card};background-image:radial-gradient(circle at 28% 0%, rgba(92,115,255,0.26), transparent 58%), radial-gradient(circle at 82% 18%, rgba(0,230,210,0.16), transparent 52%);padding:38px 32px 30px;">
            <img src="${SITE}/logo-beyaz.png" alt="ErpolArt" width="150" style="width:150px;max-width:58%;height:auto;display:block;margin:0 auto 22px;border:0;outline:none;text-decoration:none;">
            ${eyebrow ? `<div style="font:700 10px ${FONT};letter-spacing:4px;text-transform:uppercase;color:${C.muted};margin-bottom:10px;">${eyebrow}</div>` : ''}
            <h1 style="margin:0;font:italic 800 28px ${FONT};letter-spacing:-0.5px;color:#ffffff;">
              <span style="background:linear-gradient(90deg, ${accent}, #ffffff 55%, ${accent2});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#ffffff;">${title}</span>
            </h1>
            ${subtitle ? `<p style="margin:10px 0 0;font:400 13px ${FONT};color:${C.soft};">${subtitle}</p>` : ''}
          </td>
        </tr>

        <tr><td style="padding:24px 32px 8px;font:500 14px ${FONT};color:${C.soft};line-height:1.7;">${bodyHtml}</td></tr>

        ${ctaBlock}

        <tr>
          <td style="padding:26px 32px 30px;border-top:1px solid ${C.line};margin-top:10px;">
            <img src="${SITE}/logo-beyaz.png" alt="ErpolArt" width="116" style="width:116px;max-width:48%;height:auto;display:block;margin:0 0 12px;border:0;outline:none;text-decoration:none;">
            <p style="margin:0;font:500 12px ${FONT};color:${C.soft};line-height:1.7;">
              <span style="color:${C.muted};">hello@erpolart.com &nbsp;|&nbsp; +90 530 944 07 01 &nbsp;|&nbsp; erpolart.com</span>
            </p>
          </td>
        </tr>

      </table>
      <div style="font:400 11px ${FONT};color:#4f4f5a;padding:18px 0 4px;letter-spacing:0.5px;">© ErpolArt · erpolart.com</div>
    </td></tr>
  </table>
</body>
</html>`;
};
