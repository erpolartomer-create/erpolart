// Sunucu-taraflı OTORİTER fiyatlandırma — frontend pricing bileşenlerinin
// sabitlerini birebir yansıtır. Hizmet (projects/saas/automations) siparişlerinde
// istemciden gelen tutara ASLA güvenilmez; tutar buradan hesaplanır.
//
// Kaynaklar:
//   src/components/saas/SaaSPricing.jsx
//   src/components/automations/AutomationsPricing.jsx
//   src/components/projects/ProjectsPricing.jsx
// Bu dosyayı onlarla SENKRON tut (fiyat değişirse ikisini birlikte güncelle).

const SAAS = {
  tiers:  { starter: 3500, pro: 7500, scale: 15000, enterprise: 30000 },
  extras: { payments: 480, ai: 640, mobile: 560, multilang: 280, crm: 400, api: 320, email: 200, analytics: 360 },
};

const AUTOMATIONS = {
  tiers:  { starter: 1500, growth: 3500, scale: 7000, enterprise: 14000 },
  extras: { ai: 400, monitoring: 280, crm: 360, pipeline: 480, reports: 200, slack: 160, webhooks: 240, nlp: 400, training: 320 },
};

const PROJECTS_EXTRAS = {
  ecommerce: 300, blog: 150, multilang: 100, admin: 400, reservation: 300,
  reviews: 200, livechat: 150, seo: 200, branding: 300,
};

function projectsBasePrice(pagesRaw) {
  const p = Math.max(1, Math.floor(Number(pagesRaw) || 1));
  if (p === 1) return 130;
  if (p === 2) return 200;
  if (p <= 8)  return 300  + (p - 3)  * 150;
  if (p <= 14) return 1550 + (p - 9)  * 130;
  return              2450 + (p - 15) * 510;
}

// Bilinen hizmet kaynakları (template/proposal değil — onlar sunucuda zaten hesaplı)
export const SERVICE_SOURCES = new Set(['projects', 'saas', 'automations']);

// Otoriter toplam (USD). Hesaplanamazsa null döner (çağıran reddetmeli).
export function computeServiceTotal({ source, tier, extras = [], pages, langCount = 2 } = {}) {
  const ex = Array.isArray(extras) ? extras : [];

  if (source === 'saas' || source === 'automations') {
    const cfg = source === 'saas' ? SAAS : AUTOMATIONS;
    const base = cfg.tiers[tier];
    if (base == null) return null; // bilinmeyen paket
    const extTotal = ex.reduce((s, k) => s + (cfg.extras[k] || 0), 0);
    return base + extTotal;
  }

  if (source === 'projects') {
    const base = projectsBasePrice(pages);
    const lc = Math.max(1, Math.floor(Number(langCount) || 2));
    const extTotal = ex.reduce((s, k) => {
      if (k === 'multilang') return s + (lc - 1) * 100;
      return s + (PROJECTS_EXTRAS[k] || 0);
    }, 0);
    return base + extTotal;
  }

  return null; // bilinmeyen kaynak
}
