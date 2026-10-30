import { answerLocally, CONTACT_INTENTS, detectLang, type ActionId, type Lang } from "./brain";
import { ACTION_IDS } from "./knowledge.js";

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export interface AssistantReply {
  text: string;
  actions: ActionId[];
  lang: Lang;
  /** "ai" = answered by the real AI (Gemini on Vercel), "instant" = built-in answers */
  mode: "ai" | "instant";
}

/** null = not tried yet, false = no AI on this host (Netlify, local file…) */
let aiAvailable: boolean | null = null;

const TAG = new RegExp(`\\[\\[?\\s*(${ACTION_IDS.join("|")})\\s*\\]\\]?`, "gi");

function cleanAiText(raw: string) {
  return raw
    .replace(TAG, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tagsIn(raw: string): ActionId[] {
  const found = [...raw.matchAll(TAG)].map((m) => m[1].toLowerCase() as ActionId);
  return [...new Set(found)].slice(0, 2);
}

/**
 * Answers the visitor's latest question.
 * Tries the real AI (/api/chat on Vercel) first; if there is none or it fails,
 * the built-in answers reply instead — so the assistant always works.
 */
export async function askAssistant(history: ChatTurn[]): Promise<AssistantReply> {
  const question = [...history].reverse().find((m) => m.role === "user")?.text ?? "";
  const local = answerLocally(question);
  const instant: AssistantReply = { text: local.text, actions: local.actions, lang: local.lang, mode: "instant" };

  if (aiAvailable === false || typeof window === "undefined" || window.location.protocol === "file:") {
    return instant;
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-12).map(({ role, text }) => ({ role, text })) }),
      signal: AbortSignal.timeout(26_000),
    });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    if (!isJson) {
      aiAvailable = false; // a static host answered (no AI function here)
      return instant;
    }
    const data = (await res.json().catch(() => null)) as { reply?: unknown; error?: unknown } | null;
    if (res.ok && typeof data?.reply === "string" && data.reply.trim()) {
      aiAvailable = true;
      const raw = data.reply;
      let actions = tagsIn(raw);
      if (!actions.length && CONTACT_INTENTS.includes(local.intent)) actions = ["contact"];
      const text = cleanAiText(raw);
      if (text) return { text, actions, lang: detectLang(question), mode: "ai" };
    }
    if (data?.error === "not_configured" || res.status === 404 || res.status === 405) aiAvailable = false;
  } catch {
    /* network problem / timeout — answer instantly this time, try the AI again next time */
  }
  return instant;
}
