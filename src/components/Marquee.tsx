import { motion } from "framer-motion";

function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" />
    </svg>
  );
}

/** One calm, elegant scrolling strip. */
export default function Marquee({
  items,
  speed = 40,
  reverse = false,
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
}) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-6 md:py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#07070b] to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#07070b] to-transparent md:w-40" />
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {repeated.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex shrink-0 items-center gap-10 px-5 md:gap-14 md:px-7">
                <span
                  className={`whitespace-nowrap font-display text-3xl font-semibold tracking-tight md:text-5xl ${
                    i % 2 === 0 ? "text-white/90" : "font-serif font-normal italic text-gradient"
                  }`}
                >
                  {item}
                </span>
                <Spark className="h-5 w-5 shrink-0 text-white/25 md:h-6 md:w-6" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
