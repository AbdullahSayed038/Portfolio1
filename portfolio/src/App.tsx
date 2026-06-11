import ThreeBackground from './components/ThreeBackground/ThreeBackground';
import Nav from './components/Nav/Nav';
import Hero from './components/Hero/Hero';
import Bio from './components/Bio/Bio';
import Projects from './components/Projects/Projects';
import Journey from './components/Journey/Journey';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';

export default function App() {
  return (
    <>
      <ThreeBackground />
      <Nav />
      <main>
        <Hero />
        <Bio />
        <Projects />
        <Journey />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
