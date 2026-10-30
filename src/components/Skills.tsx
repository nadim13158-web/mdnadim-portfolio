import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skills, toolIcons } from "../data/portfolioData";

const groups = Array.from(new Set(skills.map((s) => s.group)));
const isLearning = (g: string) => /learning/i.test(g);

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Skills"
          title="What I use, and what"
          accent="I'm learning."
          description="No made-up percentages. I'd rather show the tools honestly and let the work speak later."
          center
        />

        {/* Tools — no fake % bars */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, gi) => (
            <motion.div
              key={g}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: gi * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${isLearning(g) ? "bg-amber-400" : "bg-emerald-400"}`}
                />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                  {g}
                </h3>
              </div>

              <ul className="mt-5 space-y-2.5">
                {skills
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <li key={s.name} className="flex items-center gap-2.5 text-[15px] text-white/75">
                      <span className="h-1 w-1 rounded-full bg-white/40" />
                      {s.name}
                    </li>
                  ))}
              </ul>

              {isLearning(g) && (
                <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-amber-200/70">
                  Still learning — I can build simple pages and I&apos;m improving every week.
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-2.5"
        >
          {toolIcons.map((t) => (
            <span
              key={t}
              data-cursor=""
              className="glass rounded-full px-5 py-2 text-xs font-medium text-white/70"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
