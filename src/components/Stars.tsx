// src/components/Stars.tsx
import { Html } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { Mesh, TextureLoader } from 'three';
import { starsData } from '../data/starsData';
import type { StarData } from '../data/starsData';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigationStore } from '../stores/navigationStore';

const Star: React.FC<StarData> = ({ id, position, texture, title, color, metalness, roughness }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentLanguage } = useLanguageStore();
  const { setView, isTransitioning, currentView, selectedStarId } = useNavigationStore();

  const tex = useLoader(TextureLoader, texture);

  const isSelected = currentView === 'star' && selectedStarId === id;
  const isReturningToHome = currentView === 'home' && isTransitioning;
  const showPlanetLabel = currentView !== 'star' && (!isMobile || currentView === 'home' || currentView === 'start');
  // The ship can be redirected mid-flight, so planets stay clickable while travelling.
  const canInteract = currentView !== 'star';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isReturningToHome) {
      setHovered(false);
    }
  }, [isReturningToHome]);

  useFrame((_) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      const scale = hovered && !isSelected ? 1.3 : 1;
      meshRef.current.scale.lerp({ x: scale, y: scale, z: scale } as any, 0.1);
    }
  });

  

  const handleClick = () => {
    if (canInteract) {
      setView('star', id);
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => {
          if (canInteract) setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
            map={tex}
            emissiveIntensity={hovered && !isSelected ? 0.6 : 0}
            color={color}
            emissive={color}
            metalness={metalness ?? 0}
            roughness={roughness ?? 1}
            toneMapped={true}
        />
      </mesh>
      
      {showPlanetLabel && (
        <Html 
        pointerEvents={canInteract ? 'auto' : 'none'}
        position={[0, 2, 0]} 
        >
          <div onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}
              onClick={handleClick} style={{
              background: 'rgba(49, 49, 49, 0.3)',
              padding: '8px 24px',
              whiteSpace: 'nowrap',
              opacity: 1,
              transition: 'opacity 0.5s ease',
              cursor: canInteract ? 'pointer' : 'default',
              pointerEvents: canInteract ? 'auto' : 'none'
              
          }}>
              {title[currentLanguage]}
          </div>
      </Html>
      )}
    </group>
  );
};

const Stars: React.FC = () => {
  return (
    <>
      {starsData.map((star) => (
        <Star
          key={star.id}
          {...star}
        />
      ))}
    </>
  );
};

export default Stars;
