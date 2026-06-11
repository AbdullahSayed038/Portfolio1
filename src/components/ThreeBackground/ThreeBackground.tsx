import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';
import ParticleField from './ParticleField';
import ProjectNodes from './ProjectNodes';
import TimelinePath from './TimelinePath';
import Beacon from './Beacon';
import { ChapterMap } from './path';
import styles from './ThreeBackground.module.css';

export default function ThreeBackground() {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React to resizes so particle density and interactions adapt live
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const chapterMap = useRef(new ChapterMap());

  // Map camera chapters to where sections actually sit in the page
  useEffect(() => {
    const measure = () => chapterMap.current.measure();
    measure();
    const settle = window.setTimeout(measure, 700); // after fonts/layout
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 62 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <CameraRig reducedMotion={reducedMotion} chapterMap={chapterMap} />
        <ParticleField reducedMotion={reducedMotion} isMobile={isMobile} />
        <ProjectNodes reducedMotion={reducedMotion} chapterMap={chapterMap} />
        <TimelinePath reducedMotion={reducedMotion} />
        <Beacon reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
