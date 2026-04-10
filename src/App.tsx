import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingScreen } from './components/loadingscreen';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
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
    <ErrorBoundary>
      <div className="min-h-screen bg-[#000000] text-white">
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

        <Navigation />
        <Hero />
        <Skills />
        <Projects />
        <Research />
        <WorkExperience />
        <Gallery />
        <Contact />

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;