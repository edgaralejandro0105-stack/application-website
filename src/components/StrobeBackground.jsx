import React from 'react';
import { motion } from 'framer-motion';

export function StrobeBackground() {
  return (
    <>
      <style>{`
        .strobe-wrap {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .strobe-light {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <div className="strobe-wrap">
        {/* Esfera Dorada (Elegante) */}
        <motion.div
          className="strobe-light"
          style={{ width: 800, height: 800, background: '#d4af37', left: '-20%', top: '-20%' }}
          animate={{ 
            opacity: [0.05, 0.12, 0.05],
            y: [0, 50, 0],
            x: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Esfera Violeta Profundo (Contraste) */}
        <motion.div
          className="strobe-light"
          style={{ width: 700, height: 700, background: '#4c1d95', right: '-15%', bottom: '-20%' }}
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            y: [0, -50, 0],
            x: [0, 40, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </>
  );
}
