import { renderBrandEmail, detailCard, kvRow, PALETTE as C, EMAIL_FONT as FONT, EMAIL_MONO as MONO } from './emailShell.js';

const SITE = 'https://erpolart.com';
const pick = (map, lang) => map[String(lang || 'tr').toLowerCase().slice(0, 2)] || map.tr;
const mono = (v) => `<span style="font-family:${MONO};color:${C.text};">${v}</span>`;

/* ───────────────── Ödeme Başarısız (müşteri) ───────────────── */
export const paymentFailedEmail = ({ lang, orderId, productName, amount, currency = '$', retryUrl }) => {
  const T = pick({
    tr: { subject: 'Ödemen tamamlanamadı — ErpolArt', eyebrow: 'Ödeme Başarısız', title: 'Ödemen Tamamlanamadı.',
      subtitle: 'Merak etme — karttan tahsilat yapılmadı.', cta: 'Tekrar Dene',
      body: `<strong style="color:${C.text};">${productName}</strong> için ödeme işlemi tamamlanamadı. Kartından herhangi bir tahsilat yapılmadı; aşağıdaki butondan güvenle tekrar deneyebilirsin. Sorun sürerse bize <a href="mailto:hello@erpolart.com" style="color:${C.indigo};">hello@erpolart.com</a> üzerinden ulaşabilirsin.` },
    en: { subject: 'Your payment didn’t go through — ErpolArt', eyebrow: 'Payment Failed', title: 'Payment Didn’t Go Through.',
      subtitle: 'No worries — your card was not charged.', cta: 'Try Again',
      body: `The payment for <strong style="color:${C.text};">${productName}</strong> could not be completed. Your card was not charged — you can safely try again using the button below. If the issue persists, reach us at <a href="mailto:hello@erpolart.com" style="color:${C.indigo};">hello@erpolart.com</a>.` },
    de: { subject: 'Zahlung fehlgeschlagen — ErpolArt', eyebrow: 'Zahlung fehlgeschlagen', title: 'Zahlung fehlgeschlagen.',
      subtitle: 'Keine Sorge — Ihre Karte wurde nicht belastet.', cta: 'Erneut versuchen',
      body: `Die Zahlung für <strong style="color:${C.text};">${productName}</strong> konnte nicht abgeschlossen werden. Ihre Karte wurde nicht belastet — Sie können es über die Schaltfläche unten erneut versuchen. Bei anhaltenden Problemen erreichen Sie uns unter <a href="mailto:hello@erpolart.com" style="color:${C.indigo};">hello@erpolart.com</a>.` },
  }, lang);

  const rows = kvRow(lang === 'de' ? 'Bestell-Nr' : lang === 'en' ? 'Order No' : 'Sipariş No', mono(orderId || '-')) +
               kvRow(lang === 'de' ? 'Betrag' : lang === 'en' ? 'Amount' : 'Tutar', `${amount} ${currency}`);

  return {
    subject: T.subject,
    html: renderBrandEmail({
      lang, accent: C.red, accent2: C.amber, eyebrow: T.eyebrow, title: T.title, subtitle: T.subtitle,
      preheader: T.title,
      bodyHtml: `<p style="margin:0 0 14px;">${T.body}</p>${detailCard(rows, C.red)}`,
      ctaText: T.cta, ctaUrl: retryUrl || SITE,
    }),
  };
};

/* ───────────────── Durum Güncelleme (müşteri) ───────────────── */
export const statusUpdateEmail = ({ lang, status, orderId, productName }) => {
  const byStatus = {
    development: {
      tr: { eyebrow: 'Kurulum Aşamasında', title: 'Geliştirme Başladı.', subtitle: 'Projen artık ekibimizin elinde.',
        body: `<strong style="color:${C.text};">${productName}</strong> için kurulum ve geliştirme süreci başladı. İlerlemeyi panelinden takip edebilir, dilediğin an revizyon talebi iletebilirsin.` },
      en: { eyebrow: 'In Development', title: 'Development Started.', subtitle: 'Your project is now in our hands.',
        body: `Setup and development for <strong style="color:${C.text};">${productName}</strong> has begun. Track progress from your dashboard and send revision requests anytime.` },
      de: { eyebrow: 'In Entwicklung', title: 'Entwicklung gestartet.', subtitle: 'Ihr Projekt ist jetzt bei uns.',
        body: `Einrichtung und Entwicklung für <strong style="color:${C.text};">${productName}</strong> haben begonnen. Verfolgen Sie den Fortschritt im Dashboard und senden Sie jederzeit Revisionswünsche.` },
    },
    revision: {
      tr: { eyebrow: 'Revizyon', title: 'Revizyon Sürecinde.', subtitle: 'Talebin işleniyor.',
        body: `<strong style="color:${C.text};">${productName}</strong> için revizyon talebin alındı ve üzerinde çalışılıyor. Tamamlandığında bilgilendirileceksin.` },
      en: { eyebrow: 'Revision', title: 'In Revision.', subtitle: 'Your request is being processed.',
        body: `Your revision request for <strong style="color:${C.text};">${productName}</strong> has been received and is being worked on. You’ll be notified when it’s ready.` },
      de: { eyebrow: 'Revision', title: 'In Revision.', subtitle: 'Ihre Anfrage wird bearbeitet.',
        body: `Ihr Revisionswunsch für <strong style="color:${C.text};">${productName}</strong> ist eingegangen und wird bearbeitet. Sie werden benachrichtigt, sobald er fertig ist.` },
    },
    active: {
      tr: { eyebrow: 'Aktif Sistem', title: 'Sistemin Yayında! 🚀', subtitle: 'Tebrikler — projen canlı.',
        body: `<strong style="color:${C.text};">${productName}</strong> artık aktif ve yayında. Panelinden tüm detaylara ulaşabilirsin. Bizi tercih ettiğin için teşekkürler!` },
      en: { eyebrow: 'Active System', title: 'Your System is Live! 🚀', subtitle: 'Congrats — your project is live.',
        body: `<strong style="color:${C.text};">${productName}</strong> is now active and live. Access all details from your dashboard. Thank you for choosing us!` },
      de: { eyebrow: 'Aktives System', title: 'Ihr System ist live! 🚀', subtitle: 'Glückwunsch — Ihr Projekt ist online.',
        body: `<strong style="color:${C.text};">${productName}</strong> ist jetzt aktiv und live. Alle Details finden Sie in Ihrem Dashboard. Danke, dass Sie sich für uns entschieden haben!` },
    },
  };
  const accentByStatus = { development: C.indigo, revision: C.rose, active: C.green };
  const subj = pick({
    tr: { development: 'Projen geliştirmede — ErpolArt', revision: 'Revizyon sürecinde — ErpolArt', active: 'Sistemin yayında! — ErpolArt' },
    en: { development: 'Your project is in development — ErpolArt', revision: 'In revision — ErpolArt', active: 'Your system is live! — ErpolArt' },
    de: { development: 'Ihr Projekt in Entwicklung — ErpolArt', revision: 'In Revision — ErpolArt', active: 'Ihr System ist live! — ErpolArt' },
  }, lang);

  const T = pick(byStatus[status] || byStatus.development, lang);
  const cta = pick({ tr: 'Paneli Gör', en: 'View Dashboard', de: 'Dashboard ansehen' }, lang);

  return {
    subject: subj[status] || subj.development,
    html: renderBrandEmail({
      lang, accent: accentByStatus[status] || C.indigo, eyebrow: T.eyebrow, title: T.title, subtitle: T.subtitle,
      preheader: T.title,
      bodyHtml: `<p style="margin:0 0 14px;">${T.body}</p>${detailCard(kvRow(lang === 'de' ? 'Bestell-Nr' : lang === 'en' ? 'Order No' : 'Sipariş No', mono(orderId || '-')), accentByStatus[status] || C.indigo)}`,
      ctaText: cta, ctaUrl: `${SITE}/dashboard`,
    }),
  };
};

/* ───────────────── İletişim Otomatik Yanıt (müşteri) ───────────────── */
export const contactReplyEmail = ({ lang, name }) => {
  const T = pick({
    tr: { subject: 'Mesajını aldık — ErpolArt', eyebrow: 'Teşekkürler', title: 'Mesajını Aldık.', subtitle: 'En kısa sürede dönüş yapacağız.', cta: 'Şablonları Keşfet',
      body: `Merhaba <strong style="color:${C.text};">${name || ''}</strong>, talebin bize ulaştı. Ekibimiz genellikle <strong style="color:${C.text};">24 saat</strong> içinde sana dönüş yapar. Bu süreçte premium şablonlarımıza göz atabilirsin.` },
    en: { subject: 'We received your message — ErpolArt', eyebrow: 'Thank You', title: 'We Got Your Message.', subtitle: 'We’ll get back to you shortly.', cta: 'Explore Templates',
      body: `Hi <strong style="color:${C.text};">${name || ''}</strong>, your request has reached us. Our team usually replies within <strong style="color:${C.text};">24 hours</strong>. Meanwhile, feel free to browse our premium templates.` },
    de: { subject: 'Wir haben Ihre Nachricht erhalten — ErpolArt', eyebrow: 'Vielen Dank', title: 'Nachricht erhalten.', subtitle: 'Wir melden uns in Kürze.', cta: 'Vorlagen entdecken',
      body: `Hallo <strong style="color:${C.text};">${name || ''}</strong>, Ihre Anfrage ist bei uns eingegangen. Unser Team antwortet in der Regel innerhalb von <strong style="color:${C.text};">24 Stunden</strong>. Schauen Sie sich in der Zwischenzeit gern unsere Premium-Vorlagen an.` },
  }, lang);

  return {
    subject: T.subject,
    html: renderBrandEmail({
      lang, eyebrow: T.eyebrow, title: T.title, subtitle: T.subtitle, preheader: T.title,
      bodyHtml: `<p style="margin:0;">${T.body}</p>`,
      ctaText: T.cta, ctaUrl: `${SITE}/templates`,
    }),
  };
};

/* ───────────────── Admin: Yeni Ödeme (sana, TR) ───────────────── */
export const adminNewOrderEmail = ({ orderId, productName, amount, currency = '$', customerName, customerEmail, customerPhone }) => ({
  subject: `💰 Yeni Ödeme: ${amount} ${currency} — ${productName}`,
  html: renderBrandEmail({
    lang: 'tr', accent: C.green, accent2: C.cyan, eyebrow: 'Yeni Ödeme', title: 'Yeni Sipariş Ödendi.',
    subtitle: 'Kasaya yeni bir ödeme düştü.', preheader: `Yeni ödeme: ${amount} ${currency}`,
    bodyHtml: detailCard(
      kvRow('Ürün / Hizmet', productName || '-') +
      kvRow('Tutar', `${amount} ${currency}`) +
      kvRow('Sipariş No', mono(orderId || '-')) +
      kvRow('Müşteri', customerName || '-') +
      kvRow('E-posta', customerEmail || '-') +
      kvRow('Telefon', customerPhone || '-'),
      C.green
    ),
    ctaText: 'Admin Panel', ctaUrl: `${SITE}/admin/orders`,
  }),
});

/* ───────────────── Admin: Yeni İletişim Talebi (sana, TR) ───────────────── */
export const adminNewLeadEmail = ({ name, email, phone, service, message }) => ({
  subject: `📬 Yeni İletişim Talebi — ${name || 'Ziyaretçi'}`,
  html: renderBrandEmail({
    lang: 'tr', accent: C.indigo, eyebrow: 'Yeni Talep', title: 'Yeni İletişim Talebi.',
    subtitle: 'Bir ziyaretçi form gönderdi.', preheader: `Yeni talep: ${name || ''}`,
    bodyHtml: detailCard(
      kvRow('Ad', name || '-') +
      kvRow('E-posta', email || '-') +
      kvRow('Telefon', phone || '-') +
      kvRow('Hizmet', service || '-') +
      kvRow('Mesaj', (message || '-').replace(/</g, '&lt;'))
    ),
    ctaText: 'Talepleri Gör', ctaUrl: `${SITE}/admin`,
  }),
});
