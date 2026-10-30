import { Fragment, useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import MagneticButton from "./MagneticButton";
import ProfilePhoto from "./ProfilePhoto";
import { useProfilePhoto } from "../hooks/useProfilePhoto";
import { useContactModal } from "../context/ContactModalContext";
import { personal } from "../data/portfolioData";

const facts = [
  { k: "Based in", v: "Bangladesh" },
  { k: "Focus", v: "Graphics & branding" },
  { k: "Learning", v: "React & front-end" },
  { k: "Response", v: "Within 24 hours" },
];

function ProfileCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 30 });
  const photo = useProfilePhoto();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (py - 0.5) * -10, ry: (px - 0.5) * 10, mx: px * 100, my: py * 100 });
  };

  return (
    <div style={{ perspective: 1200 }} className="mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[420px]">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setT({ rx: 0, ry: 0, mx: 50, my: 30 })}
        data-cursor={photo ? "Hello!" : ""}
        className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0c13] p-2 shadow-2xl shadow-black/50"
        style={
          photo
            ? undefined /* real photo: no 3D tilt, so it never goes soft */
            : { transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, transition: "transform 0.25s ease-out" }
        }
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px]">
          {photo ? (
            <Fragment key="about-photo">
              {/* your real photo — head-to-waist portrait crop */}
              <ProfilePhoto crop="portrait" className="w-full" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06060b]/85 via-transparent to-transparent" />
            </Fragment>
          ) : (
            <Fragment key="about-fallback">
            <div className="absolute inset-0 bg-[#0d0d14]" />
            <div className="animate-aurora absolute -left-1/4 -top-1/4 h-[90%] w-[90%] rounded-full bg-brand/60 blur-[70px]" />
            <div className="animate-aurora-slow absolute -bottom-1/4 -right-1/4 h-[80%] w-[80%] rounded-full bg-brand2/50 blur-[70px]" />
            <div className="bg-noise absolute inset-0" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,.5) .6px, transparent .7px)",
                backgroundSize: "26px 26px",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-[9rem] italic leading-none text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]">NK</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-white/60">design studio of one</span>
            </div>
            </Fragment>
          )}

          <div className="absolute inset-x-2 bottom-2 rounded-2xl border border-white/15 bg-black/40 p-3.5 backdrop-blur-xl sm:inset-x-3 sm:bottom-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[13px] font-semibold text-white sm:text-base">
                  {personal.name}
                </p>
                <p className="truncate text-xs text-white/65">Graphic Designer</p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Open
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(300px circle at ${t.mx}% ${t.my}%, rgba(255,255,255,0.14), transparent 60%)` }} />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const contact = useContactModal();
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <ProfileCard />
          </motion.div>

          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About me"
              title="I design visuals that make brands"
              accent="unforgettable."
              description={personal.bio}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="-mt-8 max-w-2xl leading-relaxed text-white/50"
            >
              I&apos;m just getting started with code — this portfolio is my first real project. I&apos;m not
              pretending to be a senior developer; I&apos;m a designer who is curious, consistent, and
              genuinely excited to learn.
            </motion.p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
              {facts.map((f, i) => (
                <motion.div
                  key={f.k}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.07 }}
                  className="glass rounded-2xl px-5 py-4"
                >
                  <p className="text-xs text-white/40">{f.k}</p>
                  <p className="mt-1 font-display text-sm font-semibold text-white sm:text-base">{f.v}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <button type="button" onClick={contact.open} data-cursor="Message" className="btn-primary btn-shine inline-flex rounded-full px-7 py-3.5 font-display text-sm font-semibold">
                  Start a project
                </button>
              </MagneticButton>
              <span className="text-sm text-white/45">
                or email <span className="text-white/80">{personal.email}</span>
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
