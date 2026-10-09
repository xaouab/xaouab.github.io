// src/components/SpaceScene.tsx
import { Environment } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CubeTextureLoader, Vector3 } from 'three';
import { starsData } from '../data/starsData';
import { ChaseCamera } from '../flight/ChaseCamera';
import { FlightController } from '../flight/FlightController';
import { telemetry } from '../flight/telemetry';
import { useNavigationStore } from '../stores/navigationStore';
import GalaxyBackground from './GalaxyBackground';
import Spacecraft from './Spacecraft';
import Stars from './Stars';
import WarpEffects from './WarpEffects';

// Update these paths to match your six skybox textures.
// Order must be: +X, -X, +Y, -Y, +Z, -Z
const SKYBOX_FACES = [
  '/textures/skybox/px.webp',
  '/textures/skybox/nx.webp',
  '/textures/skybox/py.webp',
  '/textures/skybox/ny.webp',
  '/textures/skybox/pz.webp',
  '/textures/skybox/nz.webp',
];

// Update order matters: flight and camera advance before anything that reads
// them (the ship renders from the same state), so the ship never jitters
// against the camera. Negative priority runs first without taking over rendering.
const FLIGHT_FRAME_PRIORITY = -1;

const SpaceScene: React.FC = () => {
  const { camera, scene } = useThree();
  const currentView = useNavigationStore((s) => s.currentView);
  const selectedStarId = useNavigationStore((s) => s.selectedStarId);
  const setTransitioning = useNavigationStore((s) => s.setTransitioning);

  const flight = useMemo(
    () =>
      new FlightController(
        starsData.map((star) => ({ id: star.id, center: new Vector3(...star.position) }))
      ),
    []
  );
  const chaseCamera = useMemo(() => new ChaseCamera(), []);
  const wasManeuvering = useRef<boolean | null>(null);

  const [skyboxTexture] = useLoader(CubeTextureLoader, [SKYBOX_FACES]);
  skyboxTexture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    scene.background = skyboxTexture;
    (scene as any).backgroundIntensity = 0.5;

    return () => {
      (scene as any).backgroundIntensity = 1;
    };
  }, [scene, skyboxTexture]);

  useEffect(() => {
    if (currentView === 'star' && selectedStarId) flight.goToPlanet(selectedStarId);
    else flight.goHome();
  }, [currentView, selectedStarId, flight]);

  useFrame((_, delta) => {
    flight.update(delta);
    chaseCamera.update(camera as THREE.PerspectiveCamera, flight, delta);
    telemetry.progress = flight.transferProgress;

    const maneuvering = flight.isManeuvering;
    if (maneuvering !== wasManeuvering.current) {
      wasManeuvering.current = maneuvering;
      setTransitioning(maneuvering);
    }
  }, FLIGHT_FRAME_PRIORITY);

  return (
    <>
      <ambientLight intensity={0.15} />

      <directionalLight
        position={[10, 5, 10]}
        intensity={3}
        castShadow
      />
      <Environment preset="sunset" />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <GalaxyBackground />
      <Stars />
      <Spacecraft flight={flight} />
      <WarpEffects />
    </>
  );
};

export default SpaceScene;
