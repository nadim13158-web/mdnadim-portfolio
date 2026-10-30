import { useEffect, useRef, useState } from "react";
import { personal } from "../data/portfolioData";
import { icons } from "./Icons";
import { copyText } from "../utils/copy";

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5V5" />
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/**
 * Shows the email address. Tapping it COPIES the address —
 * it never opens a mail app or any other app.
 */
export default function CopyEmailButton({
  variant = "card",
  className = "",
}: {
  variant?: "card" | "pill" | "link";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (!(await copyText(personal.email))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const live = (
    <span className="sr-only" aria-live="polite">
      {copied ? "Email address copied" : ""}
    </span>
  );

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={onCopy}
        data-cursor={copied ? "Copied" : "Copy"}
        className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
          copied ? "text-emerald-300" : "text-white/55 hover:text-white"
        } ${className}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? "Email copied" : "Copy my email instead"}
        {live}
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onCopy}
        data-cursor={copied ? "Copied" : "Copy"}
        className={`glass inline-flex max-w-full items-center gap-3 rounded-full py-2 pl-5 pr-2 transition-colors hover:bg-white/10 ${className}`}
      >
        <span className="truncate font-display text-sm font-medium text-white">{personal.email}</span>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            copied ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white"
          }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </span>
        {live}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      data-cursor={copied ? "Copied" : "Copy"}
      className={`glass group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-colors hover:bg-white/[0.07] ${className}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient p-2.5 text-white">
        {icons.mail({ className: "h-full w-full" })}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-xs transition-colors ${copied ? "text-emerald-300" : "text-white/40"}`}>
          {copied ? "Copied to clipboard" : "Email · tap to copy"}
        </span>
        <span className="block truncate font-medium text-white">{personal.email}</span>
      </span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
          copied ? "bg-emerald-400/15 text-emerald-300" : "bg-white/[0.06] text-white/60 group-hover:text-white"
        }`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      {live}
    </button>
  );
}
