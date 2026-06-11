import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import TimelineNode from './TimelineNode';
import type { TimelineNodeData } from './TimelineNode';
import styles from './Journey.module.css';

const NODES: TimelineNodeData[] = [
  {
    phase: 'Foundations',
    title: 'C & Systems',
    context:
      'minishell, philosophers, inception, CPP modules. Learning to read the OS, not just use it.',
  },
  {
    phase: 'Protocols',
    title: 'Networking',
    context: 'ft_IRC from scratch. TCP, sockets, real-time message handling in C++.',
  },
  {
    phase: 'Product',
    title: 'Full-Stack',
    context:
      'ft_transcendence as sole backend developer. TypeScript, NestJS, WebSockets, OAuth.',
  },
  {
    phase: 'Self-study',
    title: 'AI/ML',
    context:
      "Karpathy's Zero to Hero. Built a BPE tokenizer from scratch. Mathematics for ML. No shortcuts.",
  },
  {
    phase: 'Now',
    title: 'AI-native products',
    context:
      'Building AI-native products. Targeting an MSc in AI/ML (Georgia Tech OMSCS, Fall 2027).',
  },
];

export default function Journey() {
  const intro = useReveal();
  const quote = useReveal(NODES.length * 110 + 150);

  return (
    <section className={styles.journey} id="journey">
      <div className={styles.inner}>
        <animated.div ref={intro.ref} style={intro.style} className={styles.heading}>
          <h2 className={styles.title}>Journey</h2>
          <p className={styles.intro}>
            42 Abu Dhabi has no teachers. No lectures. No grades. You learn by
            building, breaking, and asking the person next to you. I joined in
            2024 and I&rsquo;m finishing with an RNCP Level 6 — the
            French national certification equivalent to a Bachelor&rsquo;s in
            engineering.
          </p>
        </animated.div>

        <ol className={styles.timeline}>
          {NODES.map((node, index) => (
            <TimelineNode key={node.title} node={node} index={index} />
          ))}
        </ol>

        <animated.blockquote ref={quote.ref} style={quote.style} className={styles.aside}>
          <p>Outside the terminal, I read.</p>
          <p>
            Kafka taught me that systems can be perfectly functional and
            completely absurd at the same time — useful when debugging
            distributed architecture. Dostoevsky showed me that the most
            complex logic lives in people, not machines. Orwell made me
            suspicious of abstraction layers that obscure what&rsquo;s actually
            happening.
          </p>
          <p>
            The writers I return to — Camus, Bulgakov, Nabokov, Hesse — all
            share something: they take ideas seriously without losing sight of
            the human underneath. I try to build the same way.
          </p>
        </animated.blockquote>
      </div>
    </section>
  );
}
