import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

/** Soft round sprite so every particle glows instead of looking like a square. */
function useGlow() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.22, "rgba(255,255,255,0.9)");
    g.addColorStop(0.5, "rgba(255,255,255,0.28)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function SpiralGalaxy({ a, b }: { a: string; b: string }) {
  const glow = useGlow();
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Points>(null);
  const placed = useRef(false);
  const { size, viewport } = useThree();

  const { positions, colors } = useMemo(() => {
    // mobile e kome jay — natun phone eo smooth cholte hobe
    const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
    const count = isSmall ? 3800 : 11000;
    const arms = 3;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const ca = new THREE.Color(a);
    const cb = new THREE.Color(b);
    const warm = new THREE.Color("#fff1d6");
    const white = new THREE.Color("#ffffff");
    const rand = (x: number) => (Math.random() - 0.5) * x;

    for (let i = 0; i < count; i++) {
      const t = Math.pow(Math.random(), 0.62); // denser toward the core
      const radius = 0.35 + t * 5.2;
      const branch = (i % arms) * ((Math.PI * 2) / arms);
      const angle = radius * 1.35 + branch + rand(0.55);
      const spread = 0.12 + radius * 0.16;

      positions[i * 3] = Math.cos(angle) * radius + rand(spread);
      positions[i * 3 + 1] = rand(0.22 + (1 - t) * 0.5);
      positions[i * 3 + 2] = Math.sin(angle) * radius + rand(spread);

      const c = new THREE.Color();
      if (t < 0.16) c.copy(warm).lerp(white, Math.random() * 0.45);
      else if (i % 2 === 0) c.copy(ca).lerp(cb, Math.random() * 0.7);
      else c.copy(cb).lerp(white, Math.random() * 0.45);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

    }
    return { positions, colors };
  }, [a, b]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const wide = size.width >= 1024;
    const mid = size.width >= 640;

    const targetX = wide ? viewport.width * 0.21 : mid ? 0 : viewport.width * 0.24;
    const targetY = wide ? 0.1 : mid ? 1.15 : viewport.height * 0.26;
    const targetS = wide ? 0.92 : mid ? 0.72 : 0.55;

    // snap on the first frame so it never slides across the headline
    const k = placed.current ? 1 - Math.pow(0.0025, delta) : 1;
    placed.current = true;

    g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY, k);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetS, k));
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -1.02 + state.pointer.y * 0.12, k);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0.22 + state.pointer.x * 0.08, k);
    if (spin.current) spin.current.rotation.y += delta * 0.06;
    if (g.userData.core) (g.userData.core as THREE.Sprite).material.opacity = 0.55 + Math.sin(t * 1.3) * 0.12;
  });

  return (
    <group ref={group}>
      <points ref={spin}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glow}
          size={0.075}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* glowing core */}
      <sprite scale={[3.4, 3.4, 1]} ref={(s) => { if (s && group.current) group.current.userData.core = s; }}>
        <spriteMaterial map={glow} color={a} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite scale={[1.15, 1.15, 1]}>
        <spriteMaterial map={glow} color="#fff4e0" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Scene() {
  const { a, b } = useTheme();
  return (
    <>
      <ambientLight intensity={0.4} />
      <SpiralGalaxy a={a} b={b} />
      <Stars radius={70} depth={45} count={2200} factor={3.6} saturation={0} fade speed={0.35} />
      <SparkleField />
    </>
  );
}

/** A handful of near stars that drift gently for depth. */
function SparkleField() {
  const glow = useGlow();
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 260;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 5 + Math.random() * 7;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.cos(ph);
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    return arr;
  }, []);

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={glow} size={0.09} color="#ffffff" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={isSmall ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 7.6], fov: 45 }}
        gl={{ antialias: !isSmall, alpha: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
