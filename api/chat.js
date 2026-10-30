/* ============================================================
   AI ASSISTANT — VERCEL SERVER FUNCTION  (/api/chat)
   ------------------------------------------------------------
   Visitor er prosno Google Gemini AI ke pathay, uttor ferot dey.
   API key thake SERVER e (Vercel -> Settings -> Environment
   Variables -> GEMINI_API_KEY) — site er code e kokhono dekha jay na.

   Key na thakle / AI kaj na korle site nije "instant" uttor dey,
   tai assistant kokhono bondho hoy na.

   CHECK KORTE: browser e kholen  https://APNAR-SITE.vercel.app/api/chat?test=1
   ============================================================ */

import { buildSystemPrompt } from "../src/assistant/knowledge.js";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
// Free-tier models (2026). If one is busy / retired, the next is tried.
const DEFAULT_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
];
const MAX_ATTEMPTS = 4;
const TOTAL_BUDGET_MS = 24_000;
const SYSTEM_PROMPT = buildSystemPrompt();

/* ---------------- tiny helpers (plain Node APIs — work on Vercel and locally) ---------------- */

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  const b = req.body;
  if (b !== undefined && b !== null && b !== "") {
    if (typeof b === "string") {
      try { return JSON.parse(b); } catch { return null; }
    }
    if (Buffer.isBuffer(b)) {
      try { return JSON.parse(b.toString("utf8")); } catch { return null; }
    }
    return b; // already parsed by Vercel
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64_000) return null;
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
  } catch {
    return null;
  }
}

/* ---------------- light abuse protection ---------------- */

const hits = new Map(); // ip -> timestamps (per server instance, best effort)
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  const limited = recent.length >= 30;
  if (!limited) recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return limited;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (typeof fwd === "string" && fwd.split(",")[0].trim()) || req.socket?.remoteAddress || "unknown";
}

/** Browsers always send Origin on POST: only allow calls from this same website. */
function isForeignOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/* ---------------- conversation → Gemini format ---------------- */

function toContents(raw) {
  if (!Array.isArray(raw)) return null;
  let msgs = raw
    .slice(-14)
    .map((m) => ({
      role: m && m.role === "assistant" ? "model" : m && m.role === "user" ? "user" : null,
      text: typeof m?.text === "string" ? m.text.replace(/\u0000/g, "").trim().slice(0, 1200) : "",
    }))
    .filter((m) => m.role && m.text);

  while (msgs.length && msgs[0].role !== "user") msgs.shift(); // must start with the visitor

  const merged = [];
  for (const m of msgs) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.text += `\n\n${m.text}`;
    else merged.push({ ...m });
  }

  let total = merged.reduce((n, m) => n + m.text.length, 0);
  while (total > 7000 && merged.length > 1) {
    total -= merged.shift().text.length;
    while (merged.length && merged[0].role !== "user") total -= merged.shift().text.length;
  }

  if (!merged.length || merged[merged.length - 1].role !== "user") return null;
  return merged.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
}

async function callGemini({ model, key, contents, thinking, timeoutMs }) {
  const generationConfig = { maxOutputTokens: 1024 };
  if (thinking && model.startsWith("gemini-3")) generationConfig.thinkingConfig = { thinkingLevel: "low" };

  const r = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents, generationConfig }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    const reason = data?.error?.details?.find?.((d) => d?.reason)?.reason || "";
    return { ok: false, status: r.status, message: `${data?.error?.message || ""} ${reason}`.trim() };
  }
  const cand = data?.candidates?.[0];
  const text = (cand?.content?.parts || [])
    .filter((p) => typeof p?.text === "string" && !p.thought)
    .map((p) => p.text)
    .join("")
    .trim();
  if (!text) {
    return { ok: false, status: 200, blocked: true, message: cand?.finishReason || data?.promptFeedback?.blockReason || "empty" };
  }
  return { ok: true, text };
}

/** Tries the models in order. Returns { ok, text, model } or { ok:false, error }. */
async function askGemini(key, contents) {
  const models = [...new Set([process.env.GEMINI_MODEL?.trim(), ...DEFAULT_MODELS].filter(Boolean))];
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let attempts = 0;

  for (const model of models) {
    let thinking = true;
    for (let pass = 0; pass < 2; pass++) {
      const left = deadline - Date.now();
      if (attempts >= MAX_ATTEMPTS || left < 2500) return { ok: false, error: "ai_unavailable" };
      attempts++;

      let r;
      try {
        r = await callGemini({ model, key, contents, thinking, timeoutMs: Math.min(15_000, left) });
      } catch (e) {
        r = { ok: false, status: 0, message: e?.name === "TimeoutError" ? "timeout" : "network error" };
      }
      if (r.ok) return { ok: true, text: r.text, model };

      console.error(`[chat] ${model} failed: ${r.status} ${String(r.message).slice(0, 180)}`);
      if (r.blocked) return { ok: false, error: "blocked" };
      if (/api key|API_KEY_INVALID/i.test(r.message)) return { ok: false, error: "bad_key" };
      if (r.status === 400 && thinking && /thinking/i.test(r.message)) {
        thinking = false; // this model doesn't accept the thinking setting — retry without it
        continue;
      }
      break; // try the next model
    }
  }
  return { ok: false, error: "ai_unavailable" };
}

/* ---------------- the function ---------------- */

export default async function handler(req, res) {
  const key = (process.env.GEMINI_API_KEY || "").trim();

  // Health check (open in a browser):  /api/chat   or   /api/chat?test=1
  if (req.method === "GET" || req.method === "HEAD") {
    const url = new URL(req.url || "/", "http://localhost");
    if (!key) {
      return send(res, 200, {
        ai_key: "missing",
        ai_working: false,
        message: "GEMINI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then Redeploy.",
      });
    }
    if (url.searchParams.get("test") !== "1") {
      return send(res, 200, { ai_key: "found", message: "Add ?test=1 to the address to test the AI." });
    }
    if (isRateLimited(clientIp(req))) return send(res, 429, { error: "rate_limited" });
    const r = await askGemini(key, [{ role: "user", parts: [{ text: "Reply with just: OK" }] }]);
    return send(res, 200, r.ok
      ? { ai_key: "found", ai_working: true, model: r.model, message: "The AI assistant is working!" }
      : { ai_key: "found", ai_working: false, error: r.error, message: r.error === "bad_key"
          ? "The key is not valid. Copy it again from Google AI Studio."
          : "The AI did not answer right now. Try again in a minute." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "method_not_allowed" });
  }
  if (!key) return send(res, 503, { error: "not_configured" });
  if (isForeignOrigin(req)) return send(res, 403, { error: "forbidden" });
  if (isRateLimited(clientIp(req))) return send(res, 429, { error: "rate_limited" });

  const body = await readJson(req);
  const contents = toContents(body?.messages);
  if (!contents) return send(res, 400, { error: "bad_request" });

  const r = await askGemini(key, contents);
  if (r.ok) return send(res, 200, { reply: r.text, model: r.model });
  return send(res, 502, { error: r.error });
}
