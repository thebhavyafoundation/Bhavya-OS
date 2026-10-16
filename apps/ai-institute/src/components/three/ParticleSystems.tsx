"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PILLAR_COLORS, PILLAR_SCENES, NOISE } from "@/lib/three/setup";

interface ParticleSystemProps {
  pillar: "forest" | "knowledge" | "heritage" | "community";
  count?: number;
  size?: number;
  speed?: number;
  spread?: number;
  opacity?: number;
  blending?: boolean;
  depthWrite?: boolean;
  className?: string;
}

/**
 * Base particle system with configurable behavior per pillar
 */
export function ParticleSystem({
  pillar,
  count,
  size = 1,
  speed = 1,
  spread = 50,
  opacity = 0.6,
  blending = true,
  depthWrite = false,
}: ParticleSystemProps) {
  const config = PILLAR_SCENES[pillar];
  const colors = PILLAR_COLORS[pillar];
  const particleCount = count || config.particleCount;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const colorIndices = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    const maxLifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const radius = spread * (0.3 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = size * (0.5 + Math.random() * 1.5);
      opacities[i] = opacity * (0.3 + Math.random() * 0.7);
      colorIndices[i] = Math.floor(Math.random() * colors.particles.length);

      // Random velocity for organic motion
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Lifetime for recycling
      lifetimes[i] = 0;
      maxLifetimes[i] = 100 + Math.random() * 200;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("customOpacity", new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute("colorIndex", new THREE.BufferAttribute(colorIndices, 1));
    geo.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute("lifetime", new THREE.BufferAttribute(lifetimes, 1));
    geo.setAttribute("maxLifetime", new THREE.BufferAttribute(maxLifetimes, 1));

    return geo;
  }, [particleCount, size, spread, opacity, pillar]);

  const material = useMemo(() => {
    const colorArray = colors.particles.map((c) => new THREE.Color(c));
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite,
      blending: blending ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `
        attribute float size;
        attribute float customOpacity;
        attribute float colorIndex;
        varying float vOpacity;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec3 uColors[4];
        
        void main() {
          vOpacity = customOpacity;
          vColor = uColors[int(colorIndex)];
          
          vec3 pos = position;
          
          // Add organic motion based on pillar type
          float noiseX = sin(uTime * 0.3 + position.y * 0.05) * 0.5;
          float noiseY = cos(uTime * 0.2 + position.x * 0.05) * 0.5;
          float noiseZ = sin(uTime * 0.4 + position.z * 0.03) * 0.3;
          
          pos.x += noiseX * 0.1;
          pos.y += noiseY * 0.1 + sin(uTime * 0.1 + position.x * 0.02) * 0.2;
          pos.z += noiseZ * 0.1;
          
          // Lifetime-based recycling
          float lifeProgress = fract(uTime * 0.1 + colorIndex * 0.1);
          if (lifeProgress < 0.01) {
            // Reset position subtly
            pos.y += 10.0;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Soft edge with subtle glow
          float glow = 1.0 - smoothstep(0.3, 0.5, dist);
          
          gl_FragColor = vec4(vColor, alpha * vOpacity * (1.0 + glow * 0.3));
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: window.devicePixelRatio },
        uColors: { value: colorArray },
      },
    });
  }, [pillar, blending, depthWrite]);

  useFrame((state) => {
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return <points geometry={geometry} material={material} />;
}

/**
 * Forest-specific particle system - organic leaf/seed particles
 */
export function ForestParticleSystem(
  props: Omit<ParticleSystemProps, "pillar">,
) {
  return <ParticleSystem pillar="forest" {...props} />;
}

/**
 * Knowledge-specific particle system - neural network/data particles
 */
export function KnowledgeParticleSystem(
  props: Omit<ParticleSystemProps, "pillar">,
) {
  const config = PILLAR_SCENES.knowledge;
  const colors = PILLAR_COLORS.knowledge;
  const particleCount = props.count || config.particleCount;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const colorIndices = new Float32Array(particleCount);
    const connections = new Float32Array(particleCount * 2);

    const layers = 5;
    const nodesPerLayer = particleCount / layers;

    for (let i = 0; i < particleCount; i++) {
      const layer = Math.floor(i / nodesPerLayer);
      const nodeInLayer = i % nodesPerLayer;

      const z = (layer / (layers - 1) - 0.5) * (props.spread || 40);
      const radius = 15 + layer * 8;

      const angle = (nodeInLayer / nodesPerLayer) * Math.PI * 2;
      const r = radius * (0.5 + Math.random() * 0.5);

      positions[i * 3] = r * Math.cos(angle) + (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = r * Math.sin(angle) + (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 3;

      sizes[i] = (props.size || 1) * (0.3 + Math.random() * 0.8);
      opacities[i] = (props.opacity || 0.5) * (0.4 + Math.random() * 0.6);
      colorIndices[i] = Math.floor(Math.random() * colors.particles.length);

      if (layer < layers - 1) {
        connections[i * 2] = i;
        connections[i * 2 + 1] =
          i + nodesPerLayer + Math.floor(Math.random() * 3) - 1;
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("customOpacity", new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute("colorIndex", new THREE.BufferAttribute(colorIndices, 1));
    geo.setAttribute("connection", new THREE.BufferAttribute(connections, 2));

    return geo;
  }, [particleCount, props.size, props.spread, props.opacity]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        attribute float customOpacity;
        attribute float colorIndex;
        attribute vec2 connection;
        varying float vOpacity;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec3 uColors[4];
        
        void main() {
          vOpacity = customOpacity * (0.5 + 0.5 * sin(uTime * 0.5 + colorIndex));
          vColor = uColors[int(colorIndex)];
          
          vec3 pos = position;
          
          // Pulse animation
          float pulse = sin(uTime * 2.0 + colorIndex * 0.5) * 0.1 + 1.0;
          
          // Connection pulse
          float connPulse = sin(uTime * 3.0 + connection.x * 0.1) * 0.5 + 0.5;
          
          pos *= pulse;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * pulse * (150.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Neural glow
          float glow = 1.0 - smoothstep(0.2, 0.5, dist);
          
          gl_FragColor = vec4(vColor, alpha * vOpacity * (1.0 + glow * 0.5));
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: window.devicePixelRatio },
        uColors: { value: colors.particles.map((c) => new THREE.Color(c)) },
      },
    });
  }, [colors.particles]);

  useFrame((state) => {
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return <points geometry={geometry} material={material} />;
}

/**
 * Heritage-specific particle system - dust/mote particles
 */
export function HeritageParticleSystem(
  props: Omit<ParticleSystemProps, "pillar">,
) {
  return <ParticleSystem pillar="heritage" {...props} />;
}

/**
 * Community-specific particle system - connection particles
 */
export function CommunityParticleSystem(
  props: Omit<ParticleSystemProps, "pillar">,
) {
  return <ParticleSystem pillar="community" {...props} />;
}

/**
 * Connection lines between particles (for neural network effect)
 */
export function ConnectionLines({
  pillar,
  maxDistance = 30,
  opacity = 0.1,
  color,
}: {
  pillar: "forest" | "knowledge" | "heritage" | "community";
  maxDistance?: number;
  opacity?: number;
  color?: string;
}) {
  const colors = PILLAR_COLORS[pillar];
  const lineColor = color || colors.particles[0];

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(0);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(lineColor),
      opacity,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [lineColor, opacity]);

  return <lineSegments geometry={geometry} material={material} />;
}
