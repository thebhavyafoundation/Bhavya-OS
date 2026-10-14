"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export { OrbitControls };

/**
 * Three.js / WebGL Setup Utilities
 * Provides consistent configuration for all 3D scenes
 */

export const CANVAS_CONFIG = {
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: false,
  powerPreference: "high-performance" as const,
};

export const RENDERER_CONFIG = {
  dpr: [1, 2],
  logarithmicDepthBuffer: true,
  physicallyCorrectLights: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
};

/**
 * Camera configurations for different scene types
 */
export const CAMERA_CONFIGS = {
  hero: {
    fov: 50,
    near: 0.1,
    far: 200,
    position: [0, 0, 30],
  },
  card: {
    fov: 45,
    near: 0.1,
    far: 100,
    position: [0, 0, 20],
  },
  immersive: {
    fov: 60,
    near: 0.01,
    far: 500,
    position: [0, 1.6, 0],
  },
};

/**
 * Common Three.js geometries and materials
 */
export const GEOMETRIES = {
  plane: (w = 100, h = 100, ws = 50, hs = 50) =>
    new THREE.PlaneGeometry(w, h, ws, hs),
  sphere: (r = 1, ws = 32, hs = 32) =>
    new THREE.SphereGeometry(r, ws, hs),
  box: (w = 1, h = 1, d = 1) => new THREE.BoxGeometry(w, h, d),
  cone: (r = 1, h = 2, rs = 8) => new THREE.ConeGeometry(r, h, rs),
  cylinder: (rt = 1, rb = 1, h = 2, rs = 8) =>
    new THREE.CylinderGeometry(rt, rb, h, rs),
  torus: (r = 1, t = 0.4, rs = 16, ts = 100) =>
    new THREE.TorusGeometry(r, t, rs, ts),
};

export const MATERIALS = {
  standard: (color: string, opacity = 1, transparent = false) =>
    new THREE.MeshStandardMaterial({
      color,
      opacity,
      transparent,
      metalness: 0.1,
      roughness: 0.8,
    }),
  physical: (color: string) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      transmission: 0.1,
      thickness: 0.5,
    }),
  basic: (color: string, opacity = 1) =>
    new THREE.MeshBasicMaterial({ color, opacity, transparent: opacity < 1 }),
  points: (color: string, size = 1, opacity = 1) =>
    new THREE.PointsMaterial({
      color,
      size,
      opacity,
      transparent: opacity < 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  line: (color: string, opacity = 1) =>
    new THREE.LineBasicMaterial({ color, opacity, transparent: opacity < 1 }),
};

/**
 * Lighting presets
 */
export function createLightingPreset(type: "hero" | "card" | "immersive" | "dramatic") {
  const lights: THREE.Light[] = [];

  switch (type) {
    case "hero": {
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      const dir1 = new THREE.DirectionalLight(0xffffff, 1);
      dir1.position.set(5, 10, 7);
      const dir2 = new THREE.DirectionalLight(0xffd700, 0.3);
      dir2.position.set(-5, 5, -5);
      const hemi = new THREE.HemisphereLight(0x87ceeb, 0x8fbc8f, 0.4);
      lights.push(ambient, dir1, dir2, hemi);
      break;
    }
    case "card": {
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(3, 5, 3);
      const point = new THREE.PointLight(0xffd700, 0.5, 10);
      point.position.set(0, 2, 2);
      lights.push(ambient, dir, point);
      break;
    }
    case "immersive": {
      const ambient = new THREE.AmbientLight(0x222233, 0.3);
      const dir1 = new THREE.DirectionalLight(0xfff5e6, 1.5);
      dir1.position.set(50, 100, 50);
      const dir2 = new THREE.DirectionalLight(0x8fbc8f, 0.5);
      dir2.position.set(-50, 50, -50);
      const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3d2b1f, 0.6);
      lights.push(ambient, dir1, dir2, hemi);
      break;
    }
    case "dramatic": {
      const ambient = new THREE.AmbientLight(0x111111, 0.2);
      const spot = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 6, 0.5, 1);
      spot.position.set(0, 20, 20);
      spot.target.position.set(0, 0, 0);
      const point1 = new THREE.PointLight(0xffd700, 1, 50);
      point1.position.set(0, 10, 0);
      const point2 = new THREE.PointLight(0x8fbc8f, 0.8, 40);
      point2.position.set(-10, 5, 10);
      lights.push(ambient, spot, point1, point2);
      break;
    }
  }

  return lights;
}

/**
 * Post-processing effects (to be used with @react-three/postprocessing)
 */
export const POST_PROCESSING_CONFIG = {
  bloom: {
    intensity: 0.5,
    radius: 0.4,
    threshold: 0.8,
  },
  vignette: {
    eskil: true,
    offset: 0.3,
    darkness: 1.2,
  },
  chromaticAberration: {
    offset: [0.001, 0.001],
  },
};

/**
 * Shader utilities for custom materials
 */
export const SHADERS = {
  // Particle vertex shader with size attenuation
  particleVertex: `
    attribute float size;
    attribute float customOpacity;
    varying float vOpacity;
    varying vec3 vColor;
    uniform float uTime;
    uniform float uPixelRatio;
    
    void main() {
      vOpacity = customOpacity;
      vec3 pos = position;
      // Add subtle floating motion
      pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.1;
      pos.x += cos(uTime * 0.3 + position.y * 0.1) * 0.05;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  // Particle fragment shader with soft edges
  particleFragment: `
    varying float vOpacity;
    uniform vec3 uColor;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      gl_FragColor = vec4(uColor, alpha * vOpacity);
    }
  `,

  // Atmospheric fog shader
  fogVertex: `
    varying float vDepth;
    void main() {
      vDepth = gl_FragCoord.z / gl_FragCoord.w;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fogFragment: `
    varying float vDepth;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    
    void main() {
      float fogFactor = smoothstep(uFogNear, uFogFar, vDepth);
      gl_FragColor = vec4(uFogColor, fogFactor);
    }
  `,
};

/**
 * Animation utilities
 */
export const EASING = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutExpo: (t: number) =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

/**
 * Intersection Observer hook for scroll-triggered animations
 */
export function useScrollTrigger(
  threshold = 0.1,
  rootMargin = "0px"
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}

/**
 * Mouse position hook for interactive 3D elements
 */
export function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return mouse;
}

/**
 * Scroll progress hook (0 to 1)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollTop / docHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

/**
 * Reduced motion check
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useFrame(() => {
    frameRef.current++;
    const now = performance.now();
    if (now - lastTimeRef.current >= 1000) {
      setFps(Math.round((frameRef.current * 1000) / (now - lastTimeRef.current)));
      frameRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  return fps;
}

/**
 * Asset loading utilities
 */
export async function loadGLTF(url: string): Promise<THREE.Group> {
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  return gltf.scene;
}

export async function loadTexture(url: string): Promise<THREE.Texture> {
  return new THREE.TextureLoader().loadAsync(url);
}

export async function loadHDRI(url: string): Promise<THREE.Texture> {
  const { RGBELoader } = await import("three/examples/jsm/loaders/RGBELoader.js");
  const loader = new RGBELoader();
  const texture = await loader.loadAsync(url);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

/**
 * Noise functions for procedural generation
 */
export const NOISE = {
  // Simple 2D noise for vertex displacement
  simplex2D: (x: number, y: number, scale = 1) => {
    const n = Math.sin(x * scale * 12.9898 + y * scale * 78.233) * 43758.5453;
    return n - Math.floor(n);
  },

  // 3D noise for volume effects
  simplex3D: (x: number, y: number, z: number, scale = 1) => {
    const n =
      Math.sin(
        x * scale * 12.9898 +
          y * scale * 78.233 +
          z * scale * 37.719
      ) * 43758.5453;
    return n - Math.floor(n);
  },

  // Fractal Brownian Motion for terrain
  fbm: (x: number, y: number, octaves = 4, persistence = 0.5) => {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * NOISE.simplex2D(x * frequency, y * frequency);
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return value / maxValue;
  },
};

/**
 * Color palettes for each pillar
 */
export const PILLAR_COLORS = {
  forest: {
    primary: "#0e382e",
    secondary: "#1a6b30",
    accent: "#2d8a45",
    highlight: "#7cba8d",
    gold: "#d4af37",
    particles: ["#2d8a45", "#7cba8d", "#a8d1b3", "#d4af37"],
    fog: "#0a1a12",
  },
  knowledge: {
    primary: "#0a1628",
    secondary: "#122240",
    accent: "#1e3d6a",
    highlight: "#234a7a",
    gold: "#d4af37",
    particles: ["#234a7a", "#3d6bc0", "#6ba3d6", "#d4af37"],
    fog: "#05101f",
  },
  heritage: {
    primary: "#1a0f08",
    secondary: "#2d1a0e",
    accent: "#4d301e",
    highlight: "#8a6b4a",
    gold: "#d4af37",
    particles: ["#8a6b4a", "#a88b6b", "#c4a87a", "#d4af37"],
    fog: "#0d0805",
  },
  community: {
    primary: "#0e382e",
    secondary: "#1a6b30",
    accent: "#2d8a45",
    highlight: "#7cba8d",
    gold: "#d4af37",
    particles: ["#2d8a45", "#d4af37", "#ff8c42", "#e85d75"],
    fog: "#0a1a12",
  },
};

/**
 * Scene configuration for each pillar
 */
export interface PillarSceneConfig {
  name: string;
  backgroundColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  particleCount: number;
  particleColors: string[];
  ambientLight: { color: string; intensity: number };
  directionalLights: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
  }>;
  environmentMap?: string;
}

export const PILLAR_SCENES: Record<string, PillarSceneConfig> = {
  forest: {
    name: "forest",
    backgroundColor: "#0a1a12",
    fogColor: "#0a1a12",
    fogNear: 20,
    fogFar: 100,
    particleCount: 2000,
    particleColors: ["#2d8a45", "#7cba8d", "#a8d1b3", "#d4af37"],
    ambientLight: { color: "#1a3a2a", intensity: 0.4 },
    directionalLights: [
      { color: "#ffffff", intensity: 1.2, position: [50, 100, 50] },
      { color: "#8fbc8f", intensity: 0.5, position: [-50, 50, -50] },
      { color: "#d4af37", intensity: 0.3, position: [0, 30, 20] },
    ],
  },
  knowledge: {
    name: "knowledge",
    backgroundColor: "#05101f",
    fogColor: "#05101f",
    fogNear: 15,
    fogFar: 80,
    particleCount: 1500,
    particleColors: ["#234a7a", "#3d6bc0", "#6ba3d6", "#d4af37"],
    ambientLight: { color: "#0d1a30", intensity: 0.3 },
    directionalLights: [
      { color: "#ffffff", intensity: 1, position: [30, 80, 30] },
      { color: "#3d6bc0", intensity: 0.6, position: [-30, 40, -30] },
      { color: "#d4af37", intensity: 0.4, position: [0, 20, 15] },
    ],
  },
  heritage: {
    name: "heritage",
    backgroundColor: "#0d0805",
    fogColor: "#0d0805",
    fogNear: 25,
    fogFar: 120,
    particleCount: 1000,
    particleColors: ["#8a6b4a", "#a88b6b", "#c4a87a", "#d4af37"],
    ambientLight: { color: "#1a1208", intensity: 0.3 },
    directionalLights: [
      { color: "#fff8e8", intensity: 1, position: [40, 80, 40] },
      { color: "#8a6b4a", intensity: 0.4, position: [-40, 50, -40] },
      { color: "#d4af37", intensity: 0.5, position: [0, 25, 20] },
    ],
  },
  community: {
    name: "community",
    backgroundColor: "#0a1a12",
    fogColor: "#0a1a12",
    fogNear: 20,
    fogFar: 100,
    particleCount: 2000,
    particleColors: ["#2d8a45", "#d4af37", "#ff8c42", "#e85d75"],
    ambientLight: { color: "#1a3a2a", intensity: 0.4 },
    directionalLights: [
      { color: "#ffffff", intensity: 1.2, position: [50, 100, 50] },
      { color: "#ff8c42", intensity: 0.4, position: [-50, 50, -50] },
      { color: "#d4af37", intensity: 0.5, position: [0, 30, 20] },
    ],
  },
};

/**
 * Export all utilities as a single namespace
 */
export const ThreeUtils = {
  CANVAS_CONFIG,
  RENDERER_CONFIG,
  CAMERA_CONFIGS,
  GEOMETRIES,
  MATERIALS,
  createLightingPreset,
  POST_PROCESSING_CONFIG,
  SHADERS,
  EASING,
  useScrollTrigger,
  useMousePosition,
  useScrollProgress,
  useReducedMotion,
  usePerformanceMonitor,
  loadGLTF,
  loadTexture,
  loadHDRI,
  NOISE,
  PILLAR_COLORS,
  PILLAR_SCENES,
};