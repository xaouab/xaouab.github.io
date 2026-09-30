import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Point size is in world units and ignores parent scale, so scaled ships pass sizeScale.
const FireParticles: React.FC<{ intensity: 'high' | 'low'; sizeScale?: number }> = ({ intensity, sizeScale = 1 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const count = intensity === 'high' ? 400 : 100;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = Math.random() * 0.01 + 0.003;

      lifetimes[i] = Math.random() * 0.8 + 0.2;

      const heat = Math.random();
      colors[i3] = 1;
      colors[i3 + 1] = 0.35 + heat * 0.45;
      colors[i3 + 2] = 0.08 + (1 - heat) * 0.45;
    }

    return { positions, velocities, lifetimes, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;

    const baseSpeed = intensity === 'high' ? 0.3 : 0.1;
    const movementScale = 0.1;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      particles.lifetimes[i] -= delta * (intensity === 'high' ? 2.4 : 2);

      if (particles.lifetimes[i] <= 0) {
        positions[i3] = (Math.random() - 0.5) * 0.05;
        positions[i3 + 1] = (Math.random() - 0.5) * 0.05;
        positions[i3 + 2] = 0;

        const spread = intensity === 'high' ? 0.07 : 0.03;
        particles.velocities[i3] = (Math.random() - 0.5) * spread;
        particles.velocities[i3 + 1] = Math.random() * baseSpeed + 0.005;
        particles.velocities[i3 + 2] = (Math.random() - 0.5) * spread;

        particles.lifetimes[i] = 0.3 + Math.random() * 0.8;

        const heat = Math.random();
        colors[i3] = 1;
        colors[i3 + 1] = 0.35 + heat * 0.45;
        colors[i3 + 2] = 0.08 + (1 - heat) * 0.45;
      } else {
        positions[i3] += particles.velocities[i3] * movementScale;
        positions[i3 + 1] += particles.velocities[i3 + 1] * movementScale;
        positions[i3 + 2] += particles.velocities[i3 + 2] * movementScale;

        particles.velocities[i3] *= 0.992;
        particles.velocities[i3 + 1] *= 0.992;
        particles.velocities[i3 + 2] *= 0.985;

        const fade = THREE.MathUtils.clamp(particles.lifetimes[i], 0, 1);
        colors[i3 + 1] *= 0.998;
        colors[i3 + 2] = Math.max(colors[i3 + 2] * 0.996, 0.04 * fade);
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        vertexColors
        size={(intensity === 'high' ? 0.05 : 0.04) * sizeScale}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default FireParticles;
