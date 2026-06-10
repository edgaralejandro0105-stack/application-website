import React from 'react';

export function StrobeBackground() {
  return (
    <>
      <style>{`
        @keyframes strobe-flash {
          0%, 100% { opacity: 0; }
          3% { opacity: 0.2; }
          6% { opacity: 0; }
          48% { opacity: 0; }
          51% { opacity: 0.15; }
          54% { opacity: 0; }
        }
        @keyframes hl-yellow {
          0%, 100% { opacity: 0; }
          5% { opacity: 0.4; }
          10% { opacity: 0; }
          40% { opacity: 0; }
          45% { opacity: 0.35; }
          50% { opacity: 0; }
        }
        @keyframes hl-pink {
          0%, 100% { opacity: 0; }
          12% { opacity: 0.4; }
          17% { opacity: 0; }
          52% { opacity: 0; }
          57% { opacity: 0.35; }
          62% { opacity: 0; }
        }
        @keyframes hl-blue {
          0%, 100% { opacity: 0; }
          20% { opacity: 0.35; }
          25% { opacity: 0; }
          65% { opacity: 0; }
          70% { opacity: 0.3; }
          75% { opacity: 0; }
        }
        @keyframes hl-orange {
          0%, 100% { opacity: 0; }
          8% { opacity: 0.35; }
          13% { opacity: 0; }
          35% { opacity: 0; }
          38% { opacity: 0.4; }
          43% { opacity: 0; }
          78% { opacity: 0; }
          82% { opacity: 0.3; }
          86% { opacity: 0; }
        }
        @keyframes hl-green {
          0%, 100% { opacity: 0; }
          28% { opacity: 0.35; }
          33% { opacity: 0; }
          72% { opacity: 0; }
          76% { opacity: 0.3; }
          80% { opacity: 0; }
        }
        .strobe-wrap {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .strobe-spot {
          position: absolute;
          width: 100%;
          height: 100%;
          filter: blur(60px);
        }
        .hl-yellow {
          background: radial-gradient(ellipse at 30% 30%, #ffe74d 0%, transparent 55%);
          animation: hl-yellow 3.6s ease-in-out infinite;
        }
        .hl-pink {
          background: radial-gradient(ellipse at 70% 60%, #ff2d8e 0%, transparent 55%);
          animation: hl-pink 4.2s ease-in-out infinite;
        }
        .hl-blue {
          background: radial-gradient(ellipse at 20% 70%, #00bfff 0%, transparent 50%);
          animation: hl-blue 5s ease-in-out infinite;
        }
        .hl-orange {
          background: radial-gradient(ellipse at 80% 25%, #ff6b2d 0%, transparent 55%);
          animation: hl-orange 3s ease-in-out infinite;
        }
        .hl-green {
          background: radial-gradient(ellipse at 50% 80%, #39ff6e 0%, transparent 50%);
          animation: hl-green 4s ease-in-out infinite;
        }
        .flash-overlay {
          position: absolute;
          inset: 0;
          background: white;
          filter: blur(80px);
          animation: strobe-flash 2.2s ease-in-out infinite;
          opacity: 0;
        }
      `}</style>
      <div className="strobe-wrap">
        <div className="strobe-spot hl-yellow" />
        <div className="strobe-spot hl-pink" />
        <div className="strobe-spot hl-blue" />
        <div className="strobe-spot hl-orange" />
        <div className="strobe-spot hl-green" />
        <div className="flash-overlay" />
      </div>
    </>
  );
}
