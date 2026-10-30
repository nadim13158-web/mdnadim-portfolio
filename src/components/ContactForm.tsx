import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MAX_MESSAGE_LENGTH } from "../config/contact";
import { useContactSubmit, type ContactFields } from "../hooks/useContactSubmit";
import CopyEmailButton from "./CopyEmailButton";

const budgets = ["< $500", "$500 – 1k", "$1k – 5k", "$5k +"];

// 16px text on phones — iPhone zooms the whole page if an input's text is smaller
const field =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-white placeholder-white/30 outline-none transition-[border-color,background-color] duration-300 focus:border-white/30 focus:bg-white/[0.06] disabled:opacity-60 sm:px-5 sm:py-4 sm:text-[15px]";
const labelCls = "mb-2 block text-xs font-medium text-white/50";

/**
 * Direct message form. Sends from inside the page — never opens a mail app.
 * variant "section": full form in the Contact section (with budget chips)
 * variant "modal":   compact form inside the "Let's talk" pop-up
 */
export default function ContactForm({
  variant = "section",
  autoFocus = false,
  onDone,
}: {
  variant?: "section" | "modal";
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const uid = useId();
  const ids = { name: `${uid}-name`, email: `${uid}-email`, msg: `${uid}-msg` };
  const blank = (): ContactFields => ({
    name: "",
    email: "",
    message: "",
    budget: variant === "section" ? budgets[1] : undefined,
  });

  const [form, setForm] = useState<ContactFields>(blank);
  const [honey, setHoney] = useState("");
  const [hint, setHint] = useState("");
  const { status, submit, reset } = useContactSubmit();
  const sending = status === "sending";
  const nameRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 380);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!form.name.trim()) {
      setHint("Please write your name.");
      nameRef.current?.focus();
      return;
    }
    if (form.message.trim().length < 2) {
      setHint("Please write a short message.");
      msgRef.current?.focus();
      return;
    }
    setHint("");
    void submit(form, honey);
  };

  const sendAnother = () => {
    setForm(blank());
    reset();
  };

  /* ---------------- sent ---------------- */
  if (status === "success") {
    const first = form.name.trim().split(/\s+/)[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col items-center text-center ${variant === "modal" ? "py-4" : "py-8 sm:py-12"}`}
        role="status"
        aria-live="polite"
      >
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.05 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient shadow-lg shadow-black/40"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            />
          </svg>
        </motion.span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-white">Message sent!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
          Thanks{first ? `, ${first}` : ""}. It&apos;s in my inbox now — I&apos;ll reply to{" "}
          <span className="break-all text-white/85">{form.email}</span> within 24 hours.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {onDone && (
            <button
              type="button"
              onClick={onDone}
              data-cursor=""
              className="btn-primary btn-shine rounded-full px-7 py-3 font-display text-sm font-semibold"
            >
              Done
            </button>
          )}
          <button
            type="button"
            onClick={sendAnother}
            data-cursor=""
            className="glass rounded-full px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    );
  }

  /* ---------------- form ---------------- */
  const remaining = MAX_MESSAGE_LENGTH - form.message.length;

  return (
    <form onSubmit={onSubmit} className="relative" noValidate={false}>
      {/* invisible trap for spam bots — humans never see or fill it */}
      <input
        type="text"
        name="gotcha"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px opacity-0"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className={labelCls}>
            Your name
          </label>
          <input
            ref={nameRef}
            id={ids.name}
            required
            disabled={sending}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            maxLength={80}
            placeholder="Jane Cooper"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={ids.email} className={labelCls}>
            Your email <span className="text-white/30">(so I can reply)</span>
          </label>
          <input
            id={ids.email}
            required
            disabled={sending}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            maxLength={120}
            placeholder="jane@email.com"
            className={field}
          />
        </div>
      </div>

      {variant === "section" && (
        <div className="mt-4">
          <span className={labelCls}>Project budget</span>
          <div className="flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                disabled={sending}
                data-cursor=""
                onClick={() => setForm({ ...form, budget: b })}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 disabled:opacity-50 ${
                  form.budget === b
                    ? "border-transparent bg-white text-black"
                    : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor={ids.msg} className={`${labelCls} flex items-baseline justify-between`}>
          <span>Your message</span>
          <span className={remaining < 150 ? "text-amber-300" : "text-white/30"}>{remaining}</span>
        </label>
        <textarea
          ref={msgRef}
          id={ids.msg}
          required
          disabled={sending}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={variant === "modal" ? 4 : 5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={
            variant === "modal"
              ? "Hi Nadim, I'd like a poster / logo for…"
              : "What do you need designed, and when do you need it?"
          }
          className={`${field} resize-none`}
        />
      </div>

      {hint && (
        <p role="alert" className="mt-3 text-sm text-amber-300">
          {hint}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        data-cursor={sending ? "" : "Send"}
        className="btn-primary btn-shine mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 font-display text-sm font-semibold disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      >
        {sending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            {status === "error" ? "Try again" : "Send message"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {status === "error" && (
          <motion.div
            key="err"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div role="alert" className="mt-5 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm">
              <p className="font-medium text-amber-100">Your message couldn&apos;t be sent.</p>
              <p className="mt-1 leading-relaxed text-amber-100/70">
                Please check your internet connection and press &ldquo;Try again&rdquo;.
              </p>
              <div className="mt-3">
                <CopyEmailButton variant="link" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {variant === "section" && status !== "error" && (
        <p className="mt-5 text-center text-xs text-white/35 sm:text-left">
          Sent straight to my inbox from this page — no email app needed.
        </p>
      )}
    </form>
  );
}
