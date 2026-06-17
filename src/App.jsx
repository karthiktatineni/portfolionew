import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Cursor from './components/Cursor';
import SmoothScroll from './components/SmoothScroll';
import ParticleBackground from './components/ParticleBackground';
import ChatBot from './components/ChatBot';
import { useIsTouchDevice } from './hooks/useIsTouchDevice';

// Main Site Components
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Media from './components/Media';
import Contact from './components/Contact';

// Dashboard Components
import DashboardLayout from './components/Dashboard/DashboardLayout';
import LeadsDashboard from './components/Dashboard/LeadsDashboard';
import LeadDetail from './components/Dashboard/LeadDetail';

const MainSite = ({ isLoading, isTouch }) => (
  <div className={`bg-[#0a0a0a] min-h-screen selection:bg-gold selection:text-black ${isTouch ? '' : 'cursor-none'}`}>
    <SmoothScroll />
    {!isTouch && <Cursor />}

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
      <Certifications />
      <ChatBot />
      <Media />
      <Contact />
    </main>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    // Simple loader simulation
    const timer = setTimeout(() => setIsLoading(false), 1000);

    // Ping the backend every 5 minutes to keep Vercel and Render servers awake
    const pingInterval = setInterval(() => {
        fetch('/api/ping').catch(() => {});
    }, 5 * 60 * 1000);

    // Initial ping
    fetch('/api/ping').catch(() => {});

    return () => {
        clearTimeout(timer);
        clearInterval(pingInterval);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Portfolio Route */}
        <Route path="/" element={<MainSite isLoading={isLoading} isTouch={isTouch} />} />

        {/* Dashboard Routes */}
        <Route path="/admin/leads" element={<DashboardLayout />}>
          <Route index element={<LeadsDashboard />} />
          <Route path=":id" element={<LeadDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
