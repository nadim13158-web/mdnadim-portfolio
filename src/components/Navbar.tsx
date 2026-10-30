import { useEffect, useState } from "react";
import { useContactModal } from "../context/ContactModalContext";
import CopyEmailButton from "./CopyEmailButton";
import { useAssistant } from "../context/AssistantContext";
import { lockScroll } from "../utils/scrollLock";
import RobotIcon from "./assistant/RobotIcon";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Work", id: "projects" },
  { label: "Music", id: "music" },
  { label: "Journey", id: "experience" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const contact = useContactModal();
  const assistant = useAssistant();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["home", ...navLinks.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  const go = (id: string) => {
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), wasOpen ? 300 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[150] px-4 pt-4 sm:px-6"
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-2 pr-2 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-2xl shadow-black/30" : "border border-transparent"
          }`}
        >
          <button onClick={() => go("home")} data-cursor="" className="group flex items-center gap-2.5 pl-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient font-display text-xs font-bold text-white transition-transform duration-500 group-hover:rotate-[360deg]">
              NK
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-white">
              Nadim<span className="text-gradient">.</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-cursor=""
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  active === l.id ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={contact.open}
              data-cursor="Say hi"
              className="btn-primary hidden rounded-full px-5 py-2.5 font-display text-sm font-semibold sm:inline-flex"
            >
              Let&apos;s talk
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                assistant.open();
              }}
              aria-label="Ask my AI assistant"
              data-cursor="Ask AI"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg shadow-black/30 sm:hidden"
            >
              <RobotIcon className="h-[30px] w-[30px]" />
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="glass flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            >
              <div className="relative h-3 w-4">
                <span
                  className={`absolute left-0 h-[1.5px] w-full rounded bg-white transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full rounded bg-white transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[140] flex flex-col justify-center bg-[#07070b]/95 px-8 backdrop-blur-2xl lg:hidden"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-[100px]" />
            <nav className="relative space-y-2">
              {navLinks.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(l.id)}
                  className={`block font-display text-4xl font-semibold tracking-tight ${
                    active === l.id ? "text-gradient" : "text-white"
                  }`}
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-12 flex flex-col items-start gap-4"
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  contact.open();
                }}
                className="btn-primary btn-shine inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold"
              >
                Let&apos;s talk
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => assistant.open(), 200);
                }}
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
              >
                <RobotIcon className="h-6 w-6" />
                Ask my AI assistant
              </button>
              <CopyEmailButton variant="link" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
