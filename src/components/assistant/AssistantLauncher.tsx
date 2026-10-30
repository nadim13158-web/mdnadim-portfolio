import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAssistant } from "../../context/AssistantContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { CloseIcon } from "./icons";
import RobotIcon from "./RobotIcon";

const TIP_KEY = "nk-ai-tip-seen";

/**
 * Round "Ask AI" button (bottom-right).
 * Phones: hidden on the first screen so it never covers the hero buttons —
 * the hero has its own "Ask my AI" chip there.
 */
export default function AssistantLauncher() {
  const { isOpen, toggle, open } = useAssistant();
  const isPhone = useMediaQuery("(max-width: 639px)");
  const [pastHero, setPastHero] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // One friendly hint per visit (computers/tablets only)
  useEffect(() => {
    if (isPhone) return;
    try {
      if (sessionStorage.getItem(TIP_KEY)) return;
    } catch {
      /* ignore */
    }
    const show = window.setTimeout(() => setTip(true), 7000);
    const hide = window.setTimeout(() => setTip(false), 16000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [isPhone]);

  useEffect(() => {
    if (!isOpen) return;
    setTip(false);
    try {
      sessionStorage.setItem(TIP_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [isOpen]);

  const dismissTip = () => {
    setTip(false);
    try {
      sessionStorage.setItem(TIP_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const visible = isPhone ? pastHero && !isOpen : true;

  return (
    <div
      className={`relative transition-[opacity,translate] duration-500 ${
        visible ? "" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <AnimatePresence>
        {tip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 6, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[calc(100%+12px)] top-1/2 flex -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-2xl border border-white/10 bg-[#0c0c13]/95 py-1.5 pl-4 pr-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <button type="button" onClick={open} data-cursor="Ask" className="flex items-center gap-2.5 text-left text-sm text-white/85">
              <RobotIcon className="h-7 w-7 shrink-0" tone="brand" mood="happy" />
              <span>
                Need help? <span className="text-gradient font-semibold">Ask my AI assistant</span>
              </span>
            </button>
            <button
              type="button"
              onClick={dismissTip}
              aria-label="Hide tip"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        tabIndex={visible ? 0 : -1}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        data-cursor=""
        data-cursor-hide
        className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-brand-gradient text-white shadow-xl shadow-black/50 ring-1 ring-white/20 transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        {!isOpen && <span className="ai-ping pointer-events-none absolute inset-0 rounded-full" aria-hidden />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "x" : "spark"}
            initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22 }}
            className="relative"
          >
            {isOpen ? <CloseIcon className="h-6 w-6" /> : <span className="rb-float block"><RobotIcon className="h-[38px] w-[38px]" look hoverHappy /></span>}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
