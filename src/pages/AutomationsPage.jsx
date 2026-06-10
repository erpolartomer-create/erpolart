import { Helmet } from 'react-helmet-async';
import AutomationsHero from '../components/automations/AutomationsHero';
import AutomationsFeatures from '../components/automations/AutomationsFeatures';
import AutomationsShowcase from '../components/automations/AutomationsShowcase';
import AutomationsPricing from '../components/automations/AutomationsPricing';
import AutomationsFAQ from '../components/automations/AutomationsFAQ';

const AutomationsPage = () => {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-deep-black relative" style={{ overflowX: 'clip' }}>
      <Helmet>
        <title>AI Otomasyonları | Yapay Zeka İş Akışı Sistemleri - ErpolArt</title>
        <meta name="description" content="Otonom AI ajanları ve akıllı iş akışı otomasyonları ile işletmenizi 7/24 güçlendirin." />
        <link rel="canonical" href="https://erpolart.com/ai-automations" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content="AI Otomasyonları | Yapay Zeka İş Akışı Sistemleri - ErpolArt" />
        <meta property="og:description" content="Otonom AI ajanları ve akıllı iş akışı otomasyonları ile işletmenizi 7/24 güçlendirin." />
        <meta property="og:url" content="https://erpolart.com/ai-automations" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Otomasyonları | Yapay Zeka İş Akışı Sistemleri - ErpolArt" />
        <meta name="twitter:description" content="Otonom AI ajanları ve akıllı iş akışı otomasyonları ile işletmenizi 7/24 güçlendirin." />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'AI Automation Development',
          provider: { '@type': 'Organization', name: 'ErpolArt', url: 'https://erpolart.com' },
          description: 'Autonomous AI agents, smart workflow automations, and intelligent data pipelines. We build the digital brain that powers your enterprise 24/7.',
          url: 'https://erpolart.com/ai-automations',
          areaServed: 'Worldwide',
          serviceType: 'AI Automation & Intelligent Workflow Development',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'What exactly is AI automation?', acceptedAnswer: { '@type': 'Answer', text: 'AI automation uses artificial intelligence to execute tasks that previously required human effort: from answering customer queries, to processing documents and syncing data across systems.' } },
            { '@type': 'Question', name: 'How long does an automation project take?', acceptedAnswer: { '@type': 'Answer', text: 'Simple automations are delivered in 1-2 weeks. Full automation stacks take 2-4 weeks, and enterprise-scale agent systems take 1-2 months.' } },
            { '@type': 'Question', name: 'Do I need technical knowledge to use the automations?', acceptedAnswer: { '@type': 'Answer', text: 'No. We design automations that run entirely in the background. You interact through dashboards, reports, or your existing tools. No code, no configuration on your end.' } },
            { '@type': 'Question', name: 'Which platforms and tools can you integrate?', acceptedAnswer: { '@type': 'Answer', text: 'We integrate with virtually any platform with an API: CRMs, communication tools (WhatsApp, Slack, email), payment systems (Stripe), ERPs, and custom databases.' } },
            { '@type': 'Question', name: 'How is pricing structured?', acceptedAnswer: { '@type': 'Answer', text: 'Every project is scoped individually. After understanding your workflows and goals, we send a fixed-price proposal with no surprises.' } },
            { '@type': 'Question', name: 'What happens after the automation goes live?', acceptedAnswer: { '@type': 'Answer', text: 'Launch support is always included. We monitor the system, fix issues, and provide documentation. Retainer plans available for ongoing improvements.' } },
          ],
        })}</script>
      </Helmet>

      {/* Decorative backgrounds — isolated overflow so sticky children work */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] bg-teal-500/8 blur-[100px] rounded-full animate-float-slow" />
        <div className="absolute bottom-[10%] -right-[5%] w-[35%] h-[35%] bg-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <AutomationsHero />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <AutomationsPricing />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <AutomationsFeatures />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <AutomationsShowcase />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <AutomationsFAQ />
      </div>
    </div>
  );
};

export default AutomationsPage;
