"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { readTokenColor } from "@/lib/three/tokenColor";
import { ThreeStage } from "@/components/three/ThreeStage";

interface Hero3DCanvasProps {
  band: string;
  moduleId?: string;
  assetUrl?: string;
  sceneConfig: { preset: string; positions: number[][] };
}

/*
 * Band colouring is decoration, not meaning — it is the one place in this
 * scene where colour carries no information a reader depends on. It still
 * resolves through canonical tokens rather than literals, because a raw hex in
 * a component is exactly the drift the token system exists to prevent.
 */
const BAND_TOKEN: Record<string, string> = {
  "junior-a": "--color-status-success",
  "junior-b": "--color-status-warning",
  "0": "--color-accent-green",
  "1": "--color-accent-green",
  "2": "--color-accent-green",
  "3": "--color-status-warning",
  "4": "--color-accent-green",
  "5": "--color-accent-green",
  "6": "--color-status-warning",
  "7": "--color-accent-gold",
};

/**
 * Resolve the model URL.
 *
 * The previous expression read:
 *
 *   assetUrl || moduleId ? `/models/.../${moduleId}.glb` : `/models/.../hero.glb`
 *
 * which parses as `(assetUrl || moduleId) ? a : b`. A caller who supplied
 * `assetUrl` got it ignored and a derived path loaded instead — so an explicit
 * asset could never be used, and a wrong path silently failed. The intent is
 * plainly "explicit URL wins, otherwise derive", so that is what this does.
 */
function resolveModelUrl({
  band,
  moduleId,
  assetUrl,
}: Pick<Hero3DCanvasProps, "band" | "moduleId" | "assetUrl">): string {
  if (assetUrl) return assetUrl;
  return `/models/curriculum/${band}/${moduleId ?? "hero"}.glb`;
}

function HeroModel({ src }: { src: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null);

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
        // §6. Fetching the decoder from a third-party CDN at runtime is not the
        // approved asset boundary; B2 is. Re-hosting is an asset-delivery
        // decision and is not made here.
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
        );
        const gltf = await new GLTFLoader()
          .setDRACOLoader(dracoLoader)
          .loadAsync(src);
        if (!cancelled) setModel(gltf.scene);
      } catch {
        // Leave `model` null. The stage poster stands in.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  /*
   * GPU memory is not reclaimed when a scene is simply dropped. Every visit to
   * a curriculum hero would otherwise keep its geometry and materials alive.
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

  if (!model) return null;
  return <primitive object={model} dispose={null} />;
}

function CurriculumParticles3D({
  count = 100,
  band = "0",
}: {
  count?: number;
  band?: string;
}) {
  const points = useRef<THREE.Points | null>(null);

  // `count` was accepted and ignored: the buffers were always sized for 100
  // regardless of what the caller asked for, so a caller passing 30 got 100.
  const [{ geometry, material }] = useState(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const token = BAND_TOKEN[band] ?? BAND_TOKEN["0"];
    const resolved = readTokenColor(token, "#0e382e");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sizes[i] = Math.random() * 3 + 1;
      colors[i * 3] = resolved.r;
      colors[i * 3 + 1] = resolved.g;
      colors[i * 3 + 2] = resolved.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const m = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    return { geometry: g, material: m };
  });

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    const target = points.current;
    if (!target) return;
    target.rotation.y += delta * 0.02;
    // The whole reason `points` keeps a ref is this loop; without the guard
    // the geometry attribute work ran against a detached object on unmount.
    const positions = target.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setY(i, y + Math.sin(Date.now() * 0.001 + i) * 0.002);
    }
    positions.needsUpdate = true;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

function CurriculumHeroScene({
  band,
  moduleId,
  assetUrl,
  sceneConfig,
}: Hero3DCanvasProps) {
  const src = resolveModelUrl({ band, moduleId, assetUrl });

  return (
    <>
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.8}>
          <group position={[0, -0.5, 0]} scale={1.2}>
            <HeroModel src={src} />
          </group>
        </Float>
      </Suspense>

      <CurriculumParticles3D count={50} band={band} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.8} />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.3}
        scale={15}
        blur={3}
        far={5}
      />
      {/* PLATFORM-TRUTH DEVIATION — drei resolves `preset` from its own asset
          CDN at runtime, which is not the approved B2 boundary. It also
          changes the lighting, so it cannot be swapped without visual review. */}
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

export function Hero3DCanvas({
  band,
  moduleId,
  assetUrl,
  sceneConfig,
}: Hero3DCanvasProps) {
  return (
    <ThreeStage
      poster={
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-bg-tertiary)",
          }}
        />
      }
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <CurriculumHeroScene
        band={band}
        moduleId={moduleId}
        assetUrl={assetUrl}
        sceneConfig={sceneConfig}
      />
    </ThreeStage>
  );
}

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
