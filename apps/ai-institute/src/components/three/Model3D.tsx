"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import { ThreeStage } from "./ThreeStage";

interface Model3DProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /**
   * How much the model drifts when `autoRotate` is on, in world units.
   * Previously accepted and then ignored.
   */
  floatIntensity?: number;
  autoRotate?: boolean;
  /** Text alternative when the model conveys something. Omit for decoration. */
  description?: string;
}

function ModelLoader({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatIntensity = 1,
  autoRotate = true,
}: Omit<Model3DProps, "description">) {
  const [model, setModel] = useState<Group | null>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/loaders/DRACOLoader.js"),
        ]);
        const dracoLoader = new DRACOLoader();
        // PLATFORM-TRUTH DEVIATION — see docs/experience/3D-INTEGRATION-AUDIT.md
        // §6. This fetches a decoder binary from a third-party CDN at runtime.
        // The platform position is that large assets are served from Backblaze
        // B2, so this host is unapproved. Re-hosting the decoder from the
        // `three` package's own `examples/jsm/libs/draco/` is the fix, but it
        // is an asset-delivery decision and not taken here.
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
        );
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        const gltf = await loader.loadAsync(src);
        if (!cancelled) setModel(gltf.scene);
      } catch {
        // Load failure leaves `model` null. The stage shows its poster
        // instead, which is why the poster is not optional in ThreeStage.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  /*
   * Disposal.
   *
   * GPU memory is not reclaimed when a scene is dropped. An assignment
   * module that visits several 3D lessons in one sitting would otherwise
   * accumulate every model, its geometries and its textures until the tab
   * runs out. Geometry is disposed here; textures are shared between the
   * material and the GPU cache, so they are released via `dispose()` on the
   * material itself.
   */
  useEffect(() => {
    if (!model) return;
    const scene = model;
    return () => {
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
    };
  }, [model]);

  useFrame((_, delta) => {
    const target = group.current;
    if (!target) return;
    if (autoRotate) target.rotation.y += delta * 0.25;
    if (floatIntensity && floatIntensity > 0) {
      target.position.y =
        position[1] + Math.sin(performance.now() / 1000) * floatIntensity * 0.1;
    }
  });

  if (!model) return null;

  return (
    <group ref={group} scale={scale} position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

export function Model3D({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatIntensity = 1,
  autoRotate = true,
  description,
}: Model3DProps) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
      <ThreeStage
        // A model that has not loaded, cannot load, or must not animate is a
        // reserved grey plate — not a blank rectangle. The caller's own
        // Suspense fallback covers the dynamic-import case separately.
        poster={
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "300px",
              background: "var(--color-bg-tertiary)",
              borderRadius: "var(--radius-md)",
            }}
          />
        }
        camera={{ position: [0, 0, 5], fov: 45 }}
        description={description}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#c9a84c" />
          <ModelLoader
            src={src}
            scale={scale}
            position={position}
            rotation={rotation}
            floatIntensity={floatIntensity}
            autoRotate={autoRotate}
          />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          {/* PLATFORM-TRUTH DEVIATION — drei's `preset` fetches an HDRI from a
              third-party asset CDN at runtime. B2 is the approved large-asset
              store. Replacing it changes the look, so it needs visual review
              rather than a unilateral change. Documented, not fixed. */}
          <Environment preset="forest" />
        </Suspense>
      </ThreeStage>
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
