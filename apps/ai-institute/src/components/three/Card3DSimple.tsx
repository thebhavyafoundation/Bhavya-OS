"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { EASING, PILLAR_COLORS } from "@/lib/three/setup";

interface Card3DSimpleProps {
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

interface CardSceneProps {
  children: React.ReactNode;
  pillar: string;
  scrollProgress: number;
  tiltIntensity: number;
  hoverScale: number;
  prefersReducedMotion: boolean;
}

/**
 * Simplified 3D Card Renderer
 */
export function Card3DSimple({
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
}: Card3DSimpleProps) {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 3] }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <CardScene
          pillar={pillar}
          scrollProgress={scrollProgress}
          tiltIntensity={tiltIntensity}
          hoverScale={hoverScale}
          prefersReducedMotion={prefersReducedMotion}
        >
          {children}
        </CardScene>
      </Suspense>
    </Canvas>
  );
}

function CardScene({
  children,
  pillar,
  scrollProgress,
  tiltIntensity,
  hoverScale,
  prefersReducedMotion,
}: CardSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

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

    const cardGeometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 4);
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

    const glowGeometry = new THREE.BoxGeometry(
      width + 0.02,
      height + 0.02,
      depth + 0.02,
    );
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#d4af37"),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);

    const contentGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
    const contentMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const contentMesh = new THREE.Mesh(contentGeometry, contentMaterial);
    contentMesh.position.z = depth / 2 + 0.01;

    const cardGroup = new THREE.Group();
    cardGroup.add(cardMesh);
    cardGroup.add(glowMesh);
    cardGroup.add(contentMesh);

    group.add(cardGroup);

    return () => {
      group.remove(cardGroup);
      cardGeometry.dispose();
      cardMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      contentGeometry.dispose();
      contentMaterial.dispose();
    };
  }, [pillar]);

  // Spring animation
  useFrame((_, delta) => {
    if (prefersReducedMotion) return;

    rotationRef.current.x +=
      (targetRotationRef.current.x - rotationRef.current.x) * 180 * delta;
    rotationRef.current.y +=
      (targetRotationRef.current.y - rotationRef.current.y) * 180 * delta;
    scaleRef.current +=
      (targetScaleRef.current - scaleRef.current) * 180 * delta;

    if (groupRef.current) {
      groupRef.current.rotation.x = rotationRef.current.x;
      groupRef.current.rotation.y = rotationRef.current.y;
      groupRef.current.scale.setScalar(scaleRef.current);
    }
  });

  // Scroll-based entrance animation
  useFrame(() => {
    if (scrollProgress > 0 && scrollProgress < 1) {
      const entranceProgress = Math.min(1, scrollProgress * 2);
      const eased = EASING.easeOutCubic(entranceProgress);

      if (groupRef.current) {
        groupRef.current.position.y = (1 - eased) * 2;
        groupRef.current.scale.setScalar(0.8 + eased * 0.2);
      }
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 3]} intensity={1} castShadow />
      <directionalLight position={[-2, 2, 2]} intensity={0.5} />
      <pointLight color="#d4af37" intensity={0.5} position={[0, 1, 2]} />

      <Html
        transform
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "var(--space-6)",
        }}
        wrapperClass="card-3d-content"
      >
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </Html>
    </group>
  );
}
