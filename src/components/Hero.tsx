import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import HeroScene from "./three/HeroScene";
import MagneticButton from "./MagneticButton";
import Equalizer from "./Equalizer";
import ProfilePhoto from "./ProfilePhoto";
import { useProfilePhoto } from "../hooks/useProfilePhoto";
import { useContactModal } from "../context/ContactModalContext";
import { useAssistant } from "../context/AssistantContext";
import RobotIcon from "./assistant/RobotIcon";
import { personal } from "../data/portfolioData";
import { artist, cover } from "../data/music";
import { useMusic } from "../context/MusicContext";

const START = 1.7; // after the loader

const words: Variants = {
  hidden: { y: "115%", opacity: 0, filter: "blur(12px)" },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.05, delay: START + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: START + d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ROTATING = [
  "visuals that stop the scroll",
  "brands people remember",
  "clean social media designs",
  "and now — websites",
];


function CircleBadge({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 120 120" className="animate-spin-slow h-full w-full">
        <defs>
          <path id="badge-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
        </defs>
        <text fill="rgba(255,255,255,0.6)" fontSize="8.4" letterSpacing="2.4" fontFamily="Sora, sans-serif" fontWeight="600">
          <textPath href="#badge-circle">GRAPHIC DESIGNER · FRONT-END LEARNER · </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-3xl italic text-gradient">NK</span>
      </span>
    </div>
  );
}

function NowPlayingChip() {
  const { track, playing, toggle } = useMusic();
  const [ok, setOk] = useState(true);
  return (
    <button
      onClick={toggle}
      data-cursor={playing ? "Pause" : "Play"}
      className="glass-strong flex items-center gap-3 rounded-2xl p-2.5 pr-4 text-left shadow-2xl shadow-black/50"
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-brand-gradient">
        {ok && <img src={cover(track.id, "mq")} alt="" onError={() => setOk(false)} className="h-full w-full object-cover" />}
        <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
          )}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
          {playing ? "Now playing" : "My soundtrack"}
        </span>
        <span className="block max-w-[140px] truncate font-display text-sm font-semibold text-white">{track.title}</span>
        <span className="block text-xs text-white/50">{artist.name}</span>
      </span>
      <Equalizer playing={playing} count={4} className="ml-1 h-4" barClass="bg-brand-gradient" />
    </button>
  );
}

/** Passport-size photo framed like a premium ID card, with a moving gradient light on the border. */
function PassportCard() {
  return (
    <div className="group relative" data-cursor="Hello!">
      {/* soft brand glow behind the card */}
      <div className="pointer-events-none absolute -inset-10 rounded-[64px] bg-brand-gradient opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-40" />

      {/* faint base border + travelling light */}
      <div className="relative overflow-hidden rounded-[30px] bg-white/10 p-[1.5px] shadow-2xl shadow-black/60">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 aspect-square w-[230%] -translate-x-1/2 -translate-y-1/2 animate-[spin-slow_7s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, var(--a) 70deg, var(--b) 140deg, transparent 210deg, transparent 360deg)",
          }}
        />
        <div className="relative overflow-hidden rounded-[28.5px] bg-[#0b0b12]">
          <ProfilePhoto crop="passport" priority className="w-[256px] xl:w-[276px]" />
          {/* gentle vignette so the photo sits naturally in the dark theme */}
          <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[7/9] bg-[radial-gradient(ellipse_at_50%_38%,transparent_58%,rgba(6,6,11,0.38)_100%)]" />

          {/* ID-style caption */}
          <div className="relative flex items-center gap-3 border-t border-white/10 px-4 py-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
                {personal.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-white/50">Graphic Designer · Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Huge outlined name strip that glides across the bottom of the hero. */
function NameTicker() {
  const items = ["Md Nadim Khondokar", "Graphic Designer", "Front-end Learner"];
  return (
    <div className="name-ticker pointer-events-none absolute inset-x-0 bottom-0 z-[6] overflow-hidden">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 38, ease: "linear" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {[...items, ...items].map((t, i) => (
              <span key={`${copy}-${i}`} className="flex shrink-0 items-center gap-7 px-5 py-3 md:gap-10 md:px-6">
                <span
                  className={`whitespace-nowrap font-display text-2xl font-semibold tracking-tight md:text-4xl ${
                    i % items.length === 0 ? "text-white/80" : "name-ticker-text"
                  }`}
                >
                  {t}
                </span>
                <span className="text-gradient text-lg md:text-xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const [word, setWord] = useState(0);
  const contact = useContactModal();
  const assistant = useAssistant();
  const photo = useProfilePhoto();

  // The photo may be found a moment after the hero mounts (when it's a file in the
  // dist folder). Keep its entrance on the same timeline as the rest of the hero.
  const heroAt = useRef(performance.now() / 1000);
  const photoAt = useRef<number | null>(null);
  if (photo && photoAt.current === null) photoAt.current = performance.now() / 1000;
  const late = photoAt.current === null ? 0 : photoAt.current - heroAt.current;
  const pd = (d: number) => Math.max(0.15, START + d - late);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % ROTATING.length), 3000);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.background = `radial-gradient(650px circle at ${e.clientX - r.left}px ${
      e.clientY - r.top
    }px, color-mix(in srgb, var(--a) 9%, transparent), transparent 70%)`;
  };

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pb-24 pt-28 sm:pb-20"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: START - 0.5, ease: "easeOut" }}
      >
        <HeroScene />
      </motion.div>

      {/* readability veils */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_45%,rgba(6,6,11,0.9)_0%,rgba(6,6,11,0.55)_38%,transparent_68%)] max-lg:bg-[linear-gradient(to_bottom,rgba(6,6,11,0.72),rgba(6,6,11,0.35)_45%,rgba(6,6,11,0.9))]" />
      <div ref={spotRef} className="pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-16 h-32 bg-gradient-to-t from-[#06060b] to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center px-6 pt-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <motion.div variants={fade} custom={0} initial="hidden" animate="show" className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-xs font-medium text-white/75">
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {personal.availability} · Bangladesh
          </motion.div>

          <motion.div variants={fade} custom={0.1} initial="hidden" animate="show" className="mt-8 flex items-end gap-4">
            {photo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative shrink-0 lg:hidden"
                data-cursor="Hello!"
              >
                <div className="rounded-[20px] bg-gradient-to-br from-brand via-white/25 to-brand2 p-[1.5px] shadow-xl shadow-black/50">
                  <ProfilePhoto crop="passport" priority className="w-[76px] rounded-[18.5px] sm:w-[92px] md:w-[104px]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#06060b] bg-emerald-400" />
              </motion.div>
            )}
            <p className="font-serif text-2xl italic text-white/60 md:text-3xl">Hello, I&apos;m</p>
          </motion.div>

          <h1 className="mt-1 font-display text-[clamp(2.9rem,8vw,6.6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white">
            {["Md", "Nadim"].map((w, i) => (
              <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span variants={words} custom={i} initial="hidden" animate="show" className="inline-block">
                  {w}
                </motion.span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span variants={words} custom={2} initial="hidden" animate="show" className="text-gradient-anim inline-block pr-2">
                Khondokar
              </motion.span>
            </span>
          </h1>

          <motion.div variants={fade} custom={0.55} initial="hidden" animate="show" className="mt-6 font-display text-lg font-light text-white/75 md:text-2xl">
            I design{" "}
            <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={word}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="whitespace-nowrap font-serif text-[1.18em] italic text-gradient"
                >
                  {ROTATING[word]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.p variants={fade} custom={0.7} initial="hidden" animate="show" className="mt-5 max-w-lg text-base leading-relaxed text-white/50 md:text-lg">
            {personal.tagline}
          </motion.p>

          <motion.div variants={fade} custom={0.85} initial="hidden" animate="show" className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <MagneticButton>
              <button onClick={() => go("projects")} data-cursor="View" className="btn-primary btn-shine group inline-flex items-center gap-2.5 rounded-full px-7 py-4 font-display text-sm font-semibold">
                See my designs
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-[-45deg]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </MagneticButton>
            <MagneticButton>
              <button type="button" onClick={contact.open} data-cursor="Message" className="glass inline-flex items-center gap-2 rounded-full px-7 py-4 font-display text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10">
                Let&apos;s talk
              </button>
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={fade}
            custom={1}
            initial="hidden"
            animate="show"
            className="glass mt-12 max-w-lg rounded-2xl p-5"
          >
            {/* Honest beginner badge — not a fake "500 happy clients" counter */}
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 21v-8" />
                  <path d="M12 13c0-4 3-6.5 7.5-6.5C19.5 11 17 13 12 13z" />
                  <path d="M12 15.5C12 12.5 9.8 10.5 6 10.5c0 3.4 2.2 5 6 5z" />
                </svg>
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-white">
                  At the start of my journey
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                  Self-taught designer, learning front-end. No inflated numbers here — just real
                  progress, one project at a time.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
              {["Design", "Learning React", "Available"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* right column — passport photo (falls back to the old layout until a photo is added) */}
        {/* Different keys: when the photo is found a moment after load, React must build the
            photo column fresh instead of reusing the fallback's half-finished animations
            (that bug left the card stuck at 80% size and soft). */}
        {photo ? (
          <div key="hero-photo" className="relative hidden self-stretch lg:col-span-5 lg:flex lg:items-center lg:justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pd(0.9), duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center gap-8"
            >
              <div className="relative">
                <PassportCard />
                {/* rotating sticker on the corner (sits over the background, never the face) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: pd(1.6), duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-12 -top-12 rounded-full bg-[#0b0b12]/70 shadow-xl shadow-black/40 backdrop-blur-md"
                >
                  <CircleBadge className="h-24 w-24" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pd(1.9), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="translate-x-10"
              >
                <div className="animate-float-soft-delay">
                  <NowPlayingChip />
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
        <div key="hero-fallback" className="relative hidden self-stretch lg:col-span-5 lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: START + 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[8%] opacity-90"
          >
            <CircleBadge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: START + 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[38%]"
          >
            <div className="animate-float-soft glass-strong rounded-2xl px-4 py-3 shadow-2xl shadow-black/50">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">Design toolkit</p>
              <div className="mt-2 flex gap-1.5">
                {["Photoshop", "Illustrator", "Figma"].map((t) => (
                  <span key={t} className="rounded-lg bg-white/[0.07] px-2 py-1 text-[11px] font-medium text-white/80">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: START + 1.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[13%] right-6"
          >
            <div className="animate-float-soft-delay">
              <NowPlayingChip />
            </div>
          </motion.div>
        </div>
        )}

        {/* mobile chips */}
        <div className="mt-8 flex flex-wrap items-center gap-3 lg:hidden">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Graphic designer
          </div>
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white/70">
            <span className="font-serif italic text-gradient">now</span> learning React
          </div>
          <button
            type="button"
            onClick={assistant.open}
            data-cursor="Ask AI"
            className="flex items-center gap-1.5 rounded-full bg-brand-gradient py-1.5 pl-2 pr-4 text-xs font-semibold text-white shadow-lg shadow-black/30"
          >
            <RobotIcon className="h-6 w-6" />
            Ask my AI assistant
          </button>
        </div>
      </div>

      <NameTicker />

      <motion.button
        onClick={() => go("about")}
        data-cursor=""
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: START + 1.6, duration: 0.8 }}
        className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white lg:flex"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-current p-1.5">
          <motion.span animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      </motion.button>
    </section>
  );
}
