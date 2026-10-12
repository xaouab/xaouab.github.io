// src/components/Stars.tsx
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, BackSide, Color, Group, Mesh, ShaderMaterial, Vector3 } from 'three';
import { starsData } from '../data/starsData';
import type { StarData } from '../data/starsData';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigationStore } from '../stores/navigationStore';
import { useIsMobile } from '../util/useIsMobile';
import { wasJustDragged } from '../flight/look';

// Fresnel rim: bright at the silhouette, transparent facing the camera.
const createAtmosphere = (color: string) =>
  new ShaderMaterial({
    uniforms: { glowColor: { value: new Color(color) }, intensity: { value: 0.9 } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
        gl_FragColor = vec4(glowColor, rim * intensity);
      }`,
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

const Star: React.FC<StarData> = ({ id, position, title, color, metalness, roughness }) => {
  const groupRef = useRef<Group>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const { currentLanguage } = useLanguageStore();
  const { setView, isTransitioning, currentView } = useNavigationStore();

  const atmosphere = useMemo(() => createAtmosphere(color), [color]);
  const targetScale = useMemo(() => new Vector3(), []);
  useEffect(() => () => atmosphere.dispose(), [atmosphere]);

  const isReturningToHome = currentView === 'home' && isTransitioning;
  const showPlanetLabel = currentView !== 'star' && (!isMobile || currentView === 'home' || currentView === 'start');
  // The ship can be redirected mid-flight, so planets stay clickable while travelling.
  const canInteract = currentView !== 'star';

  useEffect(() => {
    if (isReturningToHome) setHovered(false);
  }, [isReturningToHome]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const s = hovered && canInteract ? 1.18 : 1;
    // Frame-rate independent critically-damped approach.
    groupRef.current.scale.lerp(targetScale.set(s, s, s), 1 - Math.exp(-delta * 10));
    const glow = (atmosphereRef.current?.material as ShaderMaterial | undefined)?.uniforms.intensity;
    if (glow) glow.value += ((hovered ? 1.6 : 0.9) - glow.value) * (1 - Math.exp(-delta * 8));
  });

  const handleClick = () => {
    // A drag that ends over a planet is a look gesture, not a selection.
    if (canInteract && !wasJustDragged()) setView('star', id);
  };

  const hoverHandlers = {
    onPointerOver: () => canInteract && setHovered(true),
    onPointerOut: () => setHovered(false),
  };

  useEffect(() => {
    if (!hovered) return;
    const canvas = document.querySelector('canvas');
    const previous = canvas?.style.cursor;
    if (canvas) canvas.style.cursor = 'pointer';
    return () => {
      if (canvas && canvas.style.cursor === 'pointer') canvas.style.cursor = previous ?? '';
    };
  }, [hovered]);

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh onClick={handleClick} {...hoverHandlers}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.08}
            metalness={metalness ?? 0}
            roughness={roughness ?? 0.6}
            clearcoat={0.6}
            clearcoatRoughness={0.4}
            sheen={1}
            sheenColor={color}
          />
        </mesh>
        <mesh ref={atmosphereRef} scale={1.22} material={atmosphere}>
          <sphereGeometry args={[0.5, 48, 48]} />
        </mesh>
      </group>

      {showPlanetLabel && (
        <Html position={[0, 1.4, 0]} center pointerEvents={canInteract ? 'auto' : 'none'}>
          <button
            type="button"
            className={`planet-label ${hovered ? 'hovered' : ''}`}
            style={{ '--accent': color } as React.CSSProperties}
            onClick={handleClick}
            {...hoverHandlers}
          >
            <span className="planet-glyph" aria-hidden />
            {title[currentLanguage]}
          </button>
        </Html>
      )}
    </group>
  );
};

const Stars: React.FC = () => (
  <>
    {starsData.map((star) => (
      <Star key={star.id} {...star} />
    ))}
  </>
);

export default Stars;
