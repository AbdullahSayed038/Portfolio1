import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeGlowTexture, makeLabelSprite } from './textures';

interface TimelinePathProps {
  reducedMotion: boolean;
}

const PHASES = ['C & Systems', 'Networking', 'Full-Stack', 'AI/ML', 'Now'] as const;

const WAYPOINTS = [
  new THREE.Vector3(-5, 0.2, -50),
  new THREE.Vector3(-2.5, 1.2, -54),
  new THREE.Vector3(0, 0.4, -57),
  new THREE.Vector3(2.5, 1.4, -60),
  new THREE.Vector3(5, 0.6, -64),
];

const AMBER = new THREE.Color('#D4A96A');
const CREAM = new THREE.Color('#F3E3C2');

/**
 * The 42 journey rendered in 3D: a winding luminous path with five
 * marker stars, one per phase, floating beside the Journey section.
 */
export default function TimelinePath({ reducedMotion }: TimelinePathProps) {
  const markerRefs = useRef<(THREE.Group | null)[]>([]);
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const labels = useMemo(() => PHASES.map((p) => makeLabelSprite(p, '#D4A96A')), []);

  const pathLine = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(WAYPOINTS, false, 'catmullrom', 0.5);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
    const material = new THREE.LineBasicMaterial({
      color: AMBER,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geometry, material);
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    markerRefs.current.forEach((marker, i) => {
      if (!marker) return;
      marker.position.y = WAYPOINTS[i].y + Math.sin(t * 0.8 + i * 1.4) * 0.18;
      const s = 1 + 0.12 * Math.sin(t * 1.3 + i * 2.1);
      marker.scale.set(s, s, s);
    });
  });

  return (
    <group>
      <primitive object={pathLine} />
      {WAYPOINTS.map((pos, i) => (
        <group
          key={PHASES[i]}
          position={pos}
          ref={(el) => (markerRefs.current[i] = el)}
        >
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial color={CREAM} transparent opacity={0.95} depthWrite={false} />
          </mesh>
          <sprite scale={[1.8, 1.8, 1]}>
            <spriteMaterial
              map={glowTexture}
              color={AMBER}
              transparent
              opacity={0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <primitive object={labels[i]} position={[0, 0.85, 0]} />
        </group>
      ))}
    </group>
  );
}
