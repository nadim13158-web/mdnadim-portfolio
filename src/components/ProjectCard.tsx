import { motion } from "framer-motion";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  live: string;
  code: string;
  year: string;
}

/** Hand-built design mockups so every card looks like a real piece of work. */
function DesignCover({ variant, title }: { variant: number; title: string }) {
  const v = variant % 6;
  const bg = (deg = 135) =>
    `linear-gradient(${deg}deg, color-mix(in srgb, var(--a) 78%, #0b0b12), #0b0b12 48%, color-mix(in srgb, var(--b) 62%, #0b0b12))`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg(v === 3 ? 160 : 135) }}>
      <div className="bg-noise absolute inset-0" />
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.5) .7px, transparent .8px)", backgroundSize: "22px 22px" }}
      />

      {v === 0 && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 pt-14">
          <div className="flex justify-end text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">
            <span>2025</span>
          </div>
          <p className="font-display text-[4.2rem] font-bold leading-[0.82] tracking-[-0.05em] text-white/95 sm:text-[5rem]">
            NEB<br />ULA
          </p>
          <div className="flex items-end justify-between">
            <div className="flex gap-1.5">
              {["#f7e7c6", "#ff8a5b", "#f43f5e", "#2a1420"].map((c) => (
                <span key={c} className="h-5 w-5 rounded-full border border-white/25" style={{ background: c }} />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">Issue 01</span>
          </div>
          <div className="pointer-events-none absolute -right-10 top-8 h-52 w-52 rounded-full border border-white/25" />
          <div className="pointer-events-none absolute -right-2 top-16 h-40 w-40 rounded-full border border-white/15" />
        </div>
      )}

      {v === 1 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm">
            <span className="font-serif text-4xl italic text-white">A</span>
          </div>
          <p className="font-serif text-3xl italic text-white">Aurora</p>
          <p className="text-[9px] uppercase tracking-[0.45em] text-white/70">Coffee · since 2025</p>
          <div className="mt-2 flex gap-2">
            {["#f3e3cf", "#c98a5b", "#5a3624", "#1b120d"].map((c) => (
              <span key={c} className="h-7 w-7 rounded-lg border border-white/25" style={{ background: c }} />
            ))}
          </div>
        </div>
      )}

      {v === 2 && (
        <div className="absolute inset-0 p-5">
          <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
            {[
              { t: "Train", s: "5 min" },
              { t: "Fuel", s: "Protein" },
              { t: "Pulse", s: "Daily" },
              { t: "Streak", s: "12 days" },
              { t: "Goals", s: "Set" },
              { t: "Join", s: "Today" },
            ].map((cell, i) => (
              <div key={cell.t} className="flex flex-col justify-between rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-sm">
                <span className="text-[9px] uppercase tracking-[0.15em] text-white/60">0{i + 1}</span>
                <span className="font-display text-sm font-semibold leading-tight text-white">{cell.t}</span>
                <span className="text-[10px] text-white/60">{cell.s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {v === 3 && (
        <div className="absolute inset-0 p-6">
          <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" fill="none" stroke="rgba(255,255,255,0.3)">
            {[70, 110, 150, 195, 245].map((r) => (
              <circle key={r} cx="300" cy="150" r={r} />
            ))}
            <path d="M0 150h400M300 0v300" strokeOpacity=".5" />
          </svg>
          <div className="relative flex h-full flex-col justify-between">
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/70">Live · Dhaka</span>
            <div>
              <p className="font-display text-5xl font-bold leading-[0.85] tracking-[-0.04em] text-white sm:text-6xl">ORBIT</p>
              <p className="mt-2 font-serif text-xl italic text-white/85">a night of sound</p>
            </div>
            <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
              <span>12 · 09 · 25</span>
              <span>8 pm</span>
            </div>
          </div>
        </div>
      )}

      {v === 4 && (
        <div className="absolute inset-0 flex items-center justify-center gap-4 p-8">
          {[0, 1].map((n) => (
            <div
              key={n}
              className={`${n === 0 ? "h-[85%] w-[42%]" : "h-[68%] w-[34%] translate-y-4"} overflow-hidden rounded-[22px] border border-white/25 bg-black/25 p-3 backdrop-blur-sm`}
            >
              <div className="mx-auto h-1 w-8 rounded-full bg-white/30" />
              <div className="mt-3 flex items-center justify-between">
                <span className="h-5 w-5 rounded-full bg-white/30" />
                <span className="h-1.5 w-8 rounded-full bg-white/20" />
              </div>
              <div className="mt-3 h-14 rounded-xl bg-white/15" />
              <div className="mt-2 h-2 w-3/4 rounded-full bg-white/30" />
              <div className="mt-1.5 h-2 w-1/2 rounded-full bg-white/15" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg bg-white/15" />
                <div className="h-9 rounded-lg bg-white/10" />
              </div>
              <div className="mt-2 h-7 rounded-lg bg-white/80" />
            </div>
          ))}
        </div>
      )}

      {v === 5 && (
        <div className="absolute inset-x-6 bottom-0 top-7 overflow-hidden rounded-t-2xl border border-white/25 bg-black/25 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 border-b border-white/15 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="mx-auto rounded-full bg-white/10 px-4 py-0.5 text-[8px] text-white/50">nadim.design</span>
          </div>
          <div className="grid grid-cols-5 gap-3 p-4">
            <div className="col-span-3 space-y-2">
              <div className="h-2 w-16 rounded-full bg-white/40" />
              <div className="h-5 w-4/5 rounded-md bg-white/70" />
              <div className="h-5 w-3/5 rounded-md bg-white/40" />
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/15" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/15" />
              <div className="mt-3 h-6 w-24 rounded-full bg-white/85" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div className="aspect-square rounded-lg bg-white/20" />
              <div className="aspect-square rounded-lg bg-white/10" />
              <div className="aspect-square rounded-lg bg-white/10" />
              <div className="aspect-square rounded-lg bg-white/20" />
            </div>
          </div>
        </div>
      )}

      <span className="absolute left-5 top-4 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
        {title}
      </span>
    </div>
  );
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.live}
      initial={{ opacity: 0, x: 160, rotate: 2 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 1, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="View"
      className="group block"
    >
      <div className="card-glow relative aspect-[16/11] overflow-hidden rounded-3xl border border-white/[0.08]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.035]">
          <DesignCover variant={index} title={project.tags[0]} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl">{project.title}</h3>
            <span className="text-sm text-white/30">{project.year}</span>
          </div>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/50">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/60">{t}</span>
            ))}
          </div>
        </div>
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-transparent group-hover:bg-brand-gradient">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </motion.a>
  );
}
