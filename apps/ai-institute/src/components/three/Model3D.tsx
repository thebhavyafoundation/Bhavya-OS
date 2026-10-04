"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import type { Group } from "three";

interface Model3DProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  floatIntensity?: number;
  autoRotate?: boolean;
}

function Model({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatIntensity = 1,
  autoRotate = true,
}: Model3DProps) {
  const groupRef = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const handleLoad = (loadedModel: Group) => {
    setModel(loadedModel);
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={floatIntensity}>
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        {model && <primitive object={model} />}
      </group>
    </Float>
  );
}

function ModelLoader({ src, onLoad }: { src: string; onLoad: (model: Group) => void }) {
  const [model, setModel] = useState<Group | null>(null);

  const loadModel = async () => {
    try {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(src);
      setModel(gltf.scene);
      onLoad(gltf.scene);
    } catch {
      // Model failed to load - render nothing
    }
  };

  loadModel();

  return model ? <primitive object={model} /> : null;
}

export function Model3D({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatIntensity = 1,
  autoRotate = true,
}: Model3DProps) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#c9a84c" />
          <ModelLoader src={src} onLoad={() => {}} />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          <Environment preset="forest" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function Hero3D({ src }: { src: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}
    >
      <Model3D
        src={src}
        scale={1.5}
        position={[0, -0.5, 0]}
        floatIntensity={0.5}
        autoRotate={true}
      />
    </div>
  );
}
