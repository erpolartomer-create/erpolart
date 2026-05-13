const techs = [
  { name: 'n8n', color: 'text-emerald-400' },
  { name: 'Make.com', color: 'text-violet' },
  { name: 'OpenAI', color: 'text-white' },
  { name: 'Claude AI', color: 'text-amber-400' },
  { name: 'LangChain', color: 'text-emerald-300' },
  { name: 'Pinecone', color: 'text-cyan' },
  { name: 'Python', color: 'text-sky-400' },
  { name: 'FastAPI', color: 'text-teal-400' },
  { name: 'Zapier', color: 'text-orange-400' },
  { name: 'Node.js', color: 'text-emerald-300' },
  { name: 'Webhooks', color: 'text-violet' },
  { name: 'GPT-4', color: 'text-white' },
  { name: 'Hugging Face', color: 'text-amber-300' },
  { name: 'Supabase', color: 'text-emerald-400' },
  { name: 'Redis', color: 'text-rose-400' },
  { name: 'PostgreSQL', color: 'text-sky-400' },
  { name: 'Docker', color: 'text-cyan' },
  { name: 'Vercel', color: 'text-white' },
  { name: 'Anthropic', color: 'text-amber-400' },
  { name: 'REST API', color: 'text-teal-300' },
  { name: 'Vector DB', color: 'text-violet' },
  { name: 'CrewAI', color: 'text-emerald-300' },
];

const Row = ({ items, reverse }) => (
  <div className="w-full flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
    <div
      className="flex gap-4 shrink-0"
      style={{
        animation: `marquee${reverse ? 'Rev' : ''} 30s linear infinite`,
        willChange: 'transform',
      }}
    >
      {[...items, ...items].map((tech, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/40 border border-white/6 backdrop-blur-sm shrink-0 group hover:border-white/20 transition-colors duration-300"
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${tech.color} shrink-0`} />
          <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${tech.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AutomationsTechStack = () => {
  const half = Math.ceil(techs.length / 2);
  const row1 = techs.slice(0, half);
  const row2 = techs.slice(half);

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent pointer-events-none" />
      <div className="flex flex-col gap-3">
        <Row items={row1} reverse={false} />
        <Row items={row2} reverse={true} />
      </div>
    </section>
  );
};

export default AutomationsTechStack;
