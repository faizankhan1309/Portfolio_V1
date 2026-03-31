import { useState } from 'react';
import { LoadingScreen } from './components/loadingscreen';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';x
import { Videeo } from './components/Videeo';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Research } from './components/Research';
import { WorkExperience } from './components/WorkExperience';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#080B12] text-white">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <Navigation />
      <Hero />
      <Skills />
      <Videeo />
      <Projects />
      <Research />
      <WorkExperience />

      {/* Gallery pins, Contact slides over it */}
      <div style={{ position: 'relative', height: '200vh' }}>
        <Gallery />
        <Contact />
      </div>

      <Footer />
    </div>
  );
}

export default App;