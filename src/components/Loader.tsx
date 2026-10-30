import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Design", "Develop", "Deliver"];

export default function Loader({ visible }: { visible: boolean }) {
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const duration = 1500;
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(Math.floor(p));
      setWord(Math.min(WORDS.length - 1, Math.floor((p / 100) * WORDS.length)));
      if (p >= 100) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-[#07070b]"
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" />

          <motion.div
            exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-20 w-20 items-center justify-center"
            >
              <span className="animate-spin-slow absolute inset-0 rounded-[28%] bg-brand-gradient opacity-90 blur-[1px]" />
              <span className="absolute inset-[3px] rounded-[26%] bg-[#07070b]" />
              <span className="relative font-display text-2xl font-bold text-white">NK</span>
            </motion.div>

            <div className="mt-8 h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={word}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-3xl italic text-white"
                >
                  {WORDS[word]}.
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-6 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 font-display text-xs tabular-nums text-white/40">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
