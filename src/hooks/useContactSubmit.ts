import { useCallback, useRef, useState } from "react";
import {
  FORMSUBMIT_ENDPOINT,
  MAX_MESSAGE_LENGTH,
  NETLIFY_FORM_NAME,
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
} from "../config/contact";

export type FormStatus = "idle" | "sending" | "success" | "error";

export interface ContactFields {
  name: string;
  email: string;
  message: string;
  budget?: string;
}

/** Give up on one service after this long and try the next. */
const TIMEOUT = 9000;

const subjectFor = (f: ContactFields) => `New portfolio message from ${f.name}`;

function isLocalPreview() {
  if (typeof window === "undefined") return true;
  const { protocol, hostname } = window.location;
  return (
    protocol === "file:" ||
    hostname === "localhost" ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]" ||
    /^127\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname)
  );
}

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    return await fn(ctrl.signal);
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * 1) Netlify Forms. Needs the hidden <form name="contact"> in index.html and
 *    "Enable form detection" switched on in the Netlify dashboard.
 */
async function sendToNetlify(f: ContactFields): Promise<boolean> {
  if (isLocalPreview()) return false; // no Netlify on a local preview
  if (/\.vercel\.app$/i.test(window.location.hostname)) return false; // Vercel has no Netlify Forms
  const body = new URLSearchParams({
    "form-name": NETLIFY_FORM_NAME,
    subject: subjectFor(f),
    name: f.name,
    email: f.email,
    budget: f.budget || "Not specified",
    message: f.message,
    gotcha: "",
  });
  return withTimeout(async (signal) => {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal,
    });
    if (!res.ok) return false;
    const reply = await res.text().catch(() => "");
    // IMPORTANT: when form detection is OFF, Netlify still answers "200 OK" — but with
    // our own page, and stores nothing. Only count it as delivered when the reply is
    // Netlify's "thank you" page, i.e. NOT our own index.html.
    return !reply.includes('id="root"');
  });
}

/** 2) Web3Forms — only if an access key is set in src/config/contact.ts */
async function sendToWeb3Forms(f: ContactFields): Promise<boolean> {
  if (!WEB3FORMS_ACCESS_KEY) return false;
  return withTimeout(async (signal) => {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal,
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: subjectFor(f),
        from_name: "Portfolio contact form",
        name: f.name,
        email: f.email,
        budget: f.budget || "Not specified",
        message: f.message,
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: unknown } | null;
    return res.ok && data?.success === true;
  });
}

/** 3) FormSubmit — backup */
async function sendToFormSubmit(f: ContactFields): Promise<boolean> {
  return withTimeout(async (signal) => {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal,
      body: JSON.stringify({
        name: f.name,
        email: f.email,
        budget: f.budget || "Not specified",
        message: f.message,
        _subject: subjectFor(f),
        _replyto: f.email,
        _template: "table",
        _captcha: "false",
        _honey: "",
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: unknown } | null;
    // FormSubmit answers success as the STRING "true" / "false" — "false" means not delivered
    return res.ok && String(data?.success) === "true";
  });
}

/**
 * Sends the message straight to the inbox from inside the page.
 * Never opens a mail app or any other app — if every service fails the
 * form simply shows an error with a "Try again" button.
 */
export function useContactSubmit() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const busy = useRef(false);

  const submit = useCallback(async (raw: ContactFields, honeypot = "") => {
    if (busy.current) return;

    // A bot filled the invisible field: pretend it worked, send nothing.
    if (honeypot) {
      setStatus("success");
      return;
    }

    const f: ContactFields = {
      name: raw.name.trim(),
      email: raw.email.trim(),
      message: raw.message.trim().slice(0, MAX_MESSAGE_LENGTH),
      budget: raw.budget,
    };

    busy.current = true;
    setStatus("sending");
    try {
      for (const send of [sendToNetlify, sendToWeb3Forms, sendToFormSubmit]) {
        try {
          if (await send(f)) {
            setStatus("success");
            return;
          }
        } catch {
          /* this service failed — try the next one */
        }
      }
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }, []);

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, submit, reset };
}
