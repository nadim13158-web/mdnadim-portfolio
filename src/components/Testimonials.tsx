import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { testimonials } from "../data/portfolioData";
import { useContactModal } from "../context/ContactModalContext";

export default function Testimonials() {
  const contact = useContactModal();
  const [i, setI] = useState(0);
  const hasItems = testimonials.length > 0;

  useEffect(() => {
    if (!hasItems) return;
    const id = setInterval(() => setI((x) => (x + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [hasItems]);

  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Reviews"
          title="What people say about"
          accent="working with me."
          description="Real words from real people I've worked with."
          center
        />

        {!hasItems ? (
          /* Fake review na rakhe — jokhon asole client hobe tokhon ekhane dekhabe */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass rounded-3xl px-6 py-16 text-center"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1121 12z" />
                <path d="M8.5 11h7M8.5 14h4.5" />
              </svg>
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold text-white">
              No reviews yet — and that&apos;s the truth
            </h3>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-white/50">
              I&apos;d rather show an empty space than invent quotes from people who don&apos;t exist.
              When my first clients come in, their real words will go here.
            </p>
            <button
              type="button"
              data-cursor="Message"
              onClick={contact.open}
              className="btn-primary btn-shine mt-8 inline-flex rounded-full px-6 py-3 font-display text-sm font-semibold"
            >
              Be my first client
            </button>
          </motion.div>
        ) : (
          <div className="glass rounded-3xl p-8 text-center sm:p-12">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-lg font-light leading-relaxed text-slate-200 sm:text-2xl">
                  &ldquo;{testimonials[i].quote}&rdquo;
                </p>
                <footer className="mt-8">
                  <p className="font-display font-bold text-white">{testimonials[i].name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{testimonials[i].role}</p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  data-cursor=""
                  aria-label={`Review ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === i ? "w-8 bg-white" : "w-2 bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
