import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { SideDecorations } from '../components/SideDecorations';
import { StrobeBackground } from '../components/StrobeBackground';

const CENTER = [7.826858, -72.308681];
const ZOOM = 16;
const GMAPS_URL = `https://www.google.com/maps?q=${CENTER[0]},${CENTER[1]}`;

const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.8); opacity: 0; }
  }
  .leaflet-container {
    background: #111417;
  }
`;
document.head.appendChild(style);

const pinIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:40px;height:40px">
      <div style="position:absolute;inset:0;border-radius:50%;background:#d0bcff;opacity:0.3;animation:pulse 2s ease-in-out infinite"></div>
      <div style="position:absolute;inset:4px;border-radius:50%;background:#d0bcff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(208,188,255,0.6)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111417" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export function LocationSection() {
  const [hover, setHover] = useState(false);

  return (
    <section id="ubicacion" className="py-16 bg-background relative z-10">
      <SideDecorations />
      <StrobeBackground />
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wide text-center">
            Encuéntranos
          </h2>
          <p className="font-jakarta text-on-surface-variant text-sm text-center mb-8">
            Capacho Nuevo, Estado Táchira
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-white/5"
          style={{ height: 'clamp(300px, 50vh, 500px)' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            className="w-full h-full transition-all duration-500"
            style={{ filter: hover ? 'blur(4px)' : 'blur(0px)' }}
          >
            <MapContainer
              center={CENTER}
              zoom={ZOOM}
              zoomControl={false}
              attributionControl={false}
              scrollWheelZoom={false}
              dragging={false}
              touchZoom={false}
              doubleClickZoom={false}
              keyboard={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={CENTER} icon={pinIcon} />
            </MapContainer>
          </div>

          <div
            className="absolute inset-0 transition-all duration-500 rounded-2xl"
            style={{
              backgroundColor: hover ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
              pointerEvents: hover ? 'auto' : 'none',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <a
                href={GMAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-500"
                style={{
                  transform: hover ? 'translateY(0)' : 'translateY(20px)',
                  opacity: hover ? 1 : 0,
                }}
              >
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-jakarta font-semibold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg shadow-primary/25">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Ver en Google Maps
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
