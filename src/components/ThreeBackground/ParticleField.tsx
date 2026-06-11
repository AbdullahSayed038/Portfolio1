import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNebula } from './particles';

interface ParticleFieldProps {
  reducedMotion: boolean;
  isMobile: boolean;
}

/* Drift + twinkle happen entirely in the vertex shader — zero CPU per frame. */
const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aPulse;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    float dr = 0.45;
    p.x += sin(uTime * aSpeed + aPhase) * dr;
    p.y += cos(uTime * aSpeed * 0.9 + aPhase * 1.3) * dr;
    p.z += sin(uTime * aSpeed * 0.7 + aPhase * 2.1) * dr;

    float twinkle = 0.78 + 0.22 * sin(uTime * (0.7 + aPulse) + aPhase * 7.0);
    float pulse = 1.0 + aPulse * 0.45 * sin(uTime * 1.6 + aPhase);
    vAlpha = aAlpha * twinkle;
    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * pulse * uPixelRatio * (42.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float core = smoothstep(0.5, 0.06, d);
    float halo = smoothstep(0.5, 0.22, d) * 0.45;
    float a = (core + halo) * vAlpha;
    if (a < 0.012) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export default function ParticleField({ reducedMotion, isMobile }: ParticleFieldProps) {
  const count = isMobile ? 900 : 2400;
  const data = useMemo(() => createNebula(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  );

  useFrame((state) => {
    if (reducedMotion) return;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[data.alphas, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
        <bufferAttribute attach="attributes-aPulse" args={[data.pulses, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
