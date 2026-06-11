import { useEffect, useMemo } from 'react';
import { ArrowDown, Download } from 'lucide-react';
import { animated, useTrail, useSpring } from '@react-spring/web';
import styles from './Hero.module.css';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function Hero() {
  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Staggered entrance: name → tagline → meta → CTAs
  const trail = useTrail(4, {
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
    delay: 200,
    immediate: reduced,
    config: { tension: 110, friction: 24 },
  });

  // Parallax fade as the hero scrolls away
  const [{ p }, api] = useSpring(() => ({ p: 0 }));
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      api.start({
        p: clamp01(window.scrollY / (window.innerHeight * 0.75)),
        immediate: true,
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [api, reduced]);

  const wrap = (style: (typeof trail)[number]) => ({
    opacity: style.opacity,
    transform: style.y.to((v) => `translateY(${v}px)`),
  });

  return (
    <section className={styles.hero} id="top">
      <animated.div
        className={styles.content}
        style={{
          opacity: p.to((v) => 1 - v * 0.95),
          transform: p.to((v) => `translateY(${v * -56}px) scale(${1 - v * 0.04})`),
        }}
      >
        <animated.h1 style={wrap(trail[0])} className={styles.name}>
          Abdullah Sayed
        </animated.h1>
        <animated.p style={wrap(trail[1])} className={styles.tagline}>
          I build systems that think.
          <br />
          From CPU inference engines in C to full-stack AI products —<br />
          I work close to the metal and close to the model.
        </animated.p>
        <animated.p style={wrap(trail[2])} className={styles.meta}>
          [42 Abu Dhabi · AI/ML · Systems Engineering]
        </animated.p>
        <animated.div style={wrap(trail[3])} className={styles.ctas}>
          <a href="#work" className={styles.primaryCta}>
            See my work
            <ArrowDown size={15} aria-hidden="true" className={styles.bounce} />
          </a>
          <a href="cv.pdf" download className={styles.secondaryCta}>
            <Download size={15} aria-hidden="true" />
            Download CV
          </a>
        </animated.div>
      </animated.div>

      {/* Scroll indicator — fades out the moment scrolling starts */}
      <animated.div
        className={styles.scrollIndicator}
        style={{ opacity: p.to((v) => Math.max(0, 1 - v * 5)) }}
        aria-hidden="true"
      >
        <div className={styles.mouse} />
        <span className={styles.scrollLabel}>
          scroll to travel · drag to look around
        </span>
      </animated.div>
    </section>
  );
}
