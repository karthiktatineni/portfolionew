import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Cursor from './components/Cursor';
import SmoothScroll from './components/SmoothScroll';
import ParticleBackground from './components/ParticleBackground';
import ChatBot from './components/ChatBot';

// Direct imports
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Media from './components/Media';
import Contact from './components/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loader simulation
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="bg-[#0a0a0a] min-h-screen cursor-none selection:bg-gold selection:text-black">
        <SmoothScroll />
        <Cursor />

        {/* Global Particles - Controlled inside component to hide on Hero */}
        <ParticleBackground />

        {/* Simple Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center text-gold font-bold tracking-widest uppercase animate-pulse">
            Loading Experience...
          </div>
        )}

        <Navigation />

        <main className="relative z-10 space-y-0">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <ChatBot />
          <Media />
          <Contact />
        </main>
      </div>
    </Router>
  );
}

export default App;
