import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { experience, education } from "../data/portfolioData";

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Journey"
          title="Where I started"
          accent="and where I'm going."
          description="A short, honest timeline — from first designs to my first lines of code."
        />

        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {experience.map((e, i) => (
            <motion.div
              key={e.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              data-cursor=""
              className="group relative grid grid-cols-1 gap-3 py-9 md:grid-cols-12 md:gap-8"
            >
              <span className="pointer-events-none absolute inset-0 -mx-6 origin-left scale-x-0 rounded-2xl bg-white/[0.025] transition-transform duration-700 ease-out group-hover:scale-x-100" />
              <p className="relative text-sm text-white/40 md:col-span-3 md:pt-1">{e.period}</p>
              <div className="relative md:col-span-9">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-gradient md:text-2xl">
                    {e.role}
                  </h3>
                  <span className="font-serif text-lg italic text-white/50">at {e.company}</span>
                </div>
                <p className="mt-3 max-w-2xl leading-relaxed text-white/50">{e.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {education.map((ed, i) => (
            <motion.div
              key={ed.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass flex items-center gap-4 rounded-2xl p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-white">{ed.degree}</p>
                <p className="mt-0.5 text-xs text-white/45">
                  {ed.institute} · {ed.period}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
