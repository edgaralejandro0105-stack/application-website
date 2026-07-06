import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ClientPortal } from './pages/ClientPortal';
import './index.css';

import { ClientAuthProvider } from './context/ClientAuthContext';

function App() {
  useEffect(() => {
    // Ping API to wake up Render server (Cold Start Mitigation)
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
    fetch(`${apiUrl}/products`).catch(() => {});

    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-background min-h-screen text-on-background selection:bg-primary/30 selection:text-primary flex flex-col overflow-x-clip">
      <ClientAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/portal" element={<ClientPortal />} />
          </Routes>
        </BrowserRouter>
      </ClientAuthProvider>
    </div>
  );
}

export default App;
