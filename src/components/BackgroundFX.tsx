import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  speed: number;
  phase: number;
  tint: number;
}
interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

/**
 * Full-page galaxy backdrop: drifting, twinkling stars + occasional shooting stars,
 * rendered on one lightweight canvas behind every section.
 */
export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let raf = 0;
    let last = 0;
    let nextShoot = 2500;

    const isSmall = window.innerWidth < 768;
    const makeStars = () => {
      const count = Math.round(Math.min(isSmall ? 90 : 230, (w * 260) / 1440));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.4 + Math.random() * 1.35) * (Math.random() < 0.06 ? 2 : 1),
        depth: 0.25 + Math.random() * 0.75,
        speed: 2 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2,
        tint: Math.random(),
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
    };
    resize();

    const draw = (time: number) => {
      const dt = last ? Math.min(48, time - last) : 16;
      last = time;
      ctx.clearRect(0, 0, w, h);

      if (!reduced) {
        stars.forEach((s) => {
          s.y += (s.speed * s.depth * dt) / 1000;
          if (s.y > h + 4) {
            s.y = -4;
            s.x = Math.random() * w;
          }
          const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(time / 1400 + s.phase));
          const alpha = twinkle * (0.25 + s.depth * 0.75);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.fill();

          if (s.r > 1.6) {
            const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
            g.addColorStop(0, `rgba(255,241,220,${(alpha * 0.5).toFixed(3)})`);
            g.addColorStop(1, "rgba(255,241,220,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      } else {
        stars.forEach((s) => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.25 + s.depth * 0.5})`;
          ctx.fill();
        });
      }

      // shooting stars
      if (!reduced) {
        nextShoot -= dt;
        if (nextShoot <= 0) {
          nextShoot = 5200 + Math.random() * 6500;
          shooters.push({
            x: Math.random() * w * 0.75,
            y: Math.random() * h * 0.4,
            vx: 3.6 + Math.random() * 2.4,
            vy: 1.5 + Math.random(),
            life: 0,
            max: 55 + Math.random() * 25,
          });
        }
        shooters = shooters.filter((sh) => sh.life < sh.max);
        shooters.forEach((sh) => {
          sh.life += 1;
          sh.x += sh.vx;
          sh.y += sh.vy;
          const fade = 1 - sh.life / sh.max;
          const len = 90 + sh.vx * 22;
          const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - len, sh.y - (len * sh.vy) / sh.vx);
          grad.addColorStop(0, `rgba(255,255,255,${(fade * 0.9).toFixed(3)})`);
          grad.addColorStop(0.35, `rgba(255,214,170,${(fade * 0.35).toFixed(3)})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(sh.x - len, sh.y - (len * sh.vy) / sh.vx);
          ctx.stroke();
        });
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#06060b]">
      {/* deep space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,#1a0f22_0%,#0a0810_45%,#06060b_100%)]" />

      {/* nebulae */}
      <div className="animate-aurora absolute -left-[18%] top-[2%] h-[62vh] w-[58vw] rounded-full bg-brand/[0.16] blur-[130px]" />
      <div className="animate-aurora-slow absolute -right-[12%] top-[38%] h-[56vh] w-[48vw] rounded-full bg-brand2/[0.11] blur-[140px]" />
      <div className="animate-aurora absolute bottom-[-10%] left-[22%] h-[50vh] w-[52vw] rounded-full bg-indigo-500/[0.10] blur-[150px]" />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* tiny dust speckles */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.75) 0.6px, transparent 0.7px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 85%)",
        }}
      />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
