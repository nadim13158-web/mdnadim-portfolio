/**
 * POST /api/contact — portfolio contact form endpoint (Vercel Serverless Function).
 *
 * Sends the message with the Resend email API (https://resend.com).
 * Required environment variables (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      — your Resend API key (starts with "re_")
 *   CONTACT_TO_EMAIL    — inbox that receives messages (your Gmail)
 *   CONTACT_FROM_EMAIL  — optional. Default: Resend test sender.
 *                         NOTE: the free test sender can only deliver to the
 *                         email address you signed up to Resend with.
 *                         Verify your own domain in Resend for a custom sender.
 *
 * Security: same-origin check, validation + sanitisation, honeypot,
 * best-effort rate limit, generic error messages (no internal details leaked).
 */
'use strict';

const LIMITS = { name: 80, email: 120, service: 80, message: 2000 };
const hits = new Map(); // ip -> [timestamps] (best-effort, per warm instance)

function clean(v, max) {
  if (typeof v !== 'string') return '';
  // strip control chars (kills CRLF header injection), then trim + cap length
  return v.replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, max);
}

function rateLimited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, max = 5;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  if (arr.length >= max) return true;
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  // same-origin only (browsers send Origin on POST fetch)
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return res.status(403).json({ ok: false, error: 'Forbidden.' });
      }
    } catch (_) {
      return res.status(403).json({ ok: false, error: 'Forbidden.' });
    }
  }

  const len = parseInt(req.headers['content-length'] || '0', 10);
  if (len > 20000) return res.status(413).json({ ok: false, error: 'Message too large.' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); }
    catch (_) { return res.status(400).json({ ok: false, error: 'Invalid request.' }); }
  }

  // honeypot: humans never see/fill "company" — silently accept bots
  if (body.company) return res.status(200).json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const service = clean(body.service, LIMITS.service) || 'General inquiry';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, LIMITS.message) : '';

  if (name.length < 2) return res.status(400).json({ ok: false, error: 'Please write your name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Please write a valid email address.' });
  if (message.length < 10) return res.status(400).json({ ok: false, error: 'Please write a little more about your project.' });

  const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = fwd || (req.socket && req.socket.remoteAddress) || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: 'Too many messages. Please wait a few minutes.' });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL env var.');
    return res.status(501).json({ ok: false, error: 'Email service is not configured yet. Please use the email button.' });
  }
  const from = process.env.CONTACT_FROM_EMAIL || ('Portfolio <' + ['onboarding', 'resend.dev'].join('@') + '>');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: '[Portfolio] ' + service + ' — ' + name,
        text:
          'New message from your portfolio contact form\n' +
          '-------------------------------------------\n' +
          'Name:    ' + name + '\n' +
          'Email:   ' + email + '\n' +
          'Service: ' + service + '\n\n' +
          message + '\n'
      })
    });
    if (!r.ok) {
      console.error('[contact] Resend responded', r.status);
      return res.status(502).json({ ok: false, error: 'Could not send right now. Please try the email button.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[contact] Send failed:', e && e.message);
    return res.status(502).json({ ok: false, error: 'Could not send right now. Please try the email button.' });
  }
};
