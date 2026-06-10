import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';

const BASE_URL = 'https://erpolart.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#organization`,
  name: 'ErpolArt',
  legalName: 'FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/og-image.webp`,
  description:
    'ErpolArt; tek sahibe özel SaaS web şablonları, özel yazılım geliştirme ve yapay zeka otomasyon sistemleri sunan dijital mimari atölyesidir.',
  email: 'hello@erpolart.com',
  telephone: '+90-530-944-07-01',
  priceRange: '$$',
  foundingDate: '2024',
  founder: {
    '@type': 'Person',
    name: 'Ömer Erpolat',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Pınarlı Mah. 24096 Sk. Kapı No: 19 A',
    addressLocality: 'Aksu',
    addressRegion: 'Antalya',
    addressCountry: 'TR',
  },
  areaServed: ['TR', 'EN', 'DE', 'Worldwide'],
  knowsAbout: [
    'SaaS geliştirme',
    'Web tasarım',
    'Özel yazılım',
    'Yapay zeka otomasyonu',
    'React',
    'Web mimarisi',
  ],
  // TODO: gerçek sosyal medya profilleri eklendiğinde doldur (Instagram, LinkedIn, vb.)
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@erpolart.com',
    telephone: '+90-530-944-07-01',
    availableLanguage: ['Turkish', 'English', 'German'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'ErpolArt',
  url: BASE_URL,
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: ['tr', 'en', 'de'],
};

const Layout = () => {
  const location = useLocation();
  const currentUrl = `${BASE_URL}${location.pathname}`;

  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col font-body">
      <Helmet>
        <link rel="alternate" hrefLang="tr" href={currentUrl} />
        <link rel="alternate" hrefLang="en" href={currentUrl} />
        <link rel="alternate" hrefLang="de" href={currentUrl} />
        <link rel="alternate" hrefLang="x-default" href={currentUrl} />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>
      <CustomCursor />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!location.pathname.includes('/checkout') && !location.pathname.includes('/order-success') && <Footer />}
    </div>
  );
};

export default Layout;
