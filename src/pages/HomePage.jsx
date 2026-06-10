import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import LatestReleases from '../components/home/LatestReleases';
import TechMarquee from '../components/home/TechMarquee';
import AboutTeaser from '../components/home/AboutTeaser';

const HomePage = () => {
  return (
    <div className="w-full flex flex-col">
      <Helmet>
        <title>ErpolArt | Özel Web Tasarım, SaaS Şablonları & AI Otomasyonu</title>
        <meta name="description" content="Tek sahibe özel SaaS web şablonları, özel yazılım geliştirme ve AI otomasyon sistemleri. Markanıza özel yüksek performanslı dijital çözümler için ErpolArt." />
        <link rel="canonical" href="https://erpolart.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content="ErpolArt | Özel Web Tasarım, SaaS Şablonları & AI Otomasyonu" />
        <meta property="og:description" content="Tek sahibe özel SaaS web şablonları, özel yazılım geliştirme ve AI otomasyon sistemleri. Markanıza özel yüksek performanslı dijital çözümler için ErpolArt." />
        <meta property="og:url" content="https://erpolart.com/" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ErpolArt | Özel Web Tasarım, SaaS Şablonları & AI Otomasyonu" />
        <meta name="twitter:description" content="Tek sahibe özel SaaS web şablonları, özel yazılım geliştirme ve AI otomasyon sistemleri. Markanıza özel yüksek performanslı dijital çözümler için ErpolArt." />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
      </Helmet>
      <HeroSection />
      <HowItWorks />
      <LatestReleases />
      <TechMarquee />
      <AboutTeaser />
    </div>
  );
};

export default HomePage;
