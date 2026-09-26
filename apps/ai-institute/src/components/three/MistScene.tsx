"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * MistScene — Four Pillars atmospheric backdrop (D8).
 *
 * Low-poly ridge silhouettes (few MeshBasicMaterial planes in token dark
 * tones) + 2–3 translucent ivory planes drifting slowly as mist.
 *
 * Guards (same conventions as PillarSphere): prefers-reduced-motion or no
 * WebGL → static gradient div; off-screen → frameloop paused; DPR capped
 * at 2; lazy via next/dynamic (ssr: false) inside FourPillars.
 */

const RIDGE_BACK = "#0b2a22";
const RIDGE_FRONT = "#12352b";
const MIST = "#f7f4ec";

function ridgeGeometry(
  width: number,
  baseY: number,
  amp: number,
  phase: number,
): THREE.BufferGeometry {
  const segs = 28;
  const bottom = -3;
  const top = (i: number) =>
    baseY +
    Math.sin(i * 0.9 + phase) * amp +
    Math.sin(i * 2.3 + phase * 1.7) * amp * 0.45;
  const pos: number[] = [];
  for (let i = 0; i < segs; i++) {
    const x0 = (i / segs) * width - width / 2;
    const x1 = ((i + 1) / segs) * width - width / 2;
    const y0 = top(i);
    const y1 = top(i + 1);
    pos.push(x0, y0, 0, x1, y1, 0, x0, bottom, 0);
    pos.push(x1, y1, 0, x1, bottom, 0, x0, bottom, 0);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return geometry;
}

function Ridge({
  color,
  width,
  baseY,
  amp,
  phase,
}: {
  color: string;
  width: number;
  baseY: number;
  amp: number;
  phase: number;
}) {
  const geometry = useMemo(
    () => ridgeGeometry(width, baseY, amp, phase),
    [width, baseY, amp, phase],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

function MistPlane({
  y,
  speed,
  range,
  opacity,
}: {
  y: number;
  speed: number;
  range: number;
  opacity: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.x = Math.sin(t * speed + offset) * range;
  });

  return (
    <mesh ref={mesh} position={[0, y, 1]}>
      <planeGeometry args={[10, 1.6]} />
      <meshBasicMaterial
        color={MIST}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <Ridge
        color={RIDGE_BACK}
        width={14}
        baseY={-0.55}
        amp={0.5}
        phase={1.2}
      />
      <Ridge
        color={RIDGE_FRONT}
        width={14}
        baseY={-0.95}
        amp={0.35}
        phase={4.1}
      />
      {!reducedMotion && (
        <>
          <MistPlane y={-0.45} speed={0.12} range={1.6} opacity={0.07} />
          <MistPlane y={-0.75} speed={0.08} range={2.2} opacity={0.05} />
          <MistPlane y={-0.2} speed={0.16} range={1.2} opacity={0.04} />
        </>
      )}
    </>
  );
}

export default function MistScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [webgl] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(
        c.getContext("webgl2") ||
        c.getContext("webgl") ||
        c.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;
    const io = new IntersectionObserver(
      (entries) => setRunning(entries[0]?.isIntersecting ?? false),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  if (!webgl || reducedMotion) {
    return <div className="home-mist-fallback" aria-hidden="true" />;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={running ? "always" : "never"}
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
