import { Helmet } from 'react-helmet-async';
import SaaSHero from '../components/saas/SaaSHero';
import SaaSFeatures from '../components/saas/SaaSFeatures';
import SaaSShowcase from '../components/saas/SaaSShowcase';
import SaaSTechStack from '../components/saas/SaaSTechStack';
import SaaSPricing from '../components/saas/SaaSPricing';
import SaaSFAQ from '../components/saas/SaaSFAQ';

const SaaSPage = () => {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-deep-black relative" style={{ overflowX: 'clip' }}>
      <Helmet>
        <title>SaaS Çözümleri - ErpolArt</title>
        <meta name="description" content="İşletmeniz için ölçeklenebilir, güvenli ve modern SaaS çözümleri." />
        <link rel="canonical" href="https://erpolart.com/saas" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content="SaaS Çözümleri - ErpolArt" />
        <meta property="og:description" content="İşletmeniz için ölçeklenebilir, güvenli ve modern SaaS çözümleri." />
        <meta property="og:url" content="https://erpolart.com/saas" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SaaS Çözümleri - ErpolArt" />
        <meta name="twitter:description" content="İşletmeniz için ölçeklenebilir, güvenli ve modern SaaS çözümleri." />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'SaaS Development',
          provider: { '@type': 'Organization', name: 'ErpolArt', url: 'https://erpolart.com' },
          description: 'Scalable, secure, and modern SaaS solutions for your business. Built with React, Node.js, and Supabase.',
          url: 'https://erpolart.com/saas',
          areaServed: 'Worldwide',
          serviceType: 'Software as a Service Development',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'How long does a SaaS project take?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on scope. MVP projects are delivered in 1-2 weeks, growth-stage platforms in 2-4 weeks, and complex enterprise systems in 1-2 months.' } },
            { '@type': 'Question', name: 'Do we own the source code?', acceptedAnswer: { '@type': 'Answer', text: '100% yes. After delivery, all source code, the database, and the infrastructure belong to you. No lock-in, ever.' } },
            { '@type': 'Question', name: 'Can we add features later?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. We build with scalability in mind. New modules can be added at any time, either through a retainer plan or as a separate project.' } },
            { '@type': 'Question', name: 'How does pricing work?', acceptedAnswer: { '@type': 'Answer', text: 'Every project is unique, so we don\'t publish fixed prices. We assess the scope, timeline, and technical requirements, then send a fixed-price proposal. No surprises.' } },
            { '@type': 'Question', name: 'Is post-launch support included?', acceptedAnswer: { '@type': 'Answer', text: 'Launch support is always included. For ongoing maintenance, we offer monthly retainer plans with priority response times.' } },
            { '@type': 'Question', name: 'How do we communicate during the project?', acceptedAnswer: { '@type': 'Answer', text: 'Via WhatsApp or our website contact form for instant messaging, weekly progress reports, and video calls when needed. Full transparency throughout.' } },
          ],
        })}</script>
      </Helmet>
      
      {/* Decorative backgrounds — isolated overflow so sticky children work */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-cyan/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] bg-violet/10 blur-[100px] rounded-full animate-float-slow" />
        <div className="absolute bottom-[10%] -right-[5%] w-[35%] h-[35%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <SaaSHero />

      <SaaSTechStack />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <SaaSPricing />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <SaaSFeatures id="saas-features" />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <SaaSShowcase />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <SaaSFAQ />
      </div>
    </div>
  );
};

export default SaaSPage;
