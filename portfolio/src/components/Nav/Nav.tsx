import { useEffect, useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import styles from './Nav.module.css';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand} onClick={close}>
          Abdullah Sayed
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
          <a href="cv.pdf" download className={styles.cvButton}>
            <Download size={14} aria-hidden="true" />
            Download CV
          </a>
        </nav>

        <button
          className={styles.menuToggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav
        className={`${styles.mobileMenu} ${open ? styles.mobileOpen : ''}`}
        aria-label="Mobile"
      >
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className={styles.mobileLink} onClick={close}>
            {link.label}
          </a>
        ))}
        <a href="cv.pdf" download className={styles.mobileCv} onClick={close}>
          <Download size={14} aria-hidden="true" />
          Download CV
        </a>
      </nav>
    </header>
  );
}
