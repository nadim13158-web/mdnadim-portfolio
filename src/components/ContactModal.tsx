import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "./ContactForm";
import ProfilePhoto from "./ProfilePhoto";
import { useProfilePhoto } from "../hooks/useProfilePhoto";
import { personal } from "../data/portfolioData";
import { lockScroll } from "../utils/scrollLock";

/**
 * "Let's talk" pop-up: bottom sheet on phones, centred dialog on computers.
 * The visitor writes and sends right here — no other app opens.
 */
export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const photo = useProfilePhoto();
  const isPhone = typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

  useEffect(() => {
    if (!open) return;
    const lastFocus = document.activeElement as HTMLElement | null;
    const unlock = lockScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      // keep keyboard focus inside the pop-up
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])'
      )].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
      lastFocus?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-[400] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" onClick={onClose} aria-hidden />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={isPhone ? { y: "100%" } : { opacity: 0, y: 28 }}
            animate={isPhone ? { y: 0 } : { opacity: 1, y: 0 }}
            exit={isPhone ? { y: "100%" } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0c0c13] shadow-2xl shadow-black/70 sm:max-w-lg sm:rounded-[28px]"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/25 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand2/15 blur-[80px]" />

            <div className="relative mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-white/15 sm:hidden" />

            {/* header */}
            <div className="relative flex shrink-0 items-start gap-4 px-6 pt-5 sm:px-8 sm:pt-8">
              <div className="relative shrink-0">
                {photo ? (
                  <div className="w-12 overflow-hidden rounded-2xl ring-1 ring-white/15">
                    <ProfilePhoto crop="passport" className="w-12" />
                  </div>
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient font-display text-sm font-bold text-white">
                    NK
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0c0c13] bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-display text-xl font-semibold text-white sm:text-2xl">
                  Message {personal.firstName.split(" ").pop()}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-white/50">
                  Goes straight to my inbox — I reply within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                data-cursor="Close"
                className="glass -mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* body */}
            <div className="relative overflow-y-auto overscroll-contain px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] pt-6 sm:px-8 sm:pb-8">
              <ContactForm variant="modal" autoFocus={!isPhone} onDone={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
