import { useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projects } from '../../data/projects';
import { CONSTELLATION_CENTER, NODE_LOCAL, ChapterMap } from './path';
import { makeGlowTexture, makeLabelSprite } from './textures';
import { useScrollProgress } from './useScrollProgress';

interface ProjectNodesProps {
  reducedMotion: boolean;
  chapterMap: MutableRefObject<ChapterMap>;
}

const AMBER = new THREE.Color('#D4A96A');
const CREAM = new THREE.Color('#F3E3C2');
const tmpScale = new THREE.Vector3();

/**
 * The five projects as glowing nodes in a constellation. The node whose
 * card is currently on screen grows, brightens, and spins faster.
 */
export default function ProjectNodes({ reducedMotion, chapterMap }: ProjectNodesProps) {
  const scrollRef = useScrollProgress();
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const shellRefs = useRef<(THREE.Mesh | null)[]>([]);
  const glowRefs = useRef<(THREE.Sprite | null)[]>([]);

  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const labels = useMemo(
    () => projects.map((p) => makeLabelSprite(p.name)),
    []
  );

  /* Faint lines connecting every pair of nodes */
  const linePositions = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < NODE_LOCAL.length; i++) {
      for (let j = i + 1; j < NODE_LOCAL.length; j++) {
        out.push(...NODE_LOCAL[i], ...NODE_LOCAL[j]);
      }
    }
    return new Float32Array(out);
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    /* Which project card is on screen right now? */
    const [a, b] = chapterMap.current.workSpan();
    const p = scrollRef.current;
    const span = b - a;
    let active = -1;
    if (span > 0 && p >= a - 0.02 && p <= b + 0.02) {
      active = Math.max(0, Math.min(4, Math.floor(((p - a) / span) * 5)));
    }

    for (let i = 0; i < NODE_LOCAL.length; i++) {
      const node = nodeRefs.current[i];
      const shell = shellRefs.current[i];
      const glow = glowRefs.current[i];
      const isActive = i === active;
      if (node) {
        const target = isActive ? 1.25 : 1;
        tmpScale.setScalar(target);
        node.scale.lerp(tmpScale, 0.08);
        node.position.y = NODE_LOCAL[i][1] + Math.sin(t * 0.7 + i * 1.7) * 0.12;
      }
      if (shell) {
        shell.rotation.x += (isActive ? 0.012 : 0.003) + i * 0.0004;
        shell.rotation.y += (isActive ? 0.016 : 0.004);
        (shell.material as THREE.MeshBasicMaterial).opacity = isActive ? 0.85 : 0.4;
      }
      if (glow) {
        const mat = glow.material as THREE.SpriteMaterial;
        // While zoomed into one node, dim the rest so auras never merge
        const targetOpacity = isActive ? 0.8 : active !== -1 ? 0.14 : 0.35;
        mat.opacity += (targetOpacity - mat.opacity) * 0.08;
        const targetScale = isActive ? 4.4 : 3.1;
        glow.scale.x += (targetScale - glow.scale.x) * 0.08;
        glow.scale.y += (targetScale - glow.scale.y) * 0.08;
      }
    }
  });

  return (
    <group ref={groupRef} position={CONSTELLATION_CENTER}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={AMBER}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {NODE_LOCAL.map((pos, i) => (
        <group key={projects[i].id} position={pos} ref={(el) => (nodeRefs.current[i] = el)}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={CREAM} transparent opacity={0.95} depthWrite={false} />
          </mesh>
          <mesh ref={(el) => (shellRefs.current[i] = el)}>
            <icosahedronGeometry args={[0.85, 1]} />
            <meshBasicMaterial
              color={AMBER}
              wireframe
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
          <sprite
            ref={(el) => (glowRefs.current[i] = el)}
            scale={[3.1, 3.1, 1]}
          >
            <spriteMaterial
              map={glowTexture}
              color={AMBER}
              transparent
              opacity={0.35}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <primitive object={labels[i]} position={[0, 1.45, 0]} />
        </group>
      ))}
    </group>
  );
}
