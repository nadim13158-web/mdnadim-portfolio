import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { personal } from "../data/portfolioData";
import { artist } from "../data/music";
import { icons } from "./Icons";
import CopyEmailButton from "./CopyEmailButton";
import { useContactModal } from "../context/ContactModalContext";

const links = [
  { label: "About", id: "about" },
  { label: "Work", id: "projects" },
  { label: "Music", id: "music" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const contact = useContactModal();

  return (
    <footer className="relative overflow-hidden pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[36px] border border-white/[0.08] px-6 py-20 text-center sm:px-12 md:py-28">
          <div className="animate-aurora absolute -left-1/4 -top-1/2 h-[140%] w-[70%] rounded-full bg-brand/25 blur-[120px]" />
          <div className="animate-aurora-slow absolute -bottom-1/2 -right-1/4 h-[140%] w-[70%] rounded-full bg-brand2/20 blur-[120px]" />
          <div className="bg-noise absolute inset-0" />

          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Let&apos;s create something <span className="font-serif font-normal italic text-gradient">remarkable.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-10 flex justify-center"
          >
            <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
              <MagneticButton>
                <button
                  type="button"
                  onClick={contact.open}
                  data-cursor="Message"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-display text-sm font-semibold text-black transition-transform duration-300 hover:scale-105"
                >
                  {icons.mail({ className: "h-4 w-4" })}
                  Send me a message
                </button>
              </MagneticButton>
              <CopyEmailButton variant="pill" />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <button onClick={() => go("home")} data-cursor="" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient font-display text-[11px] font-bold text-white">NK</span>
            <span className="font-display text-sm font-semibold text-white">{personal.name}</span>
          </button>

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {links.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} data-cursor="" className="text-sm text-white/50 transition-colors hover:text-white">
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex gap-2">
            {personal.socials.filter((s) => s.url).map((s) => {
              const Icon = icons[s.icon];
              if (s.icon === "mail") {
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={contact.open}
                    aria-label="Send me a message"
                    data-cursor=""
                    className="flex h-9 w-9 items-center justify-center rounded-full p-2 text-white/45 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {Icon && <Icon className="h-full w-full" />}
                  </button>
                );
              }
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  data-cursor=""
                  className="flex h-9 w-9 items-center justify-center rounded-full p-2 text-white/45 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {Icon && <Icon className="h-full w-full" />}
                </a>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pb-24 pt-6 text-center text-xs leading-relaxed text-white/30 sm:pb-8">
          © {new Date().getFullYear()} {personal.name}. Crafted with React, Three.js &amp; Framer Motion.
          <br className="sm:hidden" /> Soundtrack by {artist.name} — music © the artist.
        </div>
      </div>
    </footer>
  );
}
