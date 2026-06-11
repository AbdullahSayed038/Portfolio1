import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BEACON_POSITION } from './path';
import { makeGlowTexture } from './textures';

interface BeaconProps {
  reducedMotion: boolean;
}

/** The journey's destination: a single bright pulsing star. */
export default function Beacon({ reducedMotion }: BeaconProps) {
  const glowRef = useRef<THREE.Sprite>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowTexture = useMemo(() => makeGlowTexture(256), []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + 0.18 * Math.sin(t * 1.1);
    if (glowRef.current) glowRef.current.scale.set(10 * pulse, 10 * pulse, 1);
    if (coreRef.current) {
      const s = 1 + 0.1 * Math.sin(t * 1.7);
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={BEACON_POSITION}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshBasicMaterial color="#F3E3C2" transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <sprite ref={glowRef} scale={[10, 10, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#D4A96A"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}
