import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const { user, email_data } = await req.json();
    const { token_hash, redirect_to, email_action_type } = email_data;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;

    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    let subject = '';
    let html = '';

    if (email_action_type === 'signup') {
      subject = 'ErpolArt — E-posta Adresinizi Doğrulayın';
      html = buildConfirmEmail(confirmationUrl);
    } else if (email_action_type === 'recovery') {
      subject = 'ErpolArt — Şifre Sıfırlama';
      html = buildPasswordResetEmail(confirmationUrl);
    } else if (email_action_type === 'email_change') {
      subject = 'ErpolArt — E-posta Değişikliğini Onaylayın';
      html = buildConfirmEmail(confirmationUrl);
    } else {
      subject = 'ErpolArt — Hesabınızı Doğrulayın';
      html = buildConfirmEmail(confirmationUrl);
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
      const err = await res.json();
      console.error('Resend error:', err);
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

function buildConfirmEmail(url: string): string {
  return `
    <div style="font-family:sans-serif;background:#0c0c16;color:#fff;padding:48px 40px;max-width:600px;margin:auto;border-radius:24px;">
      <h1 style="font-style:italic;letter-spacing:-2px;color:#5c73ff;margin:0 0 4px;">ErpolArt</h1>
      <p style="color:#5c73ff;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 24px;">Digital Atelier</p>
      <hr style="border-color:#222;margin:0 0 24px;"/>
      <p style="margin:0 0 16px;">Merhaba,</p>
      <p style="color:#aaa;margin:0 0 32px;">ErpolArt'a hoş geldiniz. E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın.</p>
      <a href="${url}" style="display:inline-block;background:#5c73ff;color:#fff;padding:16px 32px;text-decoration:none;border-radius:12px;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:32px;">
        E-postayı Doğrula →
      </a>
      <p style="color:#555;font-size:11px;margin:0 0 8px;">Buton çalışmıyorsa bu bağlantıyı tarayıcınıza yapıştırın:</p>
      <p style="color:#5c73ff;font-size:11px;word-break:break-all;margin:0 0 24px;">${url}</p>
      <hr style="border-color:#222;margin:0 0 16px;"/>
      <p style="color:#555;font-size:11px;">Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
    </div>
  `;
}

function buildPasswordResetEmail(url: string): string {
  return `
    <div style="font-family:sans-serif;background:#0c0c16;color:#fff;padding:48px 40px;max-width:600px;margin:auto;border-radius:24px;">
      <h1 style="font-style:italic;letter-spacing:-2px;color:#5c73ff;margin:0 0 4px;">ErpolArt</h1>
      <p style="color:#5c73ff;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 24px;">Digital Atelier</p>
      <hr style="border-color:#222;margin:0 0 24px;"/>
      <p style="margin:0 0 16px;">Merhaba,</p>
      <p style="color:#aaa;margin:0 0 32px;">Şifrenizi sıfırlamak için bir istek aldık. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.</p>
      <a href="${url}" style="display:inline-block;background:#5c73ff;color:#fff;padding:16px 32px;text-decoration:none;border-radius:12px;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:32px;">
        Şifremi Sıfırla →
      </a>
      <p style="color:#555;font-size:11px;margin:0 0 8px;">Buton çalışmıyorsa bu bağlantıyı tarayıcınıza yapıştırın:</p>
      <p style="color:#5c73ff;font-size:11px;word-break:break-all;margin:0 0 24px;">${url}</p>
      <hr style="border-color:#222;margin:0 0 16px;"/>
      <p style="color:#555;font-size:11px;">Bu isteği siz yapmadıysanız şifreniz değişmeyecektir. Hesabınız güvende.</p>
    </div>
  `;
}
