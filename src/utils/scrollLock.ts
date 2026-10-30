/**
 * Locks page scrolling while any pop-up is open.
 * Counts locks, so two pop-ups opening/closing in any order can never leave the
 * page stuck (or scrolling behind an open pop-up).
 */
let locks = 0;
let saved: { html: string; body: string } | null = null;

export function lockScroll(): () => void {
  const html = document.documentElement;
  const body = document.body;
  if (locks === 0) {
    saved = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  }
  locks++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0 && saved) {
      html.style.overflow = saved.html;
      body.style.overflow = saved.body;
      saved = null;
    }
  };
}
