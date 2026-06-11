import { ArrowRight } from 'lucide-react';
import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import type { Project } from '../../data/projects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { ref, style } = useReveal(index * 90);

  return (
    <animated.article ref={ref} style={style} className={styles.card}>
      <p className={styles.eyebrow}>{project.eyebrow}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.description}>{project.description}</p>
      <ul className={styles.stack} aria-label="Tech stack">
        {project.stack.map((tech) => (
          <li key={tech} className={styles.chip}>
            {tech}
          </li>
        ))}
      </ul>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {project.linkLabel}
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      ) : (
        <span className={styles.privateNote}>{project.linkLabel}</span>
      )}
    </animated.article>
  );
}
