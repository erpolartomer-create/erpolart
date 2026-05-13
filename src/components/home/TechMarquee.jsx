import React from 'react';
import { technologies } from '../../data/technologies';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const MarqueeRow = ({ items, reverse = false, speed = 40 }) => {
  return (
    <div className="flex overflow-hidden relative w-full group py-4">
      {/* 
        We use two identical lists side by side. 
        CSS animation moves them left or right.
      */}
      <div 
        className={`flex whitespace-nowrap px-4 w-max shrink-0 items-center justify-around gap-8
          ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}
        `}
        style={{ '--marquee-duration': `${speed}s` }}
      >
        {items.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <div key={`first-${i}`} className="flex items-center gap-3 py-3 px-6 rounded-full bg-surface/50 border border-white/5 backdrop-blur-sm text-gray-300 hover:text-white hover:border-white/20 transition-colors">
              <Icon size={18} className="text-indigo" />
              <span className="text-sm font-medium tracking-wide">{tech.name}</span>
            </div>
          );
        })}
      </div>
      <div 
        className={`flex whitespace-nowrap px-4 w-max shrink-0 items-center justify-around gap-8
          ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}
        `}
        style={{ '--marquee-duration': `${speed}s` }}
      >
        {items.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <div key={`second-${i}`} className="flex items-center gap-3 py-3 px-6 rounded-full bg-surface/50 border border-white/5 backdrop-blur-sm text-gray-300 hover:text-white hover:border-white/20 transition-colors">
              <Icon size={18} className="text-indigo" />
              <span className="text-sm font-medium tracking-wide">{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TechMarquee = () => {
  const { t } = useTranslation();
  // Split technologies into two rows
  const mid = Math.ceil(technologies.length / 2);
  const row1 = technologies.slice(0, mid);
  const row2 = technologies.slice(mid);

  return (
    <section className="py-24 bg-deep-black relative flex flex-col items-center justify-center overflow-hidden border-y border-white/5">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-indigo/5 rounded-full blur-[100px] pointer-events-none" />

      <ScrollReveal className="mb-12 text-center w-full z-10 px-6">
        <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">{t('techMarquee.title')}</h3>
        <p className="text-gray-500 max-w-md mx-auto">{t('techMarquee.subtitle')}</p>
      </ScrollReveal>

      <div className="w-full relative z-10 flex flex-col gap-4">
        {/* Left and Right Fade masks */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-deep-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-deep-black to-transparent z-20 pointer-events-none" />
        
        <MarqueeRow items={row1} speed={60} />
        <MarqueeRow items={row2} reverse speed={75} />
      </div>
    </section>
  );
};

export default TechMarquee;
