import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="bg-brand-gradient fixed left-0 right-0 top-0 z-[200] h-[2px] origin-left"
    />
  );
}
