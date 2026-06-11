import { Download } from 'lucide-react';
import { animated } from '@react-spring/web';
import { useReveal } from '../../hooks/useReveal';
import styles from './Contact.module.css';

const EMAIL = 'abdsayed@hotmail.com';

const LINKS = [
  {
    label: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
  },
  {
    label: 'github.com/AbdullahSayed038',
    href: 'https://github.com/AbdullahSayed038',
    external: true,
  },
  {
    label: 'linkedin.com/in/abdullah-sayed-ab1913387',
    href: 'https://linkedin.com/in/abdullah-sayed-ab1913387',
    external: true,
  },
] as const;

export default function Contact() {
  const { ref, style } = useReveal();

  return (
    <section className={styles.contact} id="contact">
      <animated.div ref={ref} style={style} className={styles.inner}>
        <h2 className={styles.headline}>Let&rsquo;s work together.</h2>
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={styles.link}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="cv.pdf" download className={styles.cvButton}>
          <Download size={15} aria-hidden="true" />
          Download CV
        </a>
        <p className={styles.footer}>
          Abdullah Sayed · Abu Dhabi, UAE
        </p>
      </animated.div>
    </section>
  );
}
