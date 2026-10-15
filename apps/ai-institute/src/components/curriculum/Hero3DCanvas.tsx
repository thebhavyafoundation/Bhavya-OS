"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion/apple-springs";

interface Hero3DCanvasProps {
  band: string;
  moduleId?: string;
  assetUrl?: string;
  sceneConfig: { preset: string; positions: number[][] };
}

function Hero3DModel({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatIntensity = 1,
  autoRotate = true,
}: {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  floatIntensity?: number;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  if (!model) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} dispose={null} />
    </group>
  );
}

function ModelLoader({ src }: { src: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null);

  const dracoLoader = useRef(new DRACOLoader());
  dracoLoader.current.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
  );

  const gltfLoader = useRef(
    new GLTFLoader().setDRACOLoader(dracoLoader.current),
  );

  useEffect(() => {
    let cancelled = false;

    const loadModel = async () => {
      try {
        const gltf = await gltfLoader.current.loadAsync(src);
        if (!cancelled) setModel(gltf.scene);
      } catch {
        // Load failure - render nothing
      }
    };

    loadModel();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return model ? <primitive object={model} dispose={null} /> : null;
}

function CurriculumHeroScene({
  band,
  moduleId,
  assetUrl,
  sceneConfig,
}: Hero3DCanvasProps) {
  const gltf = useLoader(
    GLTFLoader,
    assetUrl || moduleId
      ? `/models/curriculum/${band}/${moduleId || "default"}.glb`
      : `/models/curriculum/${band}/hero.glb`,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
      );
      loader.setDRACOLoader(dracoLoader);
    },
  );

  return (
    <>
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.8}>
          <group position={[0, -0.5, 0]} scale={1.2}>
            <primitive object={gltf.scene} dispose={null} />
          </group>
        </Float>
      </Suspense>

      <CurriculumParticles3D count={50} band={band} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#c9a84c" />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.3}
        scale={15}
        blur={3}
        far={5}
      />
      <Environment
        preset={
          (sceneConfig.preset || "forest") as
            | "forest"
            | "sunset"
            | "city"
            | "park"
            | "night"
            | "apartment"
            | "dawn"
            | "lobby"
            | "studio"
            | "warehouse"
        }
      />
    </>
  );
}

function CurriculumParticles3D({
  count = 100,
  band = "0",
}: {
  count?: number;
  band?: string;
}) {
  const particles = useRef<THREE.Points | null>(null);
  const [geometry] = useState(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    const sizes = new Float32Array(100);
    const colors = new Float32Array(100 * 3);

    const bandColors: Record<string, THREE.Color> = {
      "junior-a": new THREE.Color(0x10b981),
      "junior-b": new THREE.Color(0xf59e0b),
      "0": new THREE.Color(0x0e382e),
      "1": new THREE.Color(0x0e382e),
      "2": new THREE.Color(0x0e382e),
      "3": new THREE.Color(0xf59e0b),
      "4": new THREE.Color(0x0e382e),
      "5": new THREE.Color(0x0e382e),
      "6": new THREE.Color(0xf59e0b),
      "7": new THREE.Color(0xc8a94a),
    };

    const color =
      bandColors[band] || bandColors["0"] || new THREE.Color(0x0e382e);

    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sizes[i] = Math.random() * 3 + 1;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  });

  const [material] = useState(
    () =>
      new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      }),
  );

  useFrame((_, delta) => {
    if (particles.current) {
      particles.current.rotation.y += delta * 0.02;
      const positions = particles.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        positions.setY(i, y + Math.sin(Date.now() * 0.001 + i) * 0.002);
      }
      positions.needsUpdate = true;
    }
  });

  return <points ref={particles} geometry={geometry} material={material} />;
}

export function Hero3DCanvas({
  band,
  moduleId,
  assetUrl,
  sceneConfig,
}: Hero3DCanvasProps) {
  const prefersReduced = prefersReducedMotion();

  if (prefersReduced) {
    return (
      <div style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <CurriculumHeroScene
            band={band}
            moduleId={moduleId}
            assetUrl={assetUrl}
            sceneConfig={sceneConfig}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

const bandColors: Record<string, THREE.Color> = {
  "junior-a": new THREE.Color(0x10b981),
  "junior-b": new THREE.Color(0xf59e0b),
  "0": new THREE.Color(0x0e382e),
  "1": new THREE.Color(0x0e382e),
  "2": new THREE.Color(0x0e382e),
  "3": new THREE.Color(0xf59e0b),
  "4": new THREE.Color(0x0e382e),
  "5": new THREE.Color(0x0e382e),
  "6": new THREE.Color(0xf59e0b),
  "7": new THREE.Color(0xc8a94a),
};

const environmentPresets: Record<string, string> = {
  forest: "forest",
  sunset: "sunset",
  city: "city",
  park: "park",
  night: "night",
};

export function CurriculumHero3DContent({
  band = "0",
  moduleId,
  assetUrl,
  sceneConfig,
}: Hero3DCanvasProps) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Hero3DCanvas
        band={band}
        moduleId={moduleId}
        assetUrl={assetUrl}
        sceneConfig={sceneConfig}
      />
    </div>
  );
}
