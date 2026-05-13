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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; }
        .header { text-align: center; border-bottom: 2px solid #5c73ff; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #5c73ff; margin: 0; font-size: 24px; text-transform: uppercase; }
        .section { margin-bottom: 25px; }
        .section-title { font-weight: bold; text-transform: uppercase; font-size: 14px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
        .grid { display: table; width: 100%; }
        .row { display: table-row; }
        .label { display: table-cell; width: 40%; font-weight: bold; padding: 5px 0; font-size: 13px; }
        .value { display: table-cell; padding: 5px 0; font-size: 13px; }
        .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        .highlight { background: #f8f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #5c73ff; }
        .support { background: #fff8f0; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SİPARİŞ ONAY BELGESİ</h1>
          <p style="font-size: 12px; color: #999;">Son Güncelleme: 11 Mayıs 2026</p>
        </div>

        <div class="section">
          <div class="section-title">SATICI BİLGİLERİ</div>
          <div class="grid">
            <div class="row"><div class="label">Unvan</div><div class="value">FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</div></div>
            <div class="row"><div class="label">Adres</div><div class="value">Pınarlı Mah. 24096 Sk. Kapı No: 19 A Aksu / ANTALYA</div></div>
            <div class="row"><div class="label">Vergi No</div><div class="value">9080295761</div></div>
            <div class="row"><div class="label">E-posta</div><div class="value">hello@erpolart.com</div></div>
            <div class="row"><div class="label">Web Sitesi</div><div class="value">erpolart.com</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">ALICI BİLGİLERİ</div>
          <div class="grid">
            <div class="row"><div class="label">Ad Soyad / Unvan</div><div class="value">${customerName}</div></div>
            <div class="row"><div class="label">E-posta</div><div class="value">${customerEmail}</div></div>
            <div class="row"><div class="label">Telefon</div><div class="value">${customerPhone || '-'}</div></div>
            <div class="row"><div class="label">Fatura Adresi</div><div class="value">${customerAddress || '-'}</div></div>
            <div class="row"><div class="label">TC Kimlik / VKN</div><div class="value">${customerTaxId || '-'}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">SİPARİŞ DETAYI</div>
          <div class="highlight">
            <div class="grid">
              <div class="row"><div class="label">Ürün / Hizmet Adı</div><div class="value">${productName}</div></div>
              <div class="row"><div class="label">Türü</div><div class="value">${isSubscription ? 'Aylık Abonelik' : 'Tek Seferlik'}</div></div>
              <div class="row"><div class="label">Fiyat (KDV Dahil)</div><div class="value">${amount} ${currency}</div></div>
              <div class="row"><div class="label">Ödeme Durumu</div><div class="value" style="color: #10b981; font-weight: bold;">ONAYLANDI</div></div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">TESLİMAT BİLGİSİ</div>
          <div style="font-size: 13px;">
            <p>• <b>Hazır şablonlar:</b> Müşteri paneliniz üzerinden anında erişime sunulmuştur.</p>
            <p>• <b>Özel tasarım / SaaS:</b> Ekibimiz 1 iş günü içinde sizinle iletişime geçecektir.</p>
            <p>• <b>Bakım hizmetleri:</b> Aboneliğiniz aktif edilmiştir.</p>
          </div>
        </div>

        <div class="support">
          <div class="section-title" style="color: #f59e0b; border-bottom-color: #ffeccf;">CAYMA HAKKI HATIRLATMASI</div>
          <p style="font-size: 12px;">Dijital ürünlerde (şablon, kod) teslimat sonrası cayma hakkı kullanılamaz. Abonelikleri dilediğiniz zaman panelden iptal edebilirsiniz.</p>
        </div>

        <div class="footer">
          <p>Bu belge, 6502 sayılı Kanun kapsamında sipariş teyidi niteliği taşımaktadır.</p>
          <p><b>FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</b><br>
          Pınarlı Mah. 24096 Sk. No: 19 A Aksu / ANTALYA<br>
          hello@erpolart.com | +90 530 944 07 01</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
