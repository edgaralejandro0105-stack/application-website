import React from 'react';

export function SideDecorations() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* === CÍRCULOS GRANDES CON BLUR === */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full border border-primary/10" />
      <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-primary/5 blur-[80px]" />

      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-secondary/5 blur-[70px]" />
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-secondary/10" />

      <div className="absolute -bottom-36 -left-36 w-80 h-80 rounded-full bg-tertiary/5 blur-[90px]" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full border border-tertiary/10" />

      <div className="absolute -bottom-28 -right-28 w-60 h-60 rounded-full bg-primary/5 blur-[60px]" />

      {/* === ANILLOS / ANILLOS CON PUNTOS === */}
      <div className="absolute top-1/4 -left-16 w-32 h-32 rounded-full border border-primary/10 border-dashed hidden xl:block" />
      <div className="absolute top-1/4 -left-12 w-24 h-24 rounded-full border border-primary/15 hidden xl:block" />

      <div className="absolute top-3/4 -right-20 w-40 h-40 rounded-full border border-secondary/10 border-dashed hidden xl:block" />
      <div className="absolute top-3/4 -right-14 w-28 h-28 rounded-full border border-secondary/15 hidden xl:block" />

      <div className="absolute top-1/2 -left-24 w-20 h-20 rounded-full border border-tertiary/10 hidden xl:block" />
      <div className="absolute top-1/2 -right-24 w-16 h-16 rounded-full border border-primary/10 hidden xl:block" />

      {/* === LÍNEAS VERTICALES === */}
      <div className="absolute top-10 bottom-10 left-4 w-px bg-gradient-to-b from-transparent via-primary/15 via-30% to-transparent hidden xl:block" />
      <div className="absolute top-10 bottom-10 left-8 w-[1px] bg-gradient-to-b from-transparent via-secondary/10 via-60% to-transparent hidden xl:block" />
      <div className="absolute top-10 bottom-10 right-4 w-px bg-gradient-to-b from-transparent via-secondary/15 via-70% to-transparent hidden xl:block" />
      <div className="absolute top-10 bottom-10 right-8 w-[1px] bg-gradient-to-b from-transparent via-primary/10 via-40% to-transparent hidden xl:block" />

      {/* === PUNTOS DECORATIVOS === */}
      <div className="absolute top-[12%] left-6 w-2 h-2 rounded-full bg-primary/20 hidden xl:block" />
      <div className="absolute top-[18%] left-10 w-1 h-1 rounded-full bg-secondary/20 hidden xl:block" />
      <div className="absolute top-[28%] left-6 w-1.5 h-1.5 rounded-full bg-tertiary/20 hidden xl:block" />
      <div className="absolute top-[38%] left-10 w-1 h-1 rounded-full bg-primary/15 hidden xl:block" />
      <div className="absolute top-[48%] left-6 w-2 h-2 rounded-full bg-secondary/15 hidden xl:block" />
      <div className="absolute top-[58%] left-10 w-1.5 h-1.5 rounded-full bg-primary/20 hidden xl:block" />
      <div className="absolute top-[68%] left-6 w-1 h-1 rounded-full bg-tertiary/15 hidden xl:block" />
      <div className="absolute top-[78%] left-10 w-2 h-2 rounded-full bg-secondary/20 hidden xl:block" />
      <div className="absolute top-[88%] left-6 w-1 h-1 rounded-full bg-primary/15 hidden xl:block" />

      <div className="absolute top-[8%] right-6 w-1.5 h-1.5 rounded-full bg-secondary/20 hidden xl:block" />
      <div className="absolute top-[22%] right-10 w-1 h-1 rounded-full bg-primary/20 hidden xl:block" />
      <div className="absolute top-[32%] right-6 w-2 h-2 rounded-full bg-tertiary/15 hidden xl:block" />
      <div className="absolute top-[42%] right-10 w-1.5 h-1.5 rounded-full bg-secondary/20 hidden xl:block" />
      <div className="absolute top-[52%] right-6 w-1 h-1 rounded-full bg-primary/15 hidden xl:block" />
      <div className="absolute top-[62%] right-10 w-2 h-2 rounded-full bg-tertiary/20 hidden xl:block" />
      <div className="absolute top-[72%] right-6 w-1.5 h-1.5 rounded-full bg-secondary/15 hidden xl:block" />
      <div className="absolute top-[82%] right-10 w-1 h-1 rounded-full bg-primary/20 hidden xl:block" />
      <div className="absolute top-[92%] right-6 w-2 h-2 rounded-full bg-tertiary/15 hidden xl:block" />

      {/* === LÍNEAS HORIZONTALES CORTAS === */}
      <div className="absolute top-[20%] left-0 w-12 h-px bg-gradient-to-r from-primary/20 to-transparent hidden xl:block" />
      <div className="absolute top-[45%] left-0 w-8 h-px bg-gradient-to-r from-secondary/15 to-transparent hidden xl:block" />
      <div className="absolute top-[70%] left-0 w-16 h-px bg-gradient-to-r from-tertiary/15 to-transparent hidden xl:block" />

      <div className="absolute top-[15%] right-0 w-10 h-px bg-gradient-to-l from-secondary/20 to-transparent hidden xl:block" />
      <div className="absolute top-[55%] right-0 w-14 h-px bg-gradient-to-l from-primary/15 to-transparent hidden xl:block" />
      <div className="absolute top-[80%] right-0 w-8 h-px bg-gradient-to-l from-tertiary/15 to-transparent hidden xl:block" />

      {/* === PEQUEÑOS CUADRADOS / ROMBOS === */}
      <div className="absolute top-[15%] left-10 w-2 h-2 rotate-45 border border-primary/20 hidden xl:block" />
      <div className="absolute top-[55%] left-10 w-1.5 h-1.5 rotate-45 border border-secondary/20 hidden xl:block" />
      <div className="absolute top-[35%] right-10 w-2 h-2 rotate-45 border border-tertiary/20 hidden xl:block" />
      <div className="absolute top-[75%] right-10 w-1.5 h-1.5 rotate-45 border border-primary/20 hidden xl:block" />

      {/* === LÍNEAS DIAGONALES SUTILES === */}
      <div className="absolute top-[10%] left-0 w-20 h-px rotate-12 origin-left bg-gradient-to-r from-primary/10 to-transparent hidden xl:block" />
      <div className="absolute top-[60%] right-0 w-16 h-px -rotate-12 origin-right bg-gradient-to-l from-secondary/10 to-transparent hidden xl:block" />
    </div>
  );
}
