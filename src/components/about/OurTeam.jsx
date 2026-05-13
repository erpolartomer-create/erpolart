import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileCard from './ProfileCard';
import ScrollReveal from '../ScrollReveal';
import omerImg from '../../assets/team/omer-erpolat.webp';
import member1Img from '../../assets/team/member-1.webp';
import member2Img from '../../assets/team/member-2.webp';
import member3Img from '../../assets/team/member-3.webp';
import member4Img from '../../assets/team/member-4.webp';

/**
 * Generates a clean '</>' code icon SVG data URI for the holographic mask.
 */
const generateCodeSVG = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
      <rect width="100%" height="100%" fill="black"/>
      <g transform="rotate(45 12 12)">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="white"/>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

/**
 * Generates a noise texture data URI for the holographic shimmer.
 */
const generateNoiseSVG = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" opacity="0.4"/>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

const OurTeam = () => {
  const { t } = useTranslation();

  const codeIcon = useMemo(() => generateCodeSVG(), []);
  const noiseIcon = useMemo(() => generateNoiseSVG(), []);

  const teamMembers = [
    {
      id: 0,
      name: 'Omer Erpolat',
      title: 'Kurucu',
      handle: 'omererpolat',
      status: t('aboutPage.team.memberStatus.coding'),
      avatarUrl: omerImg,
      glow: 'rgba(59, 88, 255, 0.4)' // Indigo
    },
    {
      id: 1,
      name: 'Leo Carter',
      title: 'Lead Architect',
      handle: 'leocodes',
      status: t('aboutPage.team.memberStatus.coding'),
      avatarUrl: member1Img,
      glow: 'rgba(92, 115, 255, 0.4)' // Sapphire
    },
    {
      id: 2,
      name: 'Mia Rose',
      title: 'UI Visionary',
      handle: 'miadesigns',
      status: t('aboutPage.team.memberStatus.thinking'),
      avatarUrl: member2Img,
      glow: 'rgba(255, 43, 109, 0.4)' // Neon Rose
    },
    {
      id: 3,
      name: 'Noah Matrix',
      title: 'Animation Guru',
      handle: 'noahmatrix',
      status: t('aboutPage.team.memberStatus.root'),
      avatarUrl: member3Img,
      glow: 'rgba(0, 230, 210, 0.4)' // Cyan
    },
    {
      id: 4,
      name: 'Zoe Andersson',
      title: 'Fullstack Hacker',
      handle: 'zoeanimate',
      status: t('aboutPage.team.memberStatus.animation'),
      avatarUrl: member4Img,
      glow: 'rgba(167, 139, 250, 0.4)' // Violet
    }
  ];

  const founder = teamMembers[0];
  const otherMembers = teamMembers.slice(1);

  return (
    <section className="py-32 relative group/team">
      {/* Dynamic Background - Refined for Layering */}
      <div className="absolute top-0 right-1/4 w-[60vw] h-[60vw] bg-indigo/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-violet/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <ScrollReveal>
          <div className="max-w-3xl mb-24 text-center mx-auto">
            <h2 className="text-4xl md:text-[72px] font-display font-black text-white mb-6 tracking-tighter">
              {t('aboutPage.team.titlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo via-violet to-cyan">{t('aboutPage.team.titlePart2')}</span>
            </h2>
            <p className="text-xl text-muted-text font-light leading-relaxed">
              {t('aboutPage.team.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Founder Section - Centered at the top */}
        <div className="flex justify-center mb-24 lg:mb-40">
          <ScrollReveal direction="up" className="w-full max-w-[340px]">
            <ProfileCard
              name={founder.name}
              title={founder.title}
              handle={founder.handle}
              status={founder.status}
              avatarUrl={founder.avatarUrl}
              iconUrl={codeIcon}
              grainUrl={noiseIcon}
              contactText={t('aboutPage.team.connect')}
              behindGlowColor={founder.glow}
              behindGlowSize="50%"
              className="w-full"
              innerGradient="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)"
              showUserInfo={true}
            />
          </ScrollReveal>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24 items-stretch">
          {otherMembers.map((member, idx) => (
            <ScrollReveal key={member.id} delay={idx * 0.08} direction="up" className="flex justify-center w-full">
              <ProfileCard
                name={member.name}
                title={member.title}
                handle={member.handle}
                status={member.status}
                avatarUrl={member.avatarUrl}
                iconUrl={codeIcon}
                grainUrl={noiseIcon}
                contactText={t('aboutPage.team.connect')}
                behindGlowColor={member.glow}
                behindGlowSize="50%"
                className="w-full h-full"
                innerGradient="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)"
                showUserInfo={true}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
