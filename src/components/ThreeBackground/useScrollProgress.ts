import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

/**
 * Normalized page scroll progress (0 → 1), stored in a ref so the
 * Three.js render loop can read it every frame without re-renders.
 * Consumed by ThreeBackground only.
 */
export function useScrollProgress(): MutableRefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      progress.current =
        max > 0 ? document.documentElement.scrollTop / max : 0;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}
