import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { askAssistant } from "../../assistant/client";
import { ACTION_LABELS, COPIED_LABEL, SUGGESTIONS, WELCOME, type ActionId, type Lang } from "../../assistant/brain";
import { PROFILE } from "../../assistant/knowledge.js";
import { useContactModal } from "../../context/ContactModalContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { lockScroll } from "../../utils/scrollLock";
import { copyText } from "../../utils/copy";
import { ArrowIcon, CheckIcon, CloseIcon, CopyIcon, MailIcon, ResetIcon, SendIcon } from "./icons";
import RobotIcon from "./RobotIcon";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ActionId[];
  lang?: Lang;
  mode?: "ai" | "instant";
}

const STORE_KEY = "nk-assistant-chat-v1";
const MAX_INPUT = 600;
const welcome = (): ChatMessage => ({ id: "welcome", role: "assistant", text: WELCOME, lang: "en" });
const uid = () => Math.random().toString(36).slice(2, 10);
const SECTION: Partial<Record<ActionId, string>> = {
  services: "services",
  projects: "projects",
  skills: "skills",
  about: "about",
  music: "music",
};

function loadChat(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const list = raw ? (JSON.parse(raw) as ChatMessage[]) : null;
    if (Array.isArray(list) && list.length && list.every((m) => typeof m?.text === "string")) return list.slice(-40);
  } catch {
    /* ignore */
  }
  return [welcome()];
}

/* ---------- tiny safe formatter: paragraphs, "•" bullets, **bold** (never raw HTML) ---------- */

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    const items = bullets;
    blocks.push(
      <ul key={`ul${blocks.length}`} className="space-y-1">
        {items.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>{inline(b)}</span>
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };
  text.split("\n").forEach((line) => {
    const m = line.match(/^\s*(?:[•\-*–]|\d+[.)])\s+(.*)$/);
    if (m) {
      bullets.push(m[1]);
      return;
    }
    flush();
    if (line.trim()) blocks.push(<p key={`p${blocks.length}`}>{inline(line)}</p>);
  });
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

function useViewportBox(active: boolean) {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    if (!active) return;
    const vv = window.visualViewport;
    const update = () => {
      const h = vv ? vv.height : window.innerHeight;
      const offset = vv ? vv.offsetTop : 0;
      const gap = Math.min(52, Math.round(h * 0.07));
      setBox({ top: offset + gap, height: h - gap });
    };
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);
  return box;
}

/* ---------------------------------------------------------------------------------------------- */

export default function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isPhone = useMediaQuery("(max-width: 639px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const contact = useContactModal();
  const titleId = useId();

  const [messages, setMessages] = useState<ChatMessage[]>(loadChat);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [reveal, setReveal] = useState<{ id: string; count: number } | null>(null);
  const [copiedFor, setCopiedFor] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const box = useViewportBox(open && isPhone);

  const lastMode = [...messages].reverse().find((m) => m.mode)?.mode;
  const onlyWelcome = messages.length === 1 && messages[0].id === "welcome";
  const lastBotId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  /* persist for this browser tab */
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  /* phone: lock the page behind the sheet */
  useEffect(() => {
    if (!open || !isPhone) return;
    return lockScroll();
  }, [open, isPhone]);

  /* Escape closes; focus the input on computers */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    let t: number | undefined;
    if (!isPhone) t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 320);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, isPhone, onClose]);

  /* typewriter reveal for new replies */
  useEffect(() => {
    if (!reveal) return;
    const msg = messages.find((m) => m.id === reveal.id);
    if (!msg || reveal.count >= msg.text.length) {
      setReveal(null);
      return;
    }
    const step = Math.max(2, Math.ceil(msg.text.length / 70));
    const t = window.setTimeout(() => setReveal({ id: reveal.id, count: reveal.count + step }), 16);
    return () => window.clearTimeout(t);
  }, [reveal, messages]);

  /* keep the newest message in view */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, waiting, reveal?.count, open]);

  /* auto-grow the input */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_INPUT);
      if (!text || waiting) return;
      const userMsg: ChatMessage = { id: uid(), role: "user", text };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setWaiting(true);
      const started = performance.now();
      const reply = await askAssistant(
        history.filter((m) => m.id !== "welcome").map(({ role, text: t }) => ({ role, text: t }))
      );
      const minDelay = 550 - (performance.now() - started);
      if (minDelay > 0) await new Promise((r) => window.setTimeout(r, minDelay));
      const botMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        text: reply.text,
        actions: reply.actions,
        lang: reply.lang,
        mode: reply.mode,
      };
      setMessages((m) => [...m, botMsg]);
      setWaiting(false);
      if (!reduceMotion) setReveal({ id: botMsg.id, count: 0 });
    },
    [messages, waiting, reduceMotion]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  const reset = () => {
    setMessages([welcome()]);
    setReveal(null);
    setInput("");
    inputRef.current?.focus({ preventScroll: true });
  };

  const runAction = async (id: ActionId, msgId: string) => {
    if (id === "email") {
      if (await copyText(PROFILE.email)) {
        setCopiedFor(msgId);
        window.setTimeout(() => setCopiedFor((c) => (c === msgId ? null : c)), 2200);
      }
      return;
    }
    if (id === "contact") {
      onClose();
      window.setTimeout(() => contact.open(), 220);
      return;
    }
    const target = SECTION[id];
    if (!target) return;
    if (isPhone) onClose();
    window.setTimeout(
      () => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      isPhone ? 260 : 0
    );
  };

  /* ------------------------------------------------------------------------------------------ */

  const header = (
    <div className="relative flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
      <div className="relative shrink-0">
        {/* the assistant is an AI, so it gets a robot face — not Nadim's photo */}
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient shadow-lg shadow-black/30">
          <RobotIcon className="h-8 w-8" look mood={waiting ? "thinking" : "idle"} />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c0c13] bg-emerald-400" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="truncate font-display text-[15px] font-semibold text-white">
          Nadim&apos;s AI Assistant
        </h2>
        <p className="truncate text-xs text-white/45">
          {lastMode === "ai" ? "Gemini AI · online" : lastMode === "instant" ? "Instant answers · online" : "Online · ask me anything"}
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        aria-label="Start a new chat"
        data-cursor="New chat"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white"
      >
        <ResetIcon />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close assistant"
        data-cursor="Close"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );

  const list = (
    <div
      ref={listRef}
      className="relative flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
      aria-live="polite"
    >
      {messages.map((m) => {
        const isUser = m.role === "user";
        const revealing = reveal?.id === m.id;
        const shown = revealing ? m.text.slice(0, reveal.count) : m.text;
        const lang = m.lang ?? "en";
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${isUser ? "justify-end" : "justify-start gap-2.5"}`}
          >
            {!isUser && (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
                <RobotIcon
                  className="h-[22px] w-[22px]"
                  mood={m.id === "welcome" ? "happy" : "idle"}
                  animated={m.id === lastBotId}
                />
              </span>
            )}
            <div className={`max-w-[85%] ${isUser ? "" : "min-w-0"}`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                  isUser
                    ? "rounded-br-md bg-brand-gradient text-white"
                    : "rounded-tl-md border border-white/[0.07] bg-white/[0.05] text-white/85"
                }`}
              >
                {isUser ? <p className="whitespace-pre-wrap break-words">{m.text}</p> : <RichText text={shown} />}
              </div>
              {!isUser && !revealing && !!m.actions?.length && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.actions.map((a) => {
                    const copied = a === "email" && copiedFor === m.id;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => void runAction(a, m.id)}
                        data-cursor=""
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          a === "contact"
                            ? "border-transparent bg-white text-black hover:bg-white/90"
                            : copied
                              ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-300"
                              : "border-white/12 bg-white/[0.04] text-white/80 hover:bg-white/[0.09] hover:text-white"
                        }`}
                      >
                        {a === "contact" ? <MailIcon /> : a === "email" ? copied ? <CheckIcon /> : <CopyIcon /> : <ArrowIcon />}
                        {copied ? COPIED_LABEL[lang] : ACTION_LABELS[a][lang]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {onlyWelcome && !waiting && (
        <div className="flex flex-wrap gap-2 pl-[38px]">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              data-cursor="Ask"
              className="rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 text-left text-[13px] text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {waiting && (
        <div className="flex items-center gap-2.5" aria-label="Assistant is typing">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
            <RobotIcon className="h-[22px] w-[22px]" mood="thinking" />
          </span>
          <div className="flex gap-1 rounded-2xl rounded-tl-md border border-white/[0.07] bg-white/[0.05] px-4 py-3.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-white/60"
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const composer = (
    <div className="shrink-0 border-t border-white/[0.07] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 sm:px-4 sm:pb-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pl-3.5 transition-colors focus-within:border-white/25"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
          onKeyDown={onKeyDown}
          rows={1}
          enterKeyHint="send"
          placeholder="Ask anything about Nadim…"
          aria-label="Your question"
          className="max-h-[120px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-base leading-snug text-white placeholder-white/35 outline-none sm:text-[14px]"
        />
        <button
          type="submit"
          disabled={!input.trim() || waiting}
          aria-label="Send question"
          data-cursor={input.trim() ? "Send" : ""}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white transition-opacity disabled:opacity-35"
        >
          <SendIcon />
        </button>
      </form>
      <p className="mt-2 px-1 text-center text-[10.5px] leading-snug text-white/30">
        {lastMode === "ai"
          ? "AI can make mistakes — for anything important, message Nadim directly."
          : "Quick answers about Nadim — for anything else, message him directly."}
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {isPhone && (
            <motion.div
              key="ai-backdrop"
              className="fixed inset-0 z-[385] bg-black/65 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              aria-hidden
            />
          )}
          <motion.div
            key="ai-panel"
            role="dialog"
            aria-labelledby={titleId}
            initial={isPhone ? { y: "100%" } : { opacity: 0, y: 18, scale: 0.96 }}
            animate={isPhone ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isPhone ? { y: "100%" } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={isPhone ? { top: box?.top ?? 52, height: box?.height ?? "calc(100dvh - 52px)" } : undefined}
            className={`fixed z-[390] flex flex-col overflow-hidden border border-white/10 bg-[#0c0c13] shadow-2xl shadow-black/70 ${
              isPhone
                ? "inset-x-0 rounded-t-[24px] border-b-0"
                : "bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)] right-5 h-[min(600px,calc(100dvh-10rem))] w-[384px] origin-bottom-right rounded-[24px]"
            }`}
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand/20 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-brand2/10 blur-[80px]" />
            {isPhone && <div className="relative mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-white/15" />}
            {header}
            {list}
            {composer}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
