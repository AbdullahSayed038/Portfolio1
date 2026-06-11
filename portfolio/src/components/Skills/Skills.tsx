import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import styles from './Skills.module.css';

interface SkillGroup {
  heading: string;
  items: string[];
}

const GROUPS: SkillGroup[] = [
  {
    heading: 'Systems & Low-Level',
    items: ['C', 'C++', 'GGUF', 'Quantization', 'TCP/IP', 'Linux', 'WSL'],
  },
  {
    heading: 'AI / Data',
    items: [
      'Python',
      'FastAPI',
      'Ollama',
      'Qwen',
      'LLM inference',
      'BPE tokenization',
      'SQLAlchemy',
      'PostgreSQL',
    ],
  },
  {
    heading: 'Full-Stack',
    items: [
      'TypeScript',
      'React',
      'Next.js',
      'NestJS',
      'Vite',
      'CSS Modules',
      'GSAP',
      'React Native',
    ],
  },
];

export default function Skills() {
  const { ref, style } = useReveal();

  return (
    <section className={styles.skills}>
      <animated.div ref={ref} style={style} className={styles.inner}>
        <h2 className={styles.title}>Skills</h2>
        <div className={styles.columns}>
          {GROUPS.map((group) => (
            <div key={group.heading} className={styles.column}>
              <h3 className={styles.heading}>{group.heading}</h3>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.honest}>
          Gaps I&rsquo;m actively closing: Airflow, Spark, cloud platforms
          (AWS/GCP).
        </p>
      </animated.div>
    </section>
  );
}
