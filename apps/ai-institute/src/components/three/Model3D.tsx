"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import type { Group } from "three";

interface Model3DProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  floatIntensity?: number;
  autoRotate?: boolean;
}

function ModelLoader({ src }: { src: string }) {
  const [model, setModel] = useState<Group | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/loaders/DRACOLoader.js"),
        ]);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
        );
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        const gltf = await loader.loadAsync(src);
        if (!cancelled) setModel(gltf.scene);
      } catch {
        // load failure: render nothing
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

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
          <ModelLoader src={src} />
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
