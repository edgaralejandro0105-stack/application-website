import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ClientPortal } from './pages/ClientPortal';
import { GlobalLoader } from './components/GlobalLoader';
import './index.css';

import { ClientAuthProvider } from './context/ClientAuthContext';

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const retriesRef = useRef(0);
  const MAX_RETRIES = 30;

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';

    const wakeBackend = async () => {
      try {
        const res = await fetch(`${apiUrl}/products`, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          setBackendReady(true);
          return;
        }
      } catch {
        // server not ready yet
      }
      retriesRef.current += 1;
      if (retriesRef.current < MAX_RETRIES) {
        setTimeout(wakeBackend, 3000);
      } else {
        setBackendReady(true);
      }
    };

    wakeBackend();

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

  if (!backendReady) {
    return <GlobalLoader />;
  }

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
