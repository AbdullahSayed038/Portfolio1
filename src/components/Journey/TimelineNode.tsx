import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import styles from './TimelineNode.module.css';

export interface TimelineNodeData {
  phase: string;
  title: string;
  context: string;
}

interface TimelineNodeProps {
  node: TimelineNodeData;
  index: number;
}

export default function TimelineNode({ node, index }: TimelineNodeProps) {
  const { ref, style } = useReveal(index * 110);

  return (
    <animated.li ref={ref} style={style} className={styles.node}>
      <span className={styles.marker} aria-hidden="true" />
      <p className={styles.phase}>{node.phase}</p>
      <h3 className={styles.title}>{node.title}</h3>
      <p className={styles.context}>{node.context}</p>
    </animated.li>
  );
}
