// src/scene/PlanetFeatures.tsx
//
// Decorations around a planet: ring, moons, a satellite, a cloud layer.
// The ship orbits every planet at radius 1.15 in its equatorial plane, so
// rings and satellites stay inside ~0.95 and moons orbit well outside 1.5.
// None of these take pointer events; the planet body is the click target.
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { DoubleSide, Group, Mesh, RingGeometry } from 'three';
import { cloudLayer, planetSurface, ringBands } from './planetSurfaces';

export type PlanetFeature =
  | { kind: 'ring'; inner: number; outer: number; tilt: number }
  | { kind: 'moons'; moons: { radius: number; size: number; speed: number; tilt: number; phase: number }[] }
  | { kind: 'satellite'; radius: number; tilt: number }
  | { kind: 'clouds' };

const noRaycast = () => null;

const Ring: React.FC<{ inner: number; outer: number; tilt: number; color: string }> = ({ inner, outer, tilt, color }) => {
  const geometry = useMemo(() => {
    const g = new RingGeometry(inner, outer, 128, 1);
    // Remap UVs radially so the band texture runs from the inner to the outer edge.
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    return g;
  }, [inner, outer]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2 + tilt, 0, tilt * 0.6]} raycast={noRaycast}>
      <meshStandardMaterial
        map={ringBands(color)}
        transparent
        side={DoubleSide}
        depthWrite={false}
        roughness={0.9}
      />
    </mesh>
  );
};

const Moon: React.FC<{ radius: number; size: number; speed: number; tilt: number; phase: number }> = ({
  radius,
  size,
  speed,
  tilt,
  phase,
}) => {
  const pivot = useRef<Group>(null);
  useFrame((_, dt) => {
    if (pivot.current) pivot.current.rotation.y += speed * dt;
  });
  return (
    <group rotation={[tilt, 0, tilt * 0.5]}>
      <group ref={pivot} rotation={[0, phase, 0]}>
        <mesh position={[radius, 0, 0]} raycast={noRaycast}>
          <sphereGeometry args={[size, 24, 24]} />
          <meshStandardMaterial map={planetSurface('cratered', '#b9b4c4')} roughness={1} />
        </mesh>
      </group>
    </group>
  );
};

const Satellite: React.FC<{ radius: number; tilt: number; color: string }> = ({ radius, tilt, color }) => {
  const pivot = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (pivot.current) pivot.current.rotation.y += 0.55 * dt;
    if (body.current) body.current.rotation.x += 0.8 * dt;
  });
  return (
    <group rotation={[tilt, 0, 0]}>
      <group ref={pivot}>
        <group position={[radius, 0, 0]} scale={0.045}>
          <mesh ref={body} raycast={noRaycast}>
            <boxGeometry args={[1, 1, 1.4]} />
            <meshStandardMaterial color="#e8e6ef" metalness={0.6} roughness={0.35} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 1.9, 0, 0]} raycast={noRaycast}>
              <boxGeometry args={[2.4, 0.06, 1]} />
              <meshStandardMaterial color="#2b4f9e" emissive={color} emissiveIntensity={0.15} metalness={0.3} roughness={0.4} />
            </mesh>
          ))}
          <mesh position={[0, 0.85, 0]} raycast={noRaycast}>
            <cylinderGeometry args={[0.05, 0.05, 0.9, 6]} />
            <meshStandardMaterial color="#e8e6ef" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const Clouds: React.FC = () => {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += 0.02 * dt;
  });
  return (
    <mesh ref={ref} scale={1.035} raycast={noRaycast}>
      <sphereGeometry args={[0.5, 48, 48]} />
      <meshStandardMaterial map={cloudLayer()} transparent depthWrite={false} roughness={1} />
    </mesh>
  );
};

const PlanetFeatures: React.FC<{ features: PlanetFeature[]; color: string }> = ({ features, color }) => (
  <>
    {features.map((f, i) => {
      switch (f.kind) {
        case 'ring':
          return <Ring key={i} {...f} color={color} />;
        case 'moons':
          return f.moons.map((m, j) => <Moon key={`${i}-${j}`} {...m} />);
        case 'satellite':
          return <Satellite key={i} {...f} color={color} />;
        case 'clouds':
          return <Clouds key={i} />;
      }
    })}
  </>
);

export default PlanetFeatures;
