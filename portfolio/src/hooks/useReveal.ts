import { useInView } from 'react-intersection-observer';
import { useSpring } from '@react-spring/web';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade-up scroll reveal. Returns an intersection-observer ref and a
 * react-spring style object to spread onto an <animated.*> element.
 * Respects prefers-reduced-motion (content appears instantly).
 */
export function useReveal(delay = 0) {
  const reduced = prefersReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const style = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(26px)',
    delay: inView ? delay : 0,
    immediate: reduced,
    config: { tension: 120, friction: 26 },
  });

  return { ref, style } as const;
}
