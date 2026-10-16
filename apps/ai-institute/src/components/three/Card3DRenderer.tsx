"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Suspense, useRef, useEffect, useMemo } from "react";
import { EASING, PILLAR_COLORS } from "@/lib/three/setup";

interface Card3DRendererProps {
  children: React.ReactNode;
  pillar: string;
  isHovered: boolean;
  isPressed: boolean;
  scrollProgress: number;
  tiltIntensity: number;
  hoverScale: number;
  showGlow: boolean;
  glowColor: string;
  prefersReducedMotion: boolean;
}

/**
 * 3D Card Renderer - Renders a single card in 3D space
 * Uses Canvas internally for proper Three.js context
 */
export function Card3DRenderer({
  children,
  pillar,
  isHovered,
  isPressed,
  scrollProgress,
  tiltIntensity,
  hoverScale,
  showGlow,
  glowColor,
  prefersReducedMotion,
}: Card3DRendererProps) {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 3] }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      <Suspense fallback={null}>
        <CardScene
          pillar={pillar}
          isHovered={isHovered}
          isPressed={isPressed}
          scrollProgress={scrollProgress}
          tiltIntensity={tiltIntensity}
          hoverScale={hoverScale}
          showGlow={showGlow}
          glowColor={glowColor}
          prefersReducedMotion={prefersReducedMotion}
        >
          {children}
        </CardScene>
      </Suspense>
    </Canvas>
  );
}

interface CardSceneProps {
  children: React.ReactNode;
  pillar: string;
  isHovered: boolean;
  isPressed: boolean;
  scrollProgress: number;
  tiltIntensity: number;
  hoverScale: number;
  showGlow: boolean;
  glowColor: string;
  prefersReducedMotion: boolean;
}

function CardScene({
  children,
  pillar,
  isHovered,
  isPressed,
  scrollProgress,
  tiltIntensity,
  hoverScale,
  showGlow,
  glowColor,
  prefersReducedMotion,
}: CardSceneProps) {
  const colors = PILLAR_COLORS[pillar as keyof typeof PILLAR_COLORS];
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Card dimensions
  const width = 1;
  const height = 1 / 1.5;
  const depth = 0.05;

  // Spring animation state
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  // Initialize scene
  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const colors = PILLAR_COLORS[pillar as keyof typeof PILLAR_COLORS];

    // Card base geometry
    const cardGeometry = new RoundedBoxGeometry(width, height, depth, 0.08, 4);
    const cardMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.primary,
      metalness: 0,
      roughness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95,
    });

    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;

    // Glow effect
    let glowMesh: THREE.Mesh | null = null;
    const glowGeometry = new RoundedBoxGeometry(
      width + 0.02,
      height + 0.02,
      depth + 0.02,
      0.1,
      4,
    );
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#d4af37"),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);

    // Content plane for HTML overlay
    const contentGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
    const contentMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const contentMesh = new THREE.Mesh(contentGeometry, contentMaterial);
    contentMesh.position.z = depth / 2 + 0.01;

    group.add(cardMesh);
    if (glowMesh) group.add(glowMesh);
    group.add(contentMesh);
    glowRef.current = glowMesh;

    return () => {
      group.remove(cardMesh);
      if (glowMesh) group.remove(glowMesh);
      group.remove(contentMesh);
      cardGeometry.dispose();
      cardMaterial.dispose();
      if (glowMesh) {
        glowGeometry.dispose();
        glowMaterial.dispose();
      }
      contentGeometry.dispose();
      contentMaterial.dispose();
    };
  }, [pillar]);

  // Spring animation for tilt
  useFrame((_, delta) => {
    if (prefersReducedMotion) return;

    const currentRotation = rotationRef.current;
    const targetRotation = targetRotationRef.current;
    const currentScale = scaleRef.current;
    const targetScale = targetScaleRef.current;

    const damping = 0.15;
    const stiffness = 0.3;

    currentRotation.x += (targetRotation.x - currentRotation.x) * stiffness;
    currentRotation.y += (targetRotation.y - currentRotation.y) * stiffness;

    if (groupRef.current) {
      groupRef.current.rotation.x = currentRotation.x;
      groupRef.current.rotation.y = currentRotation.y;
    }

    const scaleDamping = 0.2;
    const scaleStiffness = 0.4;
    scaleRef.current += (targetScale - currentScale) * scaleStiffness;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
    }
  });

  const handleMouseMove = (e: ThreeEvent<PointerEvent>) => {
    if (prefersReducedMotion || !groupRef.current) return;

    const rect = (e.nativeEvent.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (e.nativeEvent.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.nativeEvent.clientY - centerY) / (rect.height / 2);

    targetRotationRef.current.x = -mouseY * ((tiltIntensity * Math.PI) / 180);
    targetRotationRef.current.y = mouseX * ((tiltIntensity * Math.PI) / 180);
  };

  const handleMouseLeave = () => {
    targetRotationRef.current.x = 0;
    targetRotationRef.current.y = 0;
    targetScaleRef.current = 1;
  };

  const handleMouseEnter = () => {
    targetScaleRef.current = hoverScale;
  };

  return (
    <group
      ref={groupRef}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
      onPointerEnter={handleMouseEnter}
    >
      <Html
        wrapperClass="card3d-content"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </Html>
    </group>
  );
}
