import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import styles from './Bio.module.css';

const CHIPS = [
  '42 Abu Dhabi · RNCP Level 6 (exp. 2026)',
  'Based in Abu Dhabi, UAE',
  'Open to roles · AI/ML · Data · Systems',
] as const;

export default function Bio() {
  const { ref, style } = useReveal();

  return (
    <section className={styles.bio} id="about">
      <animated.div ref={ref} style={style} className={styles.inner}>
        <p className={styles.text}>
          I&rsquo;m a software engineer from Abu Dhabi, trained at 42 — a
          peer-learning school with no teachers and no lectures. I build at the
          intersection of systems programming and machine learning, and
          I&rsquo;m working toward an MSc in AI/ML.
        </p>
        <div className={styles.chips}>
          {CHIPS.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
      </animated.div>
    </section>
  );
}
