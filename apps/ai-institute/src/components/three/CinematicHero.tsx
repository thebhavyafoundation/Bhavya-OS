"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import {
  PILLAR_SCENES,
  PILLAR_COLORS,
  CAMERA_CONFIGS,
  createLightingPreset,
} from "@/lib/three/setup";
import {
  ForestParticleSystem,
  KnowledgeParticleSystem,
  HeritageParticleSystem,
  CommunityParticleSystem,
  ParticleSystem,
} from "./ParticleSystems";

const CANVAS_CONFIG = {
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: false,
};

interface CinematicHeroProps {
  pillar: "forest" | "knowledge" | "heritage" | "community" | "home";
  scrollProgress?: number;
  mousePosition?: { x: number; y: number };
  reducedMotion?: boolean;
  scrollParallax?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function CinematicHero({
  pillar,
  scrollProgress = 0,
  mousePosition = { x: 0, y: 0 },
  reducedMotion = false,
  className,
  children,
}: CinematicHeroProps) {
  const config = PILLAR_SCENES[pillar === "home" ? "forest" : pillar];
  const colors = PILLAR_COLORS[pillar === "home" ? "forest" : pillar];

  const cameraConfig = useMemo(
    () => ({
      ...CAMERA_CONFIGS.hero,
      position: [0, 2, 30] as [number, number, number],
    }),
    [],
  );

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={cameraConfig}
        gl={CANVAS_CONFIG}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Suspense fallback={<SceneLoader pillar={pillar} />}>
          <CinematicScene
            pillar={pillar}
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        {children && (
          <Html
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              pointerEvents: "none",
            }}
            wrapperClass="cinematic-hero-content"
          >
            {children}
          </Html>
        )}
      </Canvas>

      <div
        className={`cinematic-fallback ${reducedMotion ? "visible" : ""}`}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
          opacity: reducedMotion ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function SceneLoader({ pillar }: { pillar: string }) {
  const colors =
    PILLAR_COLORS[
      (pillar === "home" ? "forest" : pillar) as keyof typeof PILLAR_COLORS
    ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: `3px solid ${colors.gold}`,
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function CinematicScene({
  pillar,
  scrollProgress,
  mousePosition,
  reducedMotion,
}: {
  pillar: string;
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  reducedMotion: boolean;
}) {
  const { camera, scene } = useThree();
  const config = PILLAR_SCENES[pillar as keyof typeof PILLAR_SCENES];
  const timeRef = useRef(0);

  useEffect(() => {
    if (!config) return;

    scene.background = new THREE.Color(config.backgroundColor);
    scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);

    const lights = createLightingPreset("hero");
    lights.forEach((light) => scene.add(light));

    return () => {
      lights.forEach((light) => scene.remove(light));
    };
  }, [pillar, config, scene]);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();
    const scrollY = scrollProgress * 20;
    const scrollX = Math.sin(scrollProgress * Math.PI * 2) * 5;
    const mouseX = mousePosition.x * 3;
    const mouseY = mousePosition.y * 2;

    const targetX = scrollX + mouseX;
    const targetY = 2 + scrollY * 0.1 + mouseY;
    const targetZ = 30 + scrollProgress * 10;

    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
    camera.lookAt(0, 2 + scrollY * 0.1, 0);

    if (pillar === "forest" || pillar === "community") {
      camera.rotation.z = Math.sin(t * 0.1) * 0.02;
    }
  });

  const activePillar = pillar === "home" ? "forest" : pillar;

  switch (activePillar) {
    case "forest":
      return (
        <ForestEnvironment
          time={timeRef.current}
          scrollProgress={scrollProgress}
        />
      );
    case "knowledge":
      return (
        <KnowledgeEnvironment
          time={timeRef.current}
          scrollProgress={scrollProgress}
        />
      );
    case "heritage":
      return (
        <HeritageEnvironment
          time={timeRef.current}
          scrollProgress={scrollProgress}
        />
      );
    case "community":
      return (
        <CommunityEnvironment
          time={timeRef.current}
          scrollProgress={scrollProgress}
        />
      );
    default:
      return <DefaultEnvironment time={timeRef.current} />;
  }
}

function ForestEnvironment({
  time,
  scrollProgress,
}: {
  time: number;
  scrollProgress: number;
}) {
  return (
    <>
      <ForestGround time={time} scrollProgress={scrollProgress} />
      <ForestParticleSystem count={1500} spread={80} size={0.8} opacity={0.4} />
      <FogVolume color="#0a1a12" density={0.02} height={50} />
    </>
  );
}

function KnowledgeEnvironment({
  time,
  scrollProgress,
}: {
  time: number;
  scrollProgress: number;
}) {
  return (
    <>
      <KnowledgeParticleSystem
        count={1200}
        spread={60}
        size={0.6}
        opacity={0.5}
      />
      <AmbientGlow color="#1e3d6a" intensity={0.3} />
    </>
  );
}

function HeritageEnvironment({
  time,
  scrollProgress,
}: {
  time: number;
  scrollProgress: number;
}) {
  return (
    <>
      <HeritageParticleSystem
        count={800}
        spread={100}
        size={0.5}
        opacity={0.3}
      />
      <FogVolume color="#0d0805" density={0.015} height={60} />
    </>
  );
}

function CommunityEnvironment({
  time,
  scrollProgress,
}: {
  time: number;
  scrollProgress: number;
}) {
  return (
    <>
      <CommunityParticleSystem
        count={1800}
        spread={70}
        size={0.7}
        opacity={0.45}
      />
      <AmbientGlow color="#2d8a45" intensity={0.4} />
    </>
  );
}

function DefaultEnvironment({ time }: { time: number }) {
  return (
    <>
      <ParticleSystem
        pillar="forest"
        count={2000}
        spread={100}
        size={0.5}
        opacity={0.3}
      />
      <AmbientGlow color="#0e382e" intensity={0.2} />
    </>
  );
}

function ForestGround({
  time,
  scrollProgress,
}: {
  time: number;
  scrollProgress: number;
}) {
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(200, 200, 100, 100),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a1a12",
        roughness: 0.9,
        metalness: 0.05,
      }),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, -2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    />
  );
}

function AmbientGlow({
  color,
  intensity,
}: {
  color: string;
  intensity: number;
}) {
  return (
    <pointLight
      color={color}
      intensity={intensity * 50}
      distance={100}
      decay={2}
      position={[0, 10, 0]}
    />
  );
}

function FogVolume({
  color,
  density,
}: {
  color: string;
  density: number;
  height?: number;
}) {
  return <fogExp2 args={[color, density]} />;
}
