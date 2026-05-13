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
        <title>ErpolArt - Modern işler için Modern Yazılım</title>
        <meta name="description" content="ErpolArt ile yenilikçi dijital çözümler, modern web tasarımları ve özel SaaS şablonlarına ulaşın." />
        <link rel="canonical" href="https://erpolart.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content="ErpolArt - Modern işler için Modern Yazılım" />
        <meta property="og:description" content="ErpolArt ile yenilikçi dijital çözümler, modern web tasarımları ve özel SaaS şablonlarına ulaşın." />
        <meta property="og:url" content="https://erpolart.com/" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ErpolArt - Modern işler için Modern Yazılım" />
        <meta name="twitter:description" content="ErpolArt ile yenilikçi dijital çözümler, modern web tasarımları ve özel SaaS şablonlarına ulaşın." />
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
