import { useEffect, useRef, useState } from 'react';
import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import { projects } from '../../data/projects';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Zoom mode: wide screens with motion enabled */
function useZoomMode(): boolean {
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1100px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setZoom(wide.matches && !reduced.matches);
    update();
    wide.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);
  return zoom;
}

function Heading() {
  const { ref, style } = useReveal();
  return (
    <animated.div ref={ref} style={style} className={styles.heading}>
      <h2 className={styles.title}>Work</h2>
      <p className={styles.subtitle}>
        Five builds — from a C inference engine to shipped products.
      </p>
    </animated.div>
  );
}

/**
 * Desktop: the section is tall and the viewport sticks. As you scroll,
 * the camera (in CameraRig) flies to each project node; while it holds,
 * that project's card opens beside it, then closes before the next leg.
 * Card timing mirrors workParam() in ThreeBackground/path.ts.
 */
function ZoomProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [u, setU] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      const journey = document.getElementById('journey');
      if (!el || !journey) return;
      const workTop = el.getBoundingClientRect().top + window.scrollY;
      const journeyTop = journey.getBoundingClientRect().top + window.scrollY;
      const span = journeyTop - workTop;
      if (span <= 0) return;
      setU(clamp01((window.scrollY + window.innerHeight * 0.45 - workTop) / span));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className={`${styles.projects} ${styles.zoom}`} id="work" ref={sectionRef}>
      <div className={styles.sticky}>
        <Heading />
        {projects.map((project, i) => {
          const v = u * 5 - i;
          const fadeIn = i === 4 ? smoothstep(0.4, 0.54, v) : smoothstep(0.5, 0.64, v);
          const fadeOut = i === 4 ? 1 - smoothstep(0.62, 0.74, v) : 1 - smoothstep(0.88, 1, v);
          const opacity = fadeIn * fadeOut;
          return (
            <div
              key={project.id}
              className={styles.zoomCard}
              style={{
                opacity,
                transform: `translateY(calc(-50% + ${(1 - fadeIn) * 36}px))`,
                pointerEvents: opacity > 0.5 ? 'auto' : 'none',
                visibility: opacity > 0.02 ? 'visible' : 'hidden',
              }}
            >
              <ProjectCard project={project} index={0} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StackedProjects() {
  return (
    <section className={styles.projects} id="work">
      <div className={styles.inner}>
        <Heading />
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Projects() {
  return useZoomMode() ? <ZoomProjects /> : <StackedProjects />;
}
