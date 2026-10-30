import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-14 md:mb-16 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/70"
      >
        <span className="bg-brand-gradient h-1.5 w-1.5 rounded-full" />
        {eyebrow}
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[3.25rem]"
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className="font-serif text-[1.12em] font-normal italic text-gradient">{accent}</span>
          </>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className={`mt-5 text-base leading-relaxed text-white/55 md:text-lg ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
