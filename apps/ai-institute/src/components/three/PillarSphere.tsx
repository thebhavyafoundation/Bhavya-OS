"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * PillarSphere — Structure beat's 3D signature moment.
 *
 * Procedural points only (no textures): a forest-tinted particle sphere with
 * four gold node clusters = four pillars. Brand palette values match
 * tokens.css: gold #d4af37 / #e8c04a, forest #0e382e.
 *
 * Guards: WebGL unavailable → renders nothing (CSS radial fallback remains);
 * prefers-reduced-motion → static frame; off-screen → frameloop paused;
 * DPR capped at 2; lazy via next/dynamic (ssr: false).
 */

const GOLD_LIGHT = "#e8c04a";
const FOREST_DEEP = "#0e382e";
const FOREST_HAZE = "#2d5a4a";

function buildGeometry() {
  const baseCount = 1400;
  const clusterCount = 70;
  const anchors = [
    new THREE.Vector3(1, 0.35, 0).normalize(),
    new THREE.Vector3(-0.8, 0.6, 0.45).normalize(),
    new THREE.Vector3(-0.4, -0.75, -0.55).normalize(),
    new THREE.Vector3(0.55, -0.4, 0.85).normalize(),
  ];

  const gold = new THREE.Color(GOLD_LIGHT);
  const forest = new THREE.Color(FOREST_DEEP);
  const haze = new THREE.Color(FOREST_HAZE);

  const positions: number[] = [];
  const colors: number[] = [];
  const push = (v: THREE.Vector3, c: THREE.Color) => {
    positions.push(v.x, v.y, v.z);
    colors.push(c.r, c.g, c.b);
  };

  const golden = Math.PI * (1 - Math.sqrt(5));
  for (let i = 0; i < baseCount; i++) {
    const y = 1 - (i / (baseCount - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const v = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
    push(v, i % 3 === 0 ? haze : forest);
  }

  for (const anchor of anchors) {
    const tangent = new THREE.Vector3(0, 1, 0).cross(anchor);
    if (tangent.lengthSq() < 0.01) tangent.set(1, 0, 0);
    tangent.normalize();
    const bitangent = anchor.clone().cross(tangent).normalize();
    for (let i = 0; i < clusterCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const spread = Math.pow(Math.random(), 0.6) * 0.28;
      const v = anchor
        .clone()
        .addScaledVector(tangent, Math.cos(a) * spread)
        .addScaledVector(bitangent, Math.sin(a) * spread)
        .normalize()
        .multiplyScalar(1.02);
      push(v, gold);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function Sphere({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const geometry = useMemo(() => buildGeometry(), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.1;
    const targetX = pointer.current.y * 0.18;
    const targetZ = -pointer.current.x * 0.12;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function PillarSphere() {
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

  if (!webgl) return null;

  return (
    <div ref={containerRef} className="pillarsphere" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        frameloop={reducedMotion ? "demand" : running ? "always" : "never"}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Sphere reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
