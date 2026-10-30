import { useEffect, useRef, useState } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  warm: boolean;
}

/**
 * Elegant "comet" cursor:
 *  - soft gradient aura that trails the pointer
 *  - crisp white dot + thin rotating gradient ring
 *  - a trail of tiny fading stardust sparks (canvas)
 *  - over interactive items the ring becomes a gradient bubble with a label
 */
export default function CustomCursor() {
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    const label = labelRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !aura || !label || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let ax = -100;
    let ay = -100;
    let first = true;
    let lastSpawn = { x: -999, y: -999 };
    let current: HTMLElement | null = null;
    let raf = 0;
    const sparks: Spark[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (first) {
        first = false;
        rx = ax = mx;
        ry = ay = my;
      }
      root.classList.add("cursor-on");
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      // spawn stardust only while actually moving
      if (Math.hypot(mx - lastSpawn.x, my - lastSpawn.y) > 7) {
        lastSpawn = { x: mx, y: my };
        sparks.push({
          x: mx + (Math.random() - 0.5) * 8,
          y: my + (Math.random() - 0.5) * 8,
          vx: -0.9 + (Math.random() - 0.5) * 1.4,
          vy: -1.1 + (Math.random() - 0.5) * 1.4,
          life: 0,
          max: 34 + Math.random() * 26,
          size: 0.8 + Math.random() * 1.8,
          warm: Math.random() < 0.4,
        });
        if (sparks.length > 70) sparks.shift();
      }
    };

    const setTarget = (el: HTMLElement | null) => {
      current = el;
      // data-cursor-hide: get out of the way completely (e.g. the robot button,
      // so its hover animation stays visible) — only the tiny dot remains
      const hide = !!el && el.hasAttribute("data-cursor-hide");
      const text = hide ? "" : el?.dataset.cursor ?? "";
      label.textContent = text;
      ring.classList.toggle("is-hidden", hide);
      ring.classList.toggle("is-hover", !!el && !hide && !text);
      ring.classList.toggle("has-label", !!el && !hide && !!text);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (el && el !== current) setTarget(el);
    };
    const onOut = (e: MouseEvent) => {
      if (!current) return;
      const to = e.relatedTarget as HTMLElement | null;
      if (!to || !current.contains(to)) setTarget(to?.closest?.<HTMLElement>("[data-cursor]") ?? null);
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => root.classList.remove("cursor-on");

    const cssVar = (n: string, fallback: string) =>
      getComputedStyle(root).getPropertyValue(n).trim() || fallback;
    let colA = cssVar("--a", "#f43f5e");
    let colB = cssVar("--b", "#fb923c");

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ax += (mx - ax) * 0.085;
      ay += (my - ay) * 0.085;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      aura.style.transform = `translate3d(${ax}px, ${ay}px, 0) translate(-50%, -50%)`;

      if (current && !current.isConnected) setTarget(null);

      ctx.clearRect(0, 0, w, h);
      colA = cssVar("--a", colA);
      colB = cssVar("--b", colB);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        const t = 1 - s.life / s.max;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
        g.addColorStop(0, `rgba(255,255,255,${(t * 0.85).toFixed(3)})`);
        g.addColorStop(0.45, s.warm ? `rgba(255,214,170,${(t * 0.45).toFixed(3)})` : "rgba(255,255,255,0)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = t * (s.warm ? 0.55 : 0.4);
        ctx.fillStyle = s.warm ? colB : colA;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.7, s.size * 0.8), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("cursor-on");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[9990]" />
      <div
        ref={auraRef}
        className="pointer-events-none fixed left-0 top-0 z-[9992] h-24 w-24 rounded-full opacity-70 blur-2xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--a) 55%, transparent), transparent 70%)" }}
      />
      <div ref={ringRef} className="c-ring">
        <span className="c-ring-glow" />
        <span ref={labelRef} className="c-label" />
      </div>
      <div ref={dotRef} className="c-dot" />
    </>
  );
}
