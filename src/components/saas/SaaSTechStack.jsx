const techs = [
  'Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'OpenAI',
  'Claude AI', 'Stripe', 'AWS', 'Cloudflare', 'Tailwind CSS', 'Prisma',
  'Redis', 'Resend', 'Node.js', 'Docker', 'Vercel', 'GitHub Actions',
  'GraphQL', 'REST API', 'Webhooks', 'Auth.js', 'Zod', 'Framer Motion',
  'shadcn/ui', 'tRPC',
];

const Row = ({ items, reverse }) => (
  <div className="w-full flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
    <div
      className="flex gap-3 shrink-0"
      style={{
        animation: `marquee${reverse ? 'Rev' : ''} 30s linear infinite`,
        willChange: 'transform',
      }}
    >
      {[...items, ...items].map((name, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/8 shrink-0 group hover:border-white/20 transition-colors duration-300"
        >
          <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0 group-hover:bg-gray-400 transition-colors duration-300" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
            {name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SaaSTechStack = () => {
  const half = Math.ceil(techs.length / 2);
  const row1 = techs.slice(0, half);
  const row2 = techs.slice(half);

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>

      <div className="flex flex-col gap-3">
        <Row items={row1} reverse={false} />
        <Row items={row2} reverse={true} />
      </div>
    </section>
  );
};

export default SaaSTechStack;
