import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Zonas', href: '#zonas' },
    { name: 'Productos', href: '#productos' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Planificador', href: '#planificador' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-surface/80 backdrop-blur-[20px] py-4 border-white/10' : 'bg-transparent py-6 border-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/src/assets/casona_logo_2.png" alt="La Casona Fiestas" className="h-14 w-auto scale-[1.5] md:scale-[2.5] origin-left" />
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-jakarta text-sm font-medium text-on-surface-variant">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/50">
              {link.name}
            </a>
          ))}
        </div>

        <Button 
          variant="primary" 
          className="hidden md:inline-flex"
          onClick={() => {
            const el = document.getElementById('planificador');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Reserva
        </Button>
      </div>
    </nav>
  );
}
