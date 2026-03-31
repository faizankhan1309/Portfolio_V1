import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';       // ← back as a normal section
import { Videeo } from './components/Videeo';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Research } from './components/Research';
import { WorkExperience } from './components/WorkExperience';

import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#080B12] text-white">
      <Navigation />
      <Hero />       {/* Hero handles its own 300vh scroll animation */}
      <Skills />
      <Videeo />
      <Projects />
      <Research />
      <WorkExperience />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;