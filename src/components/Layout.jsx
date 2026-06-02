import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';

const BASE_URL = 'https://erpolart.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ErpolArt',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['Turkish', 'English', 'German'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ErpolArt',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/?s={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
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
