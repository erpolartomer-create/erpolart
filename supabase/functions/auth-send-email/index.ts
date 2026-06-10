import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Only allow redirects to erpolart.com — prevents phishing via direct function calls
const ALLOWED_REDIRECT_ORIGIN = 'https://erpolart.com';

serve(async (req) => {
  try {
    const { user, email_data } = await req.json();
    const { token_hash, email_action_type } = email_data;
    let redirect_to: string = email_data.redirect_to || ALLOWED_REDIRECT_ORIGIN;

    // Müşterinin dili: redirect_to'daki ?lang=xx → yoksa user_metadata.lang → tr.
    let langFromUrl: string | null = null;

    // Guard: strip any redirect_to that doesn't point to our domain
    try {
      const redirectUrl = new URL(redirect_to);
      if (redirectUrl.origin !== ALLOWED_REDIRECT_ORIGIN) {
        redirect_to = ALLOWED_REDIRECT_ORIGIN;
      } else {
        langFromUrl = redirectUrl.searchParams.get('lang');
      }
    } catch {
      redirect_to = ALLOWED_REDIRECT_ORIGIN;
    }

    const lang = normalizeLang(langFromUrl || user?.user_metadata?.lang || 'tr');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;

    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

    let subject = '';
    let html = '';

    if (email_action_type === 'recovery') {
      subject = SUBJECTS[lang].recovery;
      html = buildPasswordResetEmail(confirmationUrl, lang);
    } else if (email_action_type === 'email_change') {
      subject = SUBJECTS[lang].emailChange;
      html = buildConfirmEmail(confirmationUrl, lang);
    } else {
      // signup ve diğer doğrulamalar
      subject = SUBJECTS[lang].signup;
      html = buildConfirmEmail(confirmationUrl, lang);
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'ErpolArt <hello@erpolart.com>',
        to: [user.email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', res.status, err);
      return new Response(JSON.stringify({ error: 'Mail gönderilemedi' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('auth-send-email error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// ── Premium koyu marka kabuğu (sipariş onayı maille aynı dil) ──
// Deno edge function'ı backend şablonunu import edemediği için stil burada
// kendi kendine yeten biçimde kuruldu (tablo + inline stil, e-posta uyumlu).
const C = {
  page: '#050508', card: '#0b0b12', inner: '#13131c',
  border: 'rgba(255,255,255,0.08)', line: 'rgba(255,255,255,0.07)',
  text: '#f1f1f4', soft: '#b9b9c4', muted: '#868694',
  indigo: '#5C73FF', cyan: '#00E6D2', rose: '#FF2B6D', amber: '#f59e0b',
};
const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SITE = 'https://erpolart.com';

type Lang = 'tr' | 'en' | 'de';

function normalizeLang(raw: unknown): Lang {
  const l = String(raw || 'tr').toLowerCase().slice(0, 2);
  return l === 'en' || l === 'de' ? l : 'tr';
}

// ── Konu satırları ──
const SUBJECTS: Record<Lang, { signup: string; recovery: string; emailChange: string }> = {
  tr: {
    signup: 'ErpolArt — E-posta Adresinizi Doğrulayın',
    recovery: 'ErpolArt — Şifre Sıfırlama',
    emailChange: 'ErpolArt — E-posta Değişikliğini Onaylayın',
  },
  en: {
    signup: 'ErpolArt — Confirm Your Email',
    recovery: 'ErpolArt — Reset Your Password',
    emailChange: 'ErpolArt — Confirm Email Change',
  },
  de: {
    signup: 'ErpolArt — E-Mail-Adresse bestätigen',
    recovery: 'ErpolArt — Passwort zurücksetzen',
    emailChange: 'ErpolArt — E-Mail-Änderung bestätigen',
  },
};

// ── Mail metinleri (TR / EN / DE) ──
const STRINGS: Record<Lang, {
  fallback: string; footerTag: string;
  confirm: { eyebrow: string; title: string; subtitle: string; preheader: string; body: string; cta: string; note: string };
  recovery: { eyebrow: string; title: string; subtitle: string; preheader: string; body: string; cta: string; note: string };
}> = {
  tr: {
    fallback: 'Buton çalışmıyorsa bu bağlantıyı tarayıcınıza yapıştırın:',
    footerTag: 'Dijital Mimari Atölyesi',
    confirm: {
      eyebrow: 'Hoş Geldiniz', title: 'E-postanı Doğrula',
      subtitle: 'Hesabını aktifleştirmek için tek adım kaldı.',
      preheader: 'ErpolArt hesabını doğrulamak için e-posta adresini onayla.',
      body: 'Merhaba,<br><br>ErpolArt\'a hoş geldin. Hesabını kullanmaya başlamak için aşağıdaki butonla e-posta adresini doğrula.',
      cta: 'E-postayı Doğrula →',
      note: 'Bu isteği sen yapmadıysan bu e-postayı görmezden gelebilirsin — hiçbir işlem yapılmaz.',
    },
    recovery: {
      eyebrow: 'Güvenlik', title: 'Şifre Sıfırlama',
      subtitle: 'Hesabın için yeni bir şifre belirle.',
      preheader: 'Şifreni sıfırlamak için güvenli bağlantın hazır.',
      body: 'Merhaba,<br><br>Hesabın için bir şifre sıfırlama isteği aldık. Yeni şifreni belirlemek için aşağıdaki butona tıkla.',
      cta: 'Şifremi Sıfırla →',
      note: 'Bu isteği sen yapmadıysan şifren değişmeyecektir — hesabın güvende. Bağlantı kısa süre sonra geçersiz olur.',
    },
  },
  en: {
    fallback: 'If the button doesn\'t work, paste this link into your browser:',
    footerTag: 'Digital Architecture Studio',
    confirm: {
      eyebrow: 'Welcome', title: 'Confirm Your Email',
      subtitle: 'Just one step left to activate your account.',
      preheader: 'Confirm your email address to verify your ErpolArt account.',
      body: 'Hello,<br><br>Welcome to ErpolArt. To start using your account, confirm your email address with the button below.',
      cta: 'Confirm Email →',
      note: 'If you didn\'t request this, you can safely ignore this email — no action will be taken.',
    },
    recovery: {
      eyebrow: 'Security', title: 'Reset Password',
      subtitle: 'Set a new password for your account.',
      preheader: 'Your secure link to reset your password is ready.',
      body: 'Hello,<br><br>We received a password reset request for your account. Click the button below to set your new password.',
      cta: 'Reset Password →',
      note: 'If you didn\'t request this, your password won\'t change — your account is safe. This link expires shortly.',
    },
  },
  de: {
    fallback: 'Wenn die Schaltfläche nicht funktioniert, fügen Sie diesen Link in Ihren Browser ein:',
    footerTag: 'Studio für digitale Architektur',
    confirm: {
      eyebrow: 'Willkommen', title: 'E-Mail bestätigen',
      subtitle: 'Nur noch ein Schritt, um Ihr Konto zu aktivieren.',
      preheader: 'Bestätigen Sie Ihre E-Mail-Adresse, um Ihr ErpolArt-Konto zu verifizieren.',
      body: 'Hallo,<br><br>Willkommen bei ErpolArt. Um Ihr Konto zu nutzen, bestätigen Sie Ihre E-Mail-Adresse über die Schaltfläche unten.',
      cta: 'E-Mail bestätigen →',
      note: 'Falls Sie dies nicht angefordert haben, können Sie diese E-Mail ignorieren — es wird nichts unternommen.',
    },
    recovery: {
      eyebrow: 'Sicherheit', title: 'Passwort zurücksetzen',
      subtitle: 'Legen Sie ein neues Passwort für Ihr Konto fest.',
      preheader: 'Ihr sicherer Link zum Zurücksetzen des Passworts ist bereit.',
      body: 'Hallo,<br><br>Wir haben eine Anfrage zum Zurücksetzen des Passworts erhalten. Klicken Sie auf die Schaltfläche unten, um Ihr neues Passwort festzulegen.',
      cta: 'Passwort zurücksetzen →',
      note: 'Falls Sie dies nicht angefordert haben, bleibt Ihr Passwort unverändert — Ihr Konto ist sicher. Dieser Link läuft bald ab.',
    },
  },
};

interface BrandEmailOpts {
  lang: Lang;
  eyebrow: string;
  title: string;
  subtitle: string;
  preheader: string;
  bodyHtml: string;
  ctaText: string;
  ctaUrl: string;
  noteHtml?: string;
}

function renderBrandEmail(o: BrandEmailOpts): string {
  const accent = C.indigo;
  const accent2 = C.cyan;
  return `<!DOCTYPE html>
<html lang="${o.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>
<body style="margin:0;padding:0;background-color:${C.page};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${o.preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:${C.page};background-image:linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);background-size:40px 40px;padding:30px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:${C.card};border:1px solid ${C.border};border-radius:24px;overflow:hidden;">

        <tr><td style="height:3px;font-size:0;line-height:0;background-color:${accent};background-image:linear-gradient(90deg, ${accent}, ${C.rose} 50%, ${accent2});">&nbsp;</td></tr>

        <tr>
          <td align="center" style="background-color:${C.card};background-image:radial-gradient(circle at 28% 0%, rgba(92,115,255,0.26), transparent 58%), radial-gradient(circle at 82% 18%, rgba(0,230,210,0.16), transparent 52%);padding:38px 32px 30px;">
            <img src="${SITE}/logo-beyaz.png" alt="ErpolArt" width="150" style="width:150px;max-width:58%;height:auto;display:block;margin:0 auto 22px;border:0;outline:none;text-decoration:none;">
            <div style="font:700 10px ${FONT};letter-spacing:4px;text-transform:uppercase;color:${C.muted};margin-bottom:10px;">${o.eyebrow}</div>
            <h1 style="margin:0;font:italic 800 28px ${FONT};letter-spacing:-0.5px;color:#ffffff;">
              <span style="background:linear-gradient(90deg, ${accent}, #ffffff 55%, ${accent2});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#ffffff;">${o.title}</span>
            </h1>
            <p style="margin:10px 0 0;font:400 13px ${FONT};color:${C.soft};">${o.subtitle}</p>
          </td>
        </tr>

        <tr><td style="padding:24px 32px 8px;font:500 14px ${FONT};color:${C.soft};line-height:1.7;">${o.bodyHtml}</td></tr>

        <tr><td align="center" style="padding:8px 32px 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td align="center" style="border-radius:14px;background-color:${accent};background-image:linear-gradient(135deg, ${accent}, ${accent2});">
              <a href="${o.ctaUrl}" target="_blank" style="display:inline-block;padding:15px 34px;font:700 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:14px;">${o.ctaText}</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 32px 4px;">
          <p style="margin:0 0 6px;font:500 11px ${FONT};color:${C.muted};">${STRINGS[o.lang].fallback}</p>
          <p style="margin:0;font:500 11px ${FONT};color:${accent};word-break:break-all;">${o.ctaUrl}</p>
        </td></tr>

        ${o.noteHtml ? `
        <tr><td style="padding:18px 32px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.22);border-radius:14px;">
            <tr><td style="padding:14px 18px;font:500 12px ${FONT};color:${C.soft};line-height:1.6;">${o.noteHtml}</td></tr>
          </table>
        </td></tr>` : ''}

        <tr>
          <td style="padding:26px 32px 30px;border-top:1px solid ${C.line};">
            <img src="${SITE}/logo-beyaz.png" alt="ErpolArt" width="116" style="width:116px;max-width:48%;height:auto;display:block;margin:0 0 12px;border:0;outline:none;text-decoration:none;">
            <p style="margin:0;font:500 12px ${FONT};color:${C.soft};line-height:1.7;">
              <span style="color:${C.muted};">hello@erpolart.com &nbsp;|&nbsp; +90 530 944 07 01 &nbsp;|&nbsp; erpolart.com</span>
            </p>
          </td>
        </tr>

      </table>
      <div style="font:400 11px ${FONT};color:#4f4f5a;padding:18px 0 4px;letter-spacing:0.5px;">© ErpolArt · ${STRINGS[o.lang].footerTag} · erpolart.com</div>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmEmail(url: string, lang: Lang): string {
  const t = STRINGS[lang].confirm;
  return renderBrandEmail({
    lang,
    eyebrow: t.eyebrow,
    title: t.title,
    subtitle: t.subtitle,
    preheader: t.preheader,
    bodyHtml: t.body,
    ctaText: t.cta,
    ctaUrl: url,
    noteHtml: t.note,
  });
}

function buildPasswordResetEmail(url: string, lang: Lang): string {
  const t = STRINGS[lang].recovery;
  return renderBrandEmail({
    lang,
    eyebrow: t.eyebrow,
    title: t.title,
    subtitle: t.subtitle,
    preheader: t.preheader,
    bodyHtml: t.body,
    ctaText: t.cta,
    ctaUrl: url,
    noteHtml: t.note,
  });
}
