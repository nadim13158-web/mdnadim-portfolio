import { useState, type MouseEvent, type ReactElement } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { services } from "../data/portfolioData";

const ic = "h-6 w-6";
const icons: Record<string, ReactElement> = {
  design: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={ic}>
      <path d="M12 19l7-7a4.95 4.95 0 10-7-7l-7 7v7h7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={ic}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
    </svg>
  ),
  social: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={ic}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={ic}>
      <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 90, rotate: 1 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: -500, y: -500 })}
      data-cursor=""
      className="card-glow glass group relative h-full overflow-hidden rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-8"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, color-mix(in srgb, var(--a) 13%, transparent), transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-white transition-all duration-500 group-hover:bg-brand-gradient">
            {icons[service.icon]}
          </span>
          <span className="font-display text-sm text-white/25">0{index + 1}</span>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl font-semibold tracking-tight text-white">{service.title}</h3>
          {service.icon === "code" && (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-200">
              Learning
            </span>
          )}
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-white/50">{service.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {service.points.map((p) => (
            <span key={p} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{p}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="What I do"
          title="Design services that make you"
          accent="look the part."
          description="Branding, posters and social content with a clean, consistent look — plus front-end work as I grow."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
