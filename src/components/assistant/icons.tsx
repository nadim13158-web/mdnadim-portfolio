/** Small icon set for the assistant (SVG — looks the same on every device). */

export const SparkleIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M10.6 2.9c.2-.6 1-.6 1.2 0l1.2 3.6a5 5 0 003.2 3.2l3.6 1.2c.6.2.6 1 0 1.2l-3.6 1.2a5 5 0 00-3.2 3.2l-1.2 3.6c-.2.6-1 .6-1.2 0l-1.2-3.6a5 5 0 00-3.2-3.2L1.6 12.1c-.6-.2-.6-1 0-1.2l3.6-1.2a5 5 0 003.2-3.2z" />
    <path d="M19.2 1.6c.1-.3.5-.3.6 0l.5 1.4c.2.6.6 1 1.2 1.2l1.4.5c.3.1.3.5 0 .6l-1.4.5c-.6.2-1 .6-1.2 1.2l-.5 1.4c-.1.3-.5.3-.6 0l-.5-1.4a2 2 0 00-1.2-1.2l-1.4-.5c-.3-.1-.3-.5 0-.6l1.4-.5c.6-.2 1-.6 1.2-1.2z" opacity=".75" />
  </svg>
);

export const CloseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const SendIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const ResetIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const ArrowIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const MailIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

export const CopyIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5V5" />
  </svg>
);

export const CheckIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
