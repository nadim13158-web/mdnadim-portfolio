import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const manifesto =
  "Good software isn't built by typing faster — it's built by thinking clearer. Every pixel should earn its place, every motion should carry meaning, and every line of code should be something I'm proud of years from now.";
const keywords = ["thinking", "clearer.", "meaning,", "proud"];

const principles = [
  { no: "I", title: "Clarity over cleverness", text: "The simplest solution that works beautifully is almost always the right one." },
  { no: "II", title: "Motion with meaning", text: "Animation should guide attention and explain change — never just decorate." },
  { no: "III", title: "Craft is a habit", text: "Excellence lives in small details. That's where trust is quietly built." },
  { no: "IV", title: "People first", text: "Design for the human on the other side — their time, patience and joy." },
];

function Word({ w, i, total, p }: { w: string; i: number; total: number; p: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(p, [start, start + 1.5 / total], [0.15, 1]);
  const hl = keywords.includes(w.toLowerCase());
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${hl ? "font-serif italic text-gradient" : ""}`}>
      {w}
    </motion.span>
  );
}

export default function Philosophy() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = manifesto.split(" ");

  return (
    <section id="philosophy" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/70"
        >
          <span className="bg-brand-gradient h-1.5 w-1.5 rounded-full" />
          Philosophy
        </motion.span>

        <p
          ref={ref}
          className="mt-8 font-display text-[1.75rem] font-medium leading-[1.3] tracking-tight text-white sm:text-4xl md:text-[3.1rem]"
        >
          {words.map((w, i) => (
            <Word key={`${w}-${i}`} w={w} i={i} total={words.length} p={scrollYProgress} />
          ))}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4"
        >
          {principles.map((pr) => (
            <div
              key={pr.no}
              data-cursor=""
              className="group bg-[#0a0a10] p-7 transition-colors duration-500 hover:bg-[#0f0f17] md:p-8"
            >
              <span className="font-serif text-4xl italic text-white/25 transition-colors duration-500 group-hover:text-gradient">
                {pr.no}
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold text-white">{pr.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/50">{pr.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
