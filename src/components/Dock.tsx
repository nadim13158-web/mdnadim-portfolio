import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { themes, useTheme } from "../context/ThemeContext";
import { useAssistant } from "../context/AssistantContext";
import AssistantLauncher from "./assistant/AssistantLauncher";

/** Bottom-right: colour theme picker + back to top. */
export default function Dock() {
  const { themeId, setTheme } = useTheme();
  const assistant = useAssistant();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.2, duration: 0.6 }}
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+0.9rem)] right-3 z-[150] flex flex-col items-end gap-2.5 sm:right-5"
    >
      {/* framer-motion writes an inline opacity on the outer element, so the
          hide-on-phone classes must live on this inner wrapper to take effect */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-[opacity,translate] duration-500 ${
          assistant.isOpen
            ? "pointer-events-none translate-y-3 opacity-0"
            : showTop
              ? ""
              : "max-sm:pointer-events-none max-sm:translate-y-3 max-sm:opacity-0"
        }`}
      >
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor=""
            aria-label="Back to top"
            className="glass-strong flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="glass-strong flex items-center gap-1 rounded-full p-1.5 shadow-2xl shadow-black/40">
        <AnimatePresence initial={false}>
          {open &&
            themes.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 32, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0, width: 0 }}
                onClick={() => setTheme(t.id)}
                data-cursor={t.name}
                aria-label={`${t.name} theme`}
                className="flex h-8 items-center justify-center"
              >
                <span
                  className={`h-6 w-6 rounded-full transition-all duration-300 ${
                    themeId === t.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#111]" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${t.a}, ${t.b})` }}
                />
              </motion.button>
            ))}
        </AnimatePresence>
        <button
          onClick={() => setOpen((o) => !o)}
          data-cursor={open ? "" : "Theme"}
          aria-label="Change colour theme"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 000 18" fill="currentColor" />
              </>
            )}
          </svg>
        </button>
      </div>
      </div>
      <AssistantLauncher />
    </motion.div>
  );
}
