import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

/** Counts from 0 → value once visible. Tween-based (no spring overshoot, never negative). */
export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.max(0, Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [isInView, value, suffix, duration, delay]);

  return <span ref={ref}>0{suffix}</span>;
}
